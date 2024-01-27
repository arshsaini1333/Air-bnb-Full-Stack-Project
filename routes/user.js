const express = require("express");
const route = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveUrl } = require("../middleware");

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
      await User.register(newUser, password);
      //Login the user after registration
      req.login(newUser, (err) => {
        if (err) {
          return next(err);
        }
        req.flash("success", `Welcome! ${username} to Wanderlust`);
        res.redirect("/listings");
      });
    } catch (e) {
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
  saveUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  wrapAsync(async (req, res) => {
    req.flash("success", "You are loged in to WanderLust");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
  })
);

//Logged Out Route

route.get("/logout", (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You are logged out");
    res.redirect("/listings");
  });
});

module.exports = route;
