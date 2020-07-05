import { Router } from 'express';
import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import UserController from './controllers/UserController';
import TweetController from './controllers/TweetController';
import knex from './config/knex';
import multerConfig from './config/multer';

const upload = multer(multerConfig);

const router = Router();

router.get('/users', UserController.index);
router.post('/users', UserController.store);
router.post('/follow/:id/:followId', UserController.follow);
router.post('/unfollow/:id/:followId', UserController.unfollow);
router.put('/user/profilePhoto/:id', upload.single('image'), (req, res, next) => {

  sharp(path.resolve(__dirname, '..', 'uploads', req.file.filename))
    .resize(100, 100, {
      fit: 'inside',
    })
    .toFile(path.resolve(__dirname, '..', 'uploads', `thumbnail-${req.file.filename}`));

  return next();
}, (req, res) => {
  return res.status(200).send(req.file);
});


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
