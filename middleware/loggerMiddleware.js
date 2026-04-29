function loggerMiddleware(req, res, next) {
  const start = process.hrtime.bigint();

  res.on('finish', () => {
    const durationInMs = Number(process.hrtime.bigint() - start) / 1e6;

    console.log(
      `${new Date().toISOString()} ${req.ip} ${req.method} ${req.originalUrl} ${res.statusCode} ${durationInMs.toFixed(2)}ms`
    );
  });

  next();
}

module.exports = loggerMiddleware;
