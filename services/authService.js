const jwt = require('jsonwebtoken');

const env = require('../config/env');
const User = require('../models/User');
const { createHttpError } = require('../middleware/errorMiddleware');

function generateAccessToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email
    },
    env.jwtSecret,
    {
      expiresIn: env.jwtExpiresIn
    }
  );
}

async function registerUser({ name, email, password }) {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw createHttpError(409, 'An account with this email already exists please try again.');
  }

  const user = await User.create({ name, email, password });

  return user.toJSON();
}

async function authenticateUser({ email, password }) {
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw createHttpError(401, 'Invalid email or password.');
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw createHttpError(401, 'Invalid email or password.');
  }

  const token = generateAccessToken(user);

  return {
    token,
    expiresIn: env.jwtExpiresIn,
    user: user.toJSON()
  };
}

module.exports = {
  registerUser,
  authenticateUser,
  generateAccessToken
};
