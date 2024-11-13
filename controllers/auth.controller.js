import User from '../models/User.model.js';
import { createToken, verifyToken } from '../utils/jw.tools.js';
import httpError from 'http-errors';

const controller = {};

controller.register = async (req, res, next) => {
  try {
    const { name, lastname, username, email, password } = req.body;

    const user = await User.findOne({ email });

    if (user) throw httpError(400, 'User already exists');

    const newUser = {
      name,
      lastname,
      username,
      email,
      password
    };

    const userInsert = await User.create(newUser);

    if (!userInsert) throw httpError(500, 'Error creating user'); 
    
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

    if (!user) throw httpError(401, 'Invalid username or password'); 

    if (!user.comparePassword(password)) throw httpError(401, 'Invalid username or password'); 

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
    const { _id, name, lastname, username, email, rol } = req.user;

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ _id, name, lastname, username, email, rol }));

  } catch (error) {
    next(error);
  }
};

export default controller;
