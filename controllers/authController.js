const { authenticateUser, registerUser } = require('../services/authService');
const asyncHandler = require('../middleware/asyncHandler');
const { createHttpError } = require('../middleware/errorMiddleware');

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateSignupInput({ name, email, password }) {
  const details = [];

  if (!name || typeof name !== 'string' || !name.trim()) {
    details.push('Name is required.');
  }

  if (!email || typeof email !== 'string' || !validateEmail(email.trim())) {
    details.push('A valid email is required.');
  }

  if (!password || typeof password !== 'string' || password.length < 8) {
    details.push('Password must be at least 8 characters long.');
  }

  return details;
}

function validateLoginInput({ email, password }) {
  const details = [];

  if (!email || typeof email !== 'string' || !validateEmail(email.trim())) {
    details.push('A valid email is required.');
  }

  if (!password || typeof password !== 'string') {
    details.push('Password is required.');
  }

  return details;
}

const signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const details = validateSignupInput({ name, email, password });

  if (details.length > 0) {
    throw createHttpError(400, 'Invalid signup payload.', details);
  }

  const user = await registerUser({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password
  });

  res.status(201).json({
    message: 'User created successfully.',
    user
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const details = validateLoginInput({ email, password });

  if (details.length > 0) {
    throw createHttpError(400, 'Invalid login payload.', details);
  }

  const result = await authenticateUser({
    email: email.trim().toLowerCase(),
    password
  });

  res.status(200).json({
    message: 'Login successful.',
    ...result
  });
});

const getCurrentUser = asyncHandler(async (req, res) => {
  res.status(200).json({
    user: req.user
  });
});

module.exports = {
  signup,
  login,
  getCurrentUser
};
