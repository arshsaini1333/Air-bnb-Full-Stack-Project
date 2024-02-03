const express = require("express");
const route = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

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
    let listing = await Listing.findById(id)
      .populate("reviews")
      .populate("owner");
    console.log(listing);
    if (!listing) {
      req.flash("error", "List you try to access does not exist!");
      res.redirect("/listings");
    }
    res.render("listings/show", { listing });
  })
);

//NEW ROUTE

//Geting Rquest For new Listing
route.get("/new", isLoggedIn, (req, res) => {
  res.render("listings/new");
});

//Getting Data For New Lsiting
route.post(
  "/",
  isLoggedIn,
  validateListing,
  wrapAsync(async (req, res) => {
    let newList = new Listing(req.body.listing);
    newList.owner = req.user._id;

    await newList.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
  })
);

//EDIT ROUTE

//Editing our List

route.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
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
  isOwner,
  validateListing,
  isLoggedIn,
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
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let id = req.params.id;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
  })
);

module.exports = route;
