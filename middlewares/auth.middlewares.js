import httpErrors from 'http-errors';
import { verifyToken } from '../utils/jw.tools.js';
import User from '../models/User.model.js';

//import ROLE from '../data/configuration.constants.json' assert { type: "json" };

const middlewares = {};
const PREFIX = 'Bearer';

middlewares.authentication = async (req, res, next) => {

  try {
    const authorization = req.headers['authorization']; 

    if (!authorization) throw httpErrors(401, 'User not authenticated'); 

    const [prefix, token] = authorization.split(' ');

    if (!token) throw httpErrors(401, 'User not authenticated');

    if (prefix !== PREFIX) throw httpErrors(401, 'User not authenticated'); 

    const payload = await verifyToken(token);  

    if (!payload) throw httpErrors(401, 'User not authenticated'); 

    const userId = payload['sub'];

    const user = await User.findById(userId);

    if (!user) throw httpErrors(401, 'User not authenticated');

    const isValidToken = user.token === token;

    if (!isValidToken) throw httpErrors(401, 'User not authenticated'); 

    req.user = user;
    req.token = token;
    
    next();
  } catch (error) {
    next(error);
  }
};

export default middlewares;
