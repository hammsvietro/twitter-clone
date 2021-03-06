import { Request, Response } from 'express';
import dotenv from 'dotenv';
import knex from '../config/knex';

import { IUser } from '../database/models';
import isFollowing from '../utils/User/checkIfFollowing';
import serializeUsers from '../utils/User/serializeUsers';
import deleteFilesIfExists from '../utils/Storage/deleteFilesIfExists';

const BASE_URL = `http://${process.env.SV_ADDRESS}:${process.env.SV_PORT}/uploads/`;

dotenv.config();

class UserController {
  
  
  async index(req: Request, res: Response) {
  
    const users = await knex('users').select('id', 'name', 'username', 'email', 'profilePhoto', 'followers', 'following', 'profilePhoto', 'profilePhotoThumbnail');
    

    const serializedUsers = serializeUsers(users, BASE_URL);
    
    return res.status(200).send(serializedUsers);
  }

  async store(req: Request, res: Response) {

    const { username, email, name, password }: IUser = req.body;
    
    const available = await knex('users').where({ username }).orWhere({ email });

    if (available.length !== 0) return res.status(404).send({ error: 'username or email already taken' });

    await knex('users').insert({ name, username, email, password });
  
    return res.status(200).send({ sucess: `${name} is now registered` });

  }

  async unfollow(req: Request, res: Response) {
    const { id, followId } = req.params;

    
    if(!await isFollowing(id, followId)) return res.status(403).send({ error: 'can\'t unfollow if not following' });

    const trx = await knex.transaction();

    await trx('following').where({
      userId: id,
      followId
    }).del();

    await trx('users').where({ id }).decrement('following', 1);
    await trx('users').where({ id: followId }).decrement('followers', 1);

    await trx.commit();

    return res.status(200).send({ sucess: 'unfollowed user' });
  }

  async follow(req: Request, res: Response) {
    const { id, followId } = req.params;
    
    
    if(await isFollowing(id, followId)) return res.status(403).send({ error: 'already following users' });
    
    const trx = await knex.transaction();

    await trx('following').insert({
      userId: id,
      followId
    });

    await trx('users').where({ id }).increment('following', 1);
    await trx('users').where({ id: followId }).increment('followers', 1);

    await trx.commit();

    return res.status(200).send({ sucess: 'success' });
  }

  async changeProfilePicture(req: Request, res: Response) {

    const { id } = req.params;

    const trx = await knex.transaction();
    
    
    const user = await trx('users').where({ id });

    if(user.length === 0) return res.status(404).send({ error: 'user not found' });

    const oldPictures = [
      user[0].profilePhoto,
      user[0].profilePhotoThumbnail,
    ];


    if(!req.file || !res.locals.thumbnailName) return res.status(403).send({ error: 'an error occoured uploading the photos' });

    try {
      await trx('users').update({
        profilePhoto: req.file.filename,
        profilePhotoThumbnail: res.locals.thumbnailName,
      }).where({ id });
      
    } catch (error) {

      await trx.rollback();
      return res.status(403).send({ error: 'couldn\'t update the profile picture' });
    }

    await trx.commit();

    res.status(200).send({ success: 'profile picture updated' });

    return deleteFilesIfExists(oldPictures);
  }

}

export default new UserController();
