const express = require("express");
const route = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingRoutes = require("../controllers/listing.js");

const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

//Routes

route
  .route("/")
  .get(wrapAsync(listingRoutes.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingRoutes.saveNewListing)
  );

route
  .route("/:id")
  .put(
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    isLoggedIn,
    wrapAsync(listingRoutes.saveUpdatedList)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingRoutes.deleteListing));

route.get("/:id/show", wrapAsync(listingRoutes.show));
route.get("/search", async (req, res) => {
  let location = req.query.location;
  let listings = await Listing.find({ location: location });

  if (listings.length === 0) {
    req.flash("error", "Oops! Listing fot this location does not Exist");
    res.redirect("/listings");
  }

  res.render("listings/index", { listings });
});

route.get("/new", isLoggedIn, listingRoutes.newForm);

route.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingRoutes.editForm));

module.exports = route;
