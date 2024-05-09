const { logger, prodLogger, devLogger } = require("../utils/logger");

const addLogger = (req, res, next) => {
  if (process.env.NODE_ENV === "production") {
    req.logger = prodLogger;
  } else {
    req.logger = devLogger;
  }
  req.logger.info(`NODE_ENV ${process.env.NODE_ENV}`);
  req.logger.http(
    `${req.method} to ${req.url} - ${new Date().toLocaleDateString()}`
  );

  next();
};

module.exports = addLogger;
