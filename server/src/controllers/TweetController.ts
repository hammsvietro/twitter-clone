import { Request, Response } from 'express';
import knex from '../config/knex';

import sortTweetsByMostRecent from '../utils/Tweet/sortTweetsByMostRecent';

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
      .join('users', 'tweets.userId', 'users.id')
      .select('tweets.*', 'users.profilePhotoThumbnail', 'users.name', 'users.username')
      .limit(50);

    const retweets = await knex('retweets').whereIn('retweets.retweetUserId', following).select('retweets.isQuote', 'retweets.quote', 'retweets.retweetUserId')
      .join('users', 'retweets.retweetUserId', 'users.id')
      .select('users.profilePhotoThumbnail', 'users.name', 'users.username')
      .join('tweets', 'retweets.tweetId', 'tweets.id')
      .select('tweets.id', 'tweets.content', 'tweets.userId', 'tweets.mainTweetId', 'tweets.replies', 'tweets.retweets', 'tweets.likes', 'tweets.isReply', 'tweets.time')
      .limit(20);

    const dashboardContent = sortTweetsByMostRecent(tweets.concat(retweets));

    return res.status(200).send(dashboardContent);
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
    
    const tweet: any = await trx('tweets').where({ id: tweetId });
    
    if(tweet.length === 0) return res.status(404).send({ error: 'tweet not found' });
    
    await trx('tweets').where({ id: tweetId }).increment('retweets', 1);

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

  async like(req: Request, res: Response) {

    const { userId, tweetId } = req.params;

    const trx = await knex.transaction();

    const user = await trx('users').where({ id: userId }).first();
    if(!user) {
      await trx.rollback();
      return res.status(404).send({ error: 'user not found' });
    } 


    const tweet = await trx('tweets').where({ id: tweetId }).first();
    if(!tweet) {
      await trx.rollback();
      return res.status(404).send({ error: 'tweet not found' });
    } 
      

    const alreadyLiked = await trx('tweetLikes').where({ userId, tweetId }).first();
    
    if(alreadyLiked) {
      await trx.rollback(); 
      return res.status(403).send({ error: 'can\'t like a tweet twice' });
    }

    try {
      
      await trx('tweets').where({ id: tweetId }).increment('likes', 1);
      await trx('tweetLikes').insert({ userId, tweetId });

    } catch (error) {
      await trx.rollback();
      console.log(error);
      return res.status(503).send({ error: 'could\'t like tweet, try again later' });
    }

    await trx.commit();

    return res.status(200).send({ success: `liked tweet` });

  }
  
}

export default new TweetController();
