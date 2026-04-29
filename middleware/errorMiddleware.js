const env = require('../config/env');

function createHttpError(statusCode, message, details) {
  const error = new Error(message);
  error.statusCode = statusCode;

  if (details) {
    error.details = details;
  }

  return error;
}

function normalizeError(error) {
  if (error.code === 11000) {
    const duplicateFields = Object.keys(error.keyPattern || error.keyValue || {});
    const duplicateFieldLabel =
      duplicateFields.length > 0 ? duplicateFields.join(', ') : 'Unique field';

    return createHttpError(409, `${duplicateFieldLabel} already exists.`);
  }

  if (error.name === 'ValidationError') {
    const details = Object.values(error.errors).map(
      (validationError) => validationError.message
    );

    return createHttpError(400, 'Validation failed.', details);
  }

  if (error.name === 'JsonWebTokenError') {
    return createHttpError(401, 'Invalid access token.');
  }

  if (error.name === 'TokenExpiredError') {
    return createHttpError(401, 'Access token has expired.');
  }

  if (error.type === 'entity.parse.failed') {
    return createHttpError(400, 'Request body contains invalid JSON.');
  }

  return error;
}

function errorHandler(error, req, res, next) {
  const normalizedError = normalizeError(error);
  const statusCode = normalizedError.statusCode || 500;
  const response = {
    message:
      statusCode === 500 && env.nodeEnv === 'production'
        ? 'Internal server error.'
        : normalizedError.message || 'Internal server error.'
  };

  if (normalizedError.details) {
    response.details = normalizedError.details;
  }

  if (env.nodeEnv !== 'production' && normalizedError.stack) {
    response.stack = normalizedError.stack;
  }

  res.status(statusCode).json(response);
}

module.exports = {
  createHttpError,
  errorHandler
};
