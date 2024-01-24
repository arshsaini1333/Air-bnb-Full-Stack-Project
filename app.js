//Requiring all The packages we need

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const Listing = require("./models/listing.js");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressErrors.js");
const { listingScheema, reviewSchema } = require("./scheema.js");
const Review = require("./models/review.js");
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

//Root API
app.get("/", (req, res) => {
  res.send("Hello There");
});

//-------------Creating Routes------------------------

//Index Route

app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    let listings = await Listing.find({});
    res.render("listings/index", { listings });
  })
);

//Show Route

app.get(
  "/listings/:id/show",
  wrapAsync(async (req, res) => {
    let id = req.params.id;
    let listing = await Listing.findById(id).populate("reviews");

    res.render("listings/show", { listing });
  })
);

//Joi Middleware

//Listing Validation
const validateListing = (req, res, next) => {
  let { error } = listingScheema.validate(req.body);

  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

//Review Validation
const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);

  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

//Geting Rquest For new Listing
app.get("/listings/new", (req, res) => {
  res.render("listings/new");
});

//Getting Data For New Lsiting
app.post(
  "/listings",
  validateListing,
  wrapAsync(async (req, res) => {
    let newList = new Listing(req.body.listing);

    await newList.save();
    res.redirect("/listings");
  })
);

//Editing our List

app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    let id = req.params.id;
    let result = await Listing.findById(id);

    res.render("listings/edit", { result });
  })
);

//Adding updated data to the DB
app.put(
  "/listings/:id",
  validateListing,
  wrapAsync(async (req, res, next) => {
    let id = req.params.id;
    let updatedListing = req.body.listing;
    await Listing.updateOne({ _id: id }, updatedListing);
    res.redirect(`/listings/${id}/show`);
  })
);

//Deleting list

app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let id = req.params.id;
    await Listing.deleteOne({ _id: id });
    res.redirect("/listings");
  })
);

//Review Route

app.post(
  "/listings/:id/reviews",
  validateReview,
  wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let review = new Review(req.body.review);
    listing.reviews.push(review);
    await review.save();
    await listing.save();
    res.redirect(`/listings/${req.params.id}/show`);
  })
);

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
