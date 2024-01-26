const express = require("express");
const route = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { listingScheema } = require("../scheema.js");
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressErrors.js");

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
//Index Route

route.get(
  "/",
  wrapAsync(async (req, res) => {
    let listings = await Listing.find({});
    res.render("listings/index", { listings });
  })
);

//Show Route

route.get(
  "/:id/show",
  wrapAsync(async (req, res) => {
    let id = req.params.id;
    let listing = await Listing.findById(id).populate("reviews");
    if (!listing) {
      req.flash("error", "List you try to access does not exist!");
      res.redirect("/listings");
    }
    res.render("listings/show", { listing });
  })
);

//NEW ROUTE

//Geting Rquest For new Listing
route.get("/new", (req, res) => {
  res.render("listings/new");
});

//Getting Data For New Lsiting
route.post(
  "/",
  validateListing,
  wrapAsync(async (req, res) => {
    let newList = new Listing(req.body.listing);

    await newList.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
  })
);

//EDIT ROUTE

//Editing our List

route.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    let id = req.params.id;
    let result = await Listing.findById(id);
    if (!result) {
      req.flash("error", "List you try to update does not exist!");
      res.redirect("/listings");
    }
    res.render("listings/edit", { result });
  })
);

//Adding updated data to the DB
route.put(
  "/:id",
  validateListing,
  wrapAsync(async (req, res, next) => {
    let id = req.params.id;
    let updatedListing = req.body.listing;
    await Listing.updateOne({ _id: id }, updatedListing);

    req.flash("success", "Listing Update");
    res.redirect(`/listings/${id}/show`);
  })
);

//Deleting list

route.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    let id = req.params.id;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
  })
);

module.exports = route;
