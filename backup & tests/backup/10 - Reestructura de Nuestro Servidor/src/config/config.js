const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  mongoPassword: process.env.MONGO_PASSWORD,
  clientID: process.env.CLIENT_ID,
  callbackURL: process.env.CALLBACK_URL,
  clientSecret: process.env.CLIENT_SECRET,
};
