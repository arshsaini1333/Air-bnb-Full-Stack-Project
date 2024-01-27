const express = require("express");
const route = express.Router({ mergeParams: true });
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressErrors.js");
const { reviewSchema } = require("../scheema.js");
const Review = require("../models/review.js");
const { isLoggedIn } = require("../middleware.js");

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
//Review Route

route.post(
  "/",
  validateReview,
  wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let review = new Review(req.body.review);
    listing.reviews.push(review);
    await review.save();
    await listing.save();
    req.flash("success", "New Review Created");
    res.redirect(`/listings/${req.params.id}/show`);
  })
);

//Deleting Reviews

route.delete(
  "/:reviewId",
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted");
    res.redirect(`/listings/${id}/show`);
  })
);

module.exports = route;
