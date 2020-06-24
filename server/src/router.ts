import { Router } from 'express';
import UserController from './controllers/UserController';
import TweetController from './controllers/TweetController';

const router = Router();

router.get('/users', UserController.index);
router.post('/users', UserController.store);

router.get('/tweet/:id', TweetController.store);

export default router;
