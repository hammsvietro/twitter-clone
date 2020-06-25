import { Router } from 'express';
import UserController from './controllers/UserController';
import TweetController from './controllers/TweetController';

const router = Router();

router.get('/users', UserController.index);
router.post('/users', UserController.store);

router.post('/tweet/:id', TweetController.store);
router.get('/tweet', TweetController.show);

export default router;
