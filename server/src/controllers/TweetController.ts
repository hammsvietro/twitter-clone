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



    await knex('tweets').insert({
      userId: id,
      content,
    });
  

    return res.status(200).send({ success: 'tweet successfuly posted' }); 
  }

  async show(req: Request, res: Response) {

    
    const { id } = req.params;

    const following = await knex('following').where({ userId: id }).pluck('followId');

    const tweets = await knex('tweets')
      .whereIn('tweets.userId', following)
      .limit(50);
    const retweets = await knex('retweets').whereIn('retweets.retweetUserId', following).select('retweets.isQuote', 'retweets.quote', 'retweets.retweetUserId')
      .join('users', 'retweets.retweetUserId', 'users.id')
      .select('users.name')
      .join('tweets', 'retweets.tweetId', 'tweets.id')
      .select('tweets.id', 'tweets.content', 'tweets.userId', 'tweets.mainTweetId', 'tweets.replies', 'tweets.retweets', 'tweets.likes', 'tweets.isReply', 'tweets.time');

      

    return res.status(200).send(tweets.concat(retweets));
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

  async retweet(req: Request, res: Response) {
    const { userId, tweetId } = req.params;

    const trx = await knex.transaction();


    await trx('tweets').where({ id: tweetId }).increment('retweets', 1);

    const tweet: any = await trx('tweets').where({ id: tweetId });

    if(!tweet) return res.status(404).send({ error: 'tweet not found' });

    await knex('retweets').insert({
      tweetId,
      retweetUserId: userId
    });

    await trx.commit();

    return res.status(200).send({ success: 'retweeted successfuly' });

  }

  async quote(req: Request, res: Response) {

    const { tweetId, userId } = req.params;
    const { content } = req.body;

    console.log(content);

    const trx = await knex.transaction();

    const tweet = await trx('tweets').where({ id: tweetId });
    if(!tweet) return res.status(404).send({ error: 'tweet not found' });

    await trx('retweets').insert({
      tweetId,
      retweetUserId: userId,
      quote: content,
      isQuote: true
    });

    trx.commit();

    return res.status(200).send({ success: 'quote posted' });

  }
  
}

export default new TweetController();
