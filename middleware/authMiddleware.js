const jwt = require('jsonwebtoken');

const env = require('../config/env');
const User = require('../models/User');
const asyncHandler = require('./asyncHandler');
const { createHttpError } = require('./errorMiddleware');

const authMiddleware = asyncHandler(async (req, res, next) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    throw createHttpError(
      401,
      'Authorization token is missing or malformed.'
    );
  }

  const token = authorizationHeader.split(' ')[1];

  let decodedToken;

  try {
    decodedToken = jwt.verify(token, env.jwtSecret);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw createHttpError(401, 'Access token has expired.');
    }

    throw createHttpError(401, 'Invalid access token.');
  }

  const user = await User.findById(decodedToken.sub);

  if (!user) {
    throw createHttpError(401, 'The token does not belong to an active user.');
  }

  req.user = user.toJSON();
  next();
});

module.exports = authMiddleware;
