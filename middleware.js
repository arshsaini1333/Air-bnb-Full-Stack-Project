const Listing = require("./models/listing");
const { listingScheema } = require("./scheema.js");
const ExpressError = require("./utils/ExpressErrors.js");
const { reviewSchema } = require("./scheema.js");
const Review = require("./models/review");
//Middlewares
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You are not logged in");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  let id = req.params.id;
  let listing = await Listing.findById(id);
  if (!listing.owner._id.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the owner of the list");
    return res.redirect(`/listings/${id}/show`);
  }
  next();
};

module.exports.validateListing = (req, res, next) => {
  let { error } = listingScheema.validate(req.body);

  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);

  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  console.log(review);
  console.log(res.locals.currUser);
  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "You dont have permission to delete this review");
    return res.redirect(`/listings/${id}/show`);
  }
  next();
};
