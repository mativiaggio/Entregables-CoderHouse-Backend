const express = require("express");
const router = express.Router();
const User = require("../models/users");
const { isValidPassword, createHash } = require("../utils");

router.get("/reset-password", (req, res) => {
  const { token } = req.query;
  res.render("resetPassword", { token });
});

router.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;
  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiry: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ error: "Token is invalid or has expired" });
  }

  if (isValidPassword(user, newPassword)) {
    return res
      .status(400)
      .json({ error: "New password cannot be the same as the old password" });
  }

  user.password = createHash(newPassword);
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;
  await user.save();

  // res.status(200).json({ message: "Password has been reset" });
  res.redirect("/login");
});

module.exports = router;
