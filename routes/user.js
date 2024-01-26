const express = require("express");
const route = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");

//SignUp Get Request
route.get("/signup", (req, res) => {
  res.render("users/user.ejs");
});

//SignUp Post Request
route.post(
  "/signup",
  wrapAsync(async (req, res) => {
    try {
      let { username, email, password } = req.body;
      let newUser = new User({ email, username });
      let result = await User.register(newUser, password);
      req.flash("success", `Welcome! ${username} to Wanderlust`);
      res.redirect("/listings");
    } catch (e) {
      console.log(e);
      req.flash("error", e.message);
      res.redirect("/signup");
    }
  })
);

//Login Get Requst

route.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

//Login Post Request

route.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  wrapAsync(async (req, res) => {
    req.flash("success", "You are loged in to WanderLust");
    res.redirect("/listings");
  })
);

module.exports = route;
