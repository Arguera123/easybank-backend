import httpErrors from 'http-errors';
import verifyToken from '../utils/jw.tools.js';
import User from '../models/User.model.js';

import ROLE from '../constants/roles.js';

const middlewares = {};
const PREFIX = 'Bearer ';

middlwares.authentication = async (req, res, next) => {
  const { authorization } = req.headers; 

  if (!authorization) throw httpErrors(401, 'User not authenticated');

  const [prefix, token] = authorization.split(' ');

  if (prefix !== PREFIX) throw htpErrors(401, 'User not authenticatd');

  const payload = await verifyToken(token);  
};
