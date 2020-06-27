import { Request, Response } from 'express';
import knex from '../database/config';

import { IUser, ITweet } from '../database/models';

class TweetController {

  async reply(req: Request, res: Response) {
    const { id } = req.params;

    const trx = await knex.transaction();

    const {
      content,
      mainTweetId
    }: ITweet = req.body;
  
    const sucess = await trx('tweets').insert({
      userId: id,
      content,
      mainTweetId,
      isReply: true
    });

    if(!sucess || !mainTweetId) return res.status(502).send({ error: 'cannot reply right now, try again later' });

    const tweets = await trx('tweets').where('id', mainTweetId).orWhere('mainTweetId', mainTweetId);

    await trx('tweets').where({ id: mainTweetId }).increment('replies', 1);


    await trx.commit();
    return res.status(200).send(tweets);

  }

  async tweet(req: Request, res: Response) {
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

  async index(req: Request, res: Response) {

    const { tweetId } = req.params;
    const trx = await knex.transaction();

    const tweet: any = await trx('tweets').where({ id: tweetId });
    if(!tweet) return res.status(404).send({ error: 'no tweet found' });
    const [user] = await trx('users').where({ id: tweet[0].userId });
    if(!user) return res.status(404).send({ error: 'no user found' });

    const replies = await trx('tweets').where({ mainTweetId: tweetId });
    

    await trx.commit();

    return res.status(200).send({ user, tweet, replies });
  }
  
}

export default new TweetController();
