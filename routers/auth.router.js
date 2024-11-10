import controller from '../controllers/auth.controller.js';
import Router from './router.js';

const authRouter = new Router();

authRouter.add(
  'POST', 
  '/register',
  controller.register
);

authRouter.add(
  'POST',
  '/login',
  controller.login
);

export default authRouter;
