//Requiring all The packages we need
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressErrors.js");
const listing = require("./routes/listing.js");
const review = require("./routes/review.js");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

//Defining port and Listning request
const port = 8080;
app.listen(port, () => {
  console.log("Listning Request");
});

//Setting Engines
app.use(express.static(path.join(__dirname + "/public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

//Parsing data
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); //Parsing Cookies

//Connection Mongoose
const mongoURL = "mongodb://127.0.0.1:27017/wanderLust";

main()
  .then((res) => {
    console.log("Connect Successfully");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(mongoURL);
}

//Using Sessions
const sessionOptions = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 10 * 24 * 60 * 60 * 1000,
    maxAge: 10 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

//Root API
app.get("/", (req, res) => {
  res.send("Hello There");
});

//Session

app.use(session(sessionOptions));
app.use(flash()); //Flash

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

//TO serialize and deserialoze users into sessions
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Flash Middleware
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");

  next();
});

app.get("/demouser", async (req, res) => {
  let fakeUser = new User({
    email: "fakeUser@gmail.com",
    username: "fakeUser",
  });
  let reg = await User.register(fakeUser, "password");
  res.send(reg);
});

//Using Our Routes
app.use("/listings", listing);
app.use("/listings/:id/reviews", review);

//If Path do not match with anyone
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

//Middleweres

app.use((err, req, res, next) => {
  let { status = 500, message = "Something went wrong" } = err;
  res.status(status).render("error.ejs", { err });
  // res.status(status).send(message);
});
