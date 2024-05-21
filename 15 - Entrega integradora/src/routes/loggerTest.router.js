const { Router } = require("express");

const router = Router();

router.get("/", (req, res) => {
  req.logger.error("this is an unhandled error", new Error("This is an error"));
  req.logger.warn("this is a warning");
  req.logger.http(" this is https");
  req.logger.info("this is a info log");
  req.logger.debug("this is a debug log");

  res.send({ status: "success", message: "Logger test" });
});

module.exports = {
  loggerTestsRouter: router,
};
