import Router from './router.js';
import userRouter from './user.router.js';
import authRouter from './auth.router.js';

const router = new Router();

router.use('/auth', authRouter);
router.use('/user', userRouter);

export default router;
