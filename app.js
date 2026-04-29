const cors = require('cors');
const express = require('express');
const helmet = require('helmet');

const env = require('./config/env');
const authRoutes = require('./routes/authRoutes');
const loggerMiddleware = require('./middleware/loggerMiddleware');
const notFoundMiddleware = require('./middleware/notFoundMiddleware');
const { errorHandler } = require('./middleware/errorMiddleware');

const app = express();

app.disable('x-powered-by');

app.use(helmet());
app.use(
  cors({
    origin:
      env.corsOrigin === '*'
        ? true
        : env.corsOrigin.split(',').map((origin) => origin.trim()),
    credentials: true
  })
);
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false }));
app.use(loggerMiddleware);

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    environment: env.nodeEnv
  });
});

app.use('/api/auth', authRoutes);
app.use(notFoundMiddleware);
app.use(errorHandler);

module.exports = app;
