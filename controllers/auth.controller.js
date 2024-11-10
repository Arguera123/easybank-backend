import httpError from 'http-errors';
import User from '../models/User.model.js';
import { createToken, verifyToken } from '../utils/jw.tools.js';

const controller = {};

controller.register = async (req, res, next) => {
  try {
    const { name, lastname, username, email, password } = req.body;
    
    const user = await User.findOne({ email });
    console.log(user);

    if (user) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'User already exists' }));
      return;
    }

    const newUser = {
      name,
      lastname,
      username,
      email,
      password
    };

    const userInsert =  await User.create(newUser); 

    if (!userInsert) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Error creating user' }));
      return;
    }
    
    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'User created successfully' }));
    return;
  } catch (error) {
    next(error);
  }
};

controller.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Invalid username or password' }));
      return;
    }

    console.log(user);
    if (!user.comparePassword(password)) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Invalid username or password' }));
      return;
    }
    
    console.log('login');
    const token = await createToken(user._id);
    console.log(token);

    user.token = token;
  
    await user.updateOne( user._id, { token: token });

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ token: token }));
    return;
  } catch (error) {
    next(error);
  }
};

export default controller;
