import { Router } from 'express';
import UserController from './controllers/UserController';
import TweetController from './controllers/TweetController';

const router = Router();

router.get('/users', UserController.index);
router.post('/users', UserController.store);
router.post('/follow/:id/:followId', UserController.follow);


router.post('/tweet/:id', TweetController.tweet);
router.get('/tweet/:id', TweetController.show);
router.get('/tweet/:userId/:tweetId', TweetController.index);
router.post('/tweets/reply/:id', TweetController.reply);

export default router;
