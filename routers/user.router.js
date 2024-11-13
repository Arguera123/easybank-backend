import Router from './router.js';
import controller from '../controllers/user.controller.js';
import middlewares from '../middlewares/auth.middlewares.js';
import validators from '../validators/auth.validator.js';
import { validathor } from '../middlewares/validathor.middleware.js'; 

const userRouter = new Router();

userRouter.add('GET', 
  '/', 
  middlewares.authentication,
  controller.getUsers
);

export default userRouter;
