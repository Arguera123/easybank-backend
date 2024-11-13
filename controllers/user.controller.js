import httpError from 'http-errors';
import User from '../models/User.model.js';

const controller = {};

controller.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
      
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(users));
  } catch (error) {
    next(error);
  }
};

export default controller;
