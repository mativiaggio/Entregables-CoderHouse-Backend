const winston = require("winston");

const levels = {
  debug: 0,
  http: 1,
  info: 2,
  warn: 3,
  error: 4,
  fatal: 5,
};

const logger = winston.createLogger({
  levels: winston.config.npm.levels,
  transports: [
    new winston.transports.Console({
      level: "http",
      format: winston.format.cli(),
    }),
    new winston.transports.File({
      level: "error",
      filename: "./errors.log",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
      ),
    }),
  ],
});

const devLogger = winston.createLogger({
  levels: winston.config.npm.levels,
  transports: [
    new winston.transports.Console({
      level: "debug",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.cli()
      ),
    }),
  ],
});

const prodLogger = winston.createLogger({
  levels: winston.config.npm.levels,
  transports: [
    new winston.transports.Console({
      level: "info",
      format: winston.format.cli(),
    }),
    new winston.transports.File({
      level: "error",
      filename: "./prodError.log",
    }),
  ],
});

module.exports = {
  logger,
  devLogger,
  prodLogger,
};
