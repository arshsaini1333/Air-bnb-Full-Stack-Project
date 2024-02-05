const express = require("express");
const route = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveUrl } = require("../middleware");
const userRoutes = require("../controllers/user.js");
//SignUp Get Request

route
  .route("/signup")
  .get(userRoutes.signUp)
  .post(wrapAsync(userRoutes.savingUser));

route
  .route("/login")
  .get(userRoutes.loginForm)
  .post(
    saveUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    wrapAsync(userRoutes.login)
  );

route.get("/logout", userRoutes.logOut);

module.exports = route;
