const { createHttpError } = require('./errorMiddleware');

function notFoundMiddleware(req, res, next) {
  next(createHttpError(404, `Route not found: ${req.originalUrl}`));
}

module.exports = notFoundMiddleware;
