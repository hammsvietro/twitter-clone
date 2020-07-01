import { Request, Response } from 'express';
import knex from '../database/config';

import { IUser } from '../database/models';

import isFollowing from '../utils/User/checkIfFollowing';

class UserController {
  async index(req: Request, res: Response) {
  
    const users = await knex('users').select('id', 'name', 'username', 'email', 'profilePhoto', 'followers', 'following');

    
    return res.status(200).send(users);
  }

  async store(req: Request, res: Response) {

    const { username, email, name, password }: IUser = req.body;
  
    const sucess = await knex('users').insert({ name, username, email, password });
  
    if(!sucess) return res.status(500).send({ error: `couldn't add ${name}, try again later` });
  
  
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
}

export default new UserController();
