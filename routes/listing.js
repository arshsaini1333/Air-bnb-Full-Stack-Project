const express = require("express");
const route = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

const listingRoutes = require("../controllers/listing.js");
//Index Route

route.get("/", wrapAsync(listingRoutes.index));

//Show Route

route.get("/:id/show", wrapAsync(listingRoutes.show));

//--------------NEW--------------

//Geting Rquest For new Listing
route.get("/new", isLoggedIn, listingRoutes.newForm);

//Getting Data For New Lsiting
route.post(
  "/",
  isLoggedIn,
  validateListing,
  wrapAsync(listingRoutes.saveNewListing)
);

//----------EDIT--------------

//Editing our List

route.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingRoutes.editForm));

//Adding updated data to the DB
route.put(
  "/:id",
  isOwner,
  validateListing,
  isLoggedIn,
  wrapAsync(listingRoutes.saveUpdatedList)
);

//Deleting list

route.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(listingRoutes.deleteListing)
);

module.exports = route;
