process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  process.exit(1);
});

const http = require('http');
const mongoose = require('mongoose');

const app = require('./app');
const env = require('./config/env');
const connectDB = require('./config/db');

const server = http.createServer(app);
let shutdownTimer;

async function closeDatabaseConnection() {
  try {
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error while closing MongoDB connection:', error);
  }
}

async function gracefulShutdown(signal, exitCode = 0) {
  console.log(`${signal} received. Shutting down gracefully...`);

  if (server.listening) {
    server.close(async () => {
      clearTimeout(shutdownTimer);
      await closeDatabaseConnection();
      console.log('HTTP server closed.');
      process.exit(exitCode);
    });

    shutdownTimer = setTimeout(async () => {
      await closeDatabaseConnection();
      process.exit(1);
    }, 10000);

    shutdownTimer.unref();
    return;
  }

  await closeDatabaseConnection();
  process.exit(exitCode);
}

async function startServer() {
  try {
    await connectDB(env.mongoUri);

    server.listen(env.port, () => {
      console.log(`Auth service running on port ${env.port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

process.on('SIGINT', () => {
  gracefulShutdown('SIGINT');
});

process.on('SIGTERM', () => {
  gracefulShutdown('SIGTERM');
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled rejection:', error);
  gracefulShutdown('unhandledRejection', 1);
});

startServer();
