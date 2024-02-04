const express = require("express");
const route = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveUrl } = require("../middleware");
const userRoutes = require("../controllers/user.js");
//SignUp Get Request
route.get("/signup", userRoutes.signUp);

//SignUp Post Request
route.post("/signup", wrapAsync(userRoutes.savingUser));

//Login Get Requst

route.get("/login", userRoutes.loginForm);

//Login Post Request

route.post(
  "/login",
  saveUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  wrapAsync(userRoutes.login)
);

//Logged Out Route

route.get("/logout", userRoutes.logOut);

module.exports = route;
