const { Router } = require("express");

const router = Router();

router.get("/", (req, res) => {
  res.render("home", { title: "Home Page" });
});

router.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts", { title: "Productos en Tiempo Real" });
});

module.exports = router;
