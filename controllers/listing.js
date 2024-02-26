const Listing = require("../models/listing.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

//Creating routes

//Index
module.exports.index = async (req, res) => {
  let listings = await Listing.find({});
  res.render("listings/index", { listings });
};

//Show
module.exports.show = async (req, res) => {
  let id = req.params.id;
  let listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");

  if (!listing) {
    req.flash("error", "List you try to access does not exist!");
    res.redirect("/listings");
  }
  res.render("listings/show", { listing });
};

//New Form
module.exports.newForm = (req, res) => {
  res.render("listings/new");
};

//Saving New Listing
module.exports.saveNewListing = async (req, res) => {
  let coordinate = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();
  let url = req.file.path;
  let fileName = req.file.filename;
  let newList = new Listing(req.body.listing);
  newList.owner = req.user._id;
  newList.image = { url, fileName };

  newList.geometry = coordinate.body.features[0].geometry;
  await newList.save();

  req.flash("success", "New Listing Created");
  res.redirect("/listings");
};

//Edit From
module.exports.editForm = async (req, res) => {
  let id = req.params.id;
  let result = await Listing.findById(id);
  if (!result) {
    req.flash("error", "List you try to update does not exist!");
    res.redirect("/listings");
  }
  let originalImageURL = result.image.url;
  originalImageURL = originalImageURL.replace("/upload", "/upload/h_300,w_250");
  res.render("listings/edit", { result, originalImageURL });
};

//Saving Edited Listing
module.exports.saveUpdatedList = async (req, res) => {
  let id = req.params.id;
  let updatedListing = req.body.listing;
  let coordinate = await geocodingClient
    .forwardGeocode({
      query: updatedListing.location,
      limit: 1,
    })
    .send();
  let newList = await Listing.findByIdAndUpdate({ _id: id }, updatedListing);
  if (req.file) {
    let url = req.file.path;
    let fileName = req.file.filename;
    newList.image = { url, fileName };
    await newList.save();
  }
  newList.geometry = coordinate.body.features[0].geometry;
  await newList.save();
  req.flash("success", "Listing Update");
  res.redirect(`/listings/${id}/show`);
};

//Delete Route
module.exports.deleteListing = async (req, res) => {
  let id = req.params.id;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted");
  res.redirect("/listings");
};
