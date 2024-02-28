//Requiring all The packages we need

if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const favicon = require("@sefinek/express-favicon");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressErrors.js");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
//Routers

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const { error } = require("console");

//Setting Engines
app.use(favicon(__dirname + "/public/favicon.png"));
app.use(express.static(path.join(__dirname, "/public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

//Parsing data
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); //Parsing Cookies

const dbUrl = process.env.ATLASDB_URL;
// mongoose
//   .connect("mongodb://127.0.0.1:27017/wanderLust")
//   .then(() => console.log("Connected to database!"));
main()
  .then((res) => {
    console.log("Connect Successfully");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

const store = MongoStore.create({
  mongoUrl: dbUrl,
  // mongoUrl: "mongodb://127.0.0.1:27017/wanderLust",
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 60 * 60,
});

store.on("error", () => {
  console.log("Error in MONGO STORE", err);
});

//Using Session
const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 10 * 24 * 60 * 60 * 1000,
    maxAge: 10 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

//Root API
// app.get("/", (req, res) => {
//   res.send("Hello There");
// });

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
//Locals
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

//Using Our Routes
app.get("/", (req, res) => {
  res.render("listings/home");
});
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

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

const port = 8080;
app.listen(port, () => {
  console.log("Listning Request");
});
