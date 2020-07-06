import { Router } from 'express';
import multer from 'multer';

import knex from './config/knex';
import multerConfig from './config/multer';

import UserController from './controllers/UserController';
import TweetController from './controllers/TweetController';

import createProfileThumbnail from './middlewares/createProfilePictureThumbnail';


const upload = multer(multerConfig);

const router = Router();

router.get('/users', UserController.index);
router.post('/users', UserController.store);
router.post('/follow/:id/:followId', UserController.follow);
router.post('/unfollow/:id/:followId', UserController.unfollow);

// flow => save image, save thumbnail, save in DB new photos, send response, delete old pictures if is different than default photo. 
router.put('/user/profilePhoto/:id', upload.single('image'), createProfileThumbnail, UserController.changeProfilePicture);


router.post('/tweet/:id', TweetController.tweet);
router.get('/tweet/:id', TweetController.show);
router.get('/tweet/:userId/:tweetId', TweetController.index);
router.post('/tweets/reply/:id', TweetController.reply);
router.post('/retweet/:userId/:tweetId', TweetController.retweet);
router.post('/quote/:userId/:tweetId', TweetController.quote);

router.get('/follow', async (req, res) => {
  const follow = await knex('following');
  return res.status(200).send(follow);
});

export default router;
