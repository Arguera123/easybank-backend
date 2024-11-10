import httpError from 'http-errors';

export const getUser = (req, res, next) => {
  const userId = req.url.split('/').pop();
  const user = null;

  if (!user) {
    throw httpError(404, 'User not found');
  }

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(user));
};
