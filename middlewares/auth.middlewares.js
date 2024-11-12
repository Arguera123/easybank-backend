import httpErrors from 'http-errors';
import { verifyToken } from '../utils/jw.tools.js';
import User from '../models/User.model.js';

//import ROLE from '../data/configuration.constants.json' assert { type: "json" };

const middlewares = {};
const PREFIX = 'Bearer';

middlewares.authentication = async (req, res, next) => {

  try {
    const authorization = req.headers['authorization']; 

    if (!authorization) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'User not authenticated 1' }));
    }

    const [prefix, token] = authorization.split(' ');

    if (!token) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'User not authenticated 2' }));
    }

    if (prefix !== PREFIX) {
      console.log('prefix', prefix, 'i');
      console.log('PREFIX', PREFIX, 'i');
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'User not authenticated 3' }));
    }

    const payload = await verifyToken(token);  

    if (!payload) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'User not authenticated 4' }));
    }

    const userId = payload['sub'];

    const user = await User.findById(userId);
    console.log(user);

    if (!user) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'User not authenticated 5' }));
    }

    const isValidToken = user.token === token;
    console.log(isValidToken);

    if (!isValidToken) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'User not authenticated 6' }));
    }

    req.user = user;
    req.token = token;
    
    next();
  } catch (error) {
    next(error);
  }
};

export default middlewares;
