const User = require("../models/user");

//Creating Routes

//Signup Form
module.exports.signUp = (req, res) => {
  res.render("users/user.ejs");
};

//Saving user
module.exports.savingUser = async (req, res) => {
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
};

//Login Form
module.exports.loginForm = (req, res) => {
  res.render("users/login.ejs");
};

//Login
module.exports.login = async (req, res) => {
  req.flash("success", "You are loged in to WanderLust");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

//Logout
module.exports.logOut = (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You are logged out");
    res.redirect("/listings");
  });
};
