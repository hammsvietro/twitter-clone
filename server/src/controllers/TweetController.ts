import { Request, Response } from 'express';
import knex from '../database/config';

/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line no-unused-vars
import { IUser, ITweet } from '../database/models';

class TweetController {

  async store(req: Request, res: Response) {
    const { id } = req.params;

    const user: IUser = await knex('users').where('id', id).first();
    return res.status(200).send({ id: user.id, username: user.username });
  }


  
}

export default new TweetController();
