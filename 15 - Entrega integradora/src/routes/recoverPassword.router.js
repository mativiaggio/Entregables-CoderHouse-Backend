const express = require("express");
const router = express.Router();
const User = require("../models/users");
const { sendResetEmail } = require("../utils/emailService");
const { generateToken } = require("../utils/tokenService");

router.get("/forgot-password", (req, res) => {
  res.render("requestResetPassword");
});

router.post("/request-reset", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const token = generateToken();
  user.resetToken = token;
  user.resetTokenExpiry = Date.now() + 3600000;
  await user.save();

  sendResetEmail(user.email, token);

  res.redirect("/login");
});

module.exports = router;
