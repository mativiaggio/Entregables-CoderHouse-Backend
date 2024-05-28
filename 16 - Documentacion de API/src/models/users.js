const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  age: Number,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  cartId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cart",
  },
  resetToken: String,
  resetTokenExpiry: Date,
  role: { type: String, types: ["user", "premium", "admin"], default: "user" },
});

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;
