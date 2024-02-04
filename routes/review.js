const express = require("express");
const route = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const {
  validateReview,
  isLoggedIn,
  isReviewAuthor,
} = require("../middleware.js");
const reviewRoutes = require("../controllers/reviews.js");
//Review Route

route.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewRoutes.savingReview)
);

//Deleting Reviews

route.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewRoutes.deleteReview)
);

module.exports = route;
