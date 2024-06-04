const express = require("express");
const router = express.Router();
const User = require("../models/users");
const { sendResetEmail } = require("../utils/emailService");
const { generateToken } = require("../utils/tokenService");

router.post("/new-reset-request", async (req, res) => {
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

  res.status(200).json({ message: "Password reset email sent" });
});

module.exports = router;
