import httpError from 'http-errors';
import User from '../models/User.model.js';
import { createToken, verifyToken } from '../utils/jw.tools.js';

const controller = {};

controller.register = async (req, res, next) => {
  try {
    const { name, lastname, username, email, password } = req.body;

    const user = await User.findOne({ email });

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
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Invalid username or password' }));
      return;
    }

    if (!user.comparePassword(password)) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Invalid username or password' }));
      return;
    }

    const token = await createToken(user._id);

    const update = {
      $set: { token: token }
    }
  
    await User.updateOne( { email: user.email }, update);

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ token: token }));
    return;
  } catch (error) {
    next(error);
  }
};

controller.whoami = async (req, res, next) => {
  try {
    const { _id, name, lastname, username, email } = req.user;

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ _id, name, lastname, username, email }));

  } catch (error) {
    next(error);
  }
};

export default controller;
