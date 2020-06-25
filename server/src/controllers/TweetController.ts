import { Request, Response } from 'express';
import knex from '../database/config';

/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line no-unused-vars
import { IUser, ITweet } from '../database/models';

class TweetController {

  async store(req: Request, res: Response) {
    const { id } = req.params;

    const {
      content,
    }: ITweet = req.body;


    const user: IUser = await knex('users').where('id', id).first();

    if(!user.id) return res.send(404).send({ error: 'user not found' });



    const tweet = await knex('tweets').insert({
      userId: id,
      content,
    });
    

    return res.status(200).send(tweet); 
  }

  async show(req: Request, res: Response) {
  
    const tweets: ITweet[] = await knex('tweets');

    return res.status(200).send(tweets);
  }
  
}

export default new TweetController();
