const { Router } = require("express");
const userModel = require("../models/users");
const bcrypt = require("bcrypt");
const { createHash, isValidPassword } = require("../utils");
const passport = require("passport");

const sessionRouter = Router();

sessionRouter.post(
  "/register",
  passport.authenticate("register", {
    failurlRedirect: "/api/sessions/registerFail",
  }),
  async (req, res) => {
    res.send({ status: "success", mesage: "user registered" });
  }
);

sessionRouter.get("/registerFail", (req, res) => {
  req.status(401).send({ status: "error", error: "authenticate error" });
});

sessionRouter.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "/api/sessions/loginFail",
  }),
  async (req, res) => {
    const user = req.user;
    req.session.user = {
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      age: user.age,
    };

    res.send({
      status: "success",
      payload: req.session.user,
      message: "Successfully logged in",
    });
  }
);

sessionRouter.get("/loginFail", (req, res) => {
  res.status(401).send({ status: "error", error: "login fail" });
});

sessionRouter.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err)
      return res.status(500).send("there was an error destroying session");
  });
  res.redirect("/login");
});

sessionRouter.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (req, res) => {}
);

sessionRouter.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  async (req, res) => {
    req.session.user = {
      name: req.user.first_name,
      email: req.user.email,
      age: req.user.age,
    };

    res.redirect("/");
  }
);

sessionRouter.get("/current", (req, res) => {
  if (req.session.user) {
    res.send({ user: req.session.user });
  } else {
    res.status(401).send({ error: "No user logged in" });
  }
});

module.exports = sessionRouter;
