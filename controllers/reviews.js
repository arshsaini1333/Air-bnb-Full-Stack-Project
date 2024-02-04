const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

//Routes

//Adding Review
module.exports.savingReview = async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let review = new Review(req.body.review);
  review.author = req.user._id;
  listing.reviews.push(review);
  await review.save();
  await listing.save();
  req.flash("success", "New Review Created");
  res.redirect(`/listings/${req.params.id}/show`);
};

//Deleting Review
module.exports.deleteReview = async (req, res) => {
  let { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review Deleted");
  res.redirect(`/listings/${id}/show`);
};
