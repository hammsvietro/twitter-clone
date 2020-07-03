import { Router } from 'express';
import UserController from './controllers/UserController';
import TweetController from './controllers/TweetController';
import knex from './database/config';

const router = Router();

router.get('/users', UserController.index);
router.post('/users', UserController.store);
router.post('/follow/:id/:followId', UserController.follow);
router.post('/unfollow/:id/:followId', UserController.unfollow);


router.post('/tweet/:id', TweetController.tweet);
router.get('/tweet/:id', TweetController.show);
router.get('/tweet/:userId/:tweetId', TweetController.index);
router.post('/tweets/reply/:id', TweetController.reply);
router.post('/retweet/:userId/:tweetId', TweetController.retweet);

router.get('/follow', async (req, res) => {
  const follow = await knex('following');
  return res.status(200).send(follow);
});

export default router;
