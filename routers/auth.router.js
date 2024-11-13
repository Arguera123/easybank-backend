import controller from '../controllers/auth.controller.js';
import Router from './router.js';
import middlewares from '../middlewares/auth.middlewares.js';
import validators from '../validators/auth.validator.js';
import { validathor } from '../middlewares/validathor.middleware.js'; 

const authRouter = new Router();

authRouter.add(
  'POST', 
  '/register',
  validathor(validators.registerValidator),
  controller.register
);

authRouter.add(
  'POST',
  '/login',
  controller.login
);

authRouter.add(
  'GET',
  '/whoami',
  middlewares.authentication,
  controller.whoami
);

export default authRouter;
