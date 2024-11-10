import Router from './router.js';
import { getUser } from '../controllers/user.controller.js';

const userRouter = new Router();

userRouter.add('GET', '/', getUser);

export default userRouter;
