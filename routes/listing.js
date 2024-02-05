const express = require("express");
const route = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingRoutes = require("../controllers/listing.js");

//Routes

route
  .route("/")
  .get(wrapAsync(listingRoutes.index))
  .post(isLoggedIn, validateListing, wrapAsync(listingRoutes.saveNewListing));

route
  .route("/:id")
  .put(
    isOwner,
    validateListing,
    isLoggedIn,
    wrapAsync(listingRoutes.saveUpdatedList)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingRoutes.deleteListing));

route.get("/:id/show", wrapAsync(listingRoutes.show));

route.get("/new", isLoggedIn, listingRoutes.newForm);

route.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingRoutes.editForm));

module.exports = route;
