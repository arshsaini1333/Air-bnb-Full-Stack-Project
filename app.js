//Requiring all The packages we need

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const Listing = require("./models/listing.js");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressErrors.js");

//Defining port and Listning request
const port = 8080;
app.listen(port, () => {
  console.log("Listning Request");
});

//Setting Engines
app.use(express.static(path.join(__dirname + "/public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

//Parsing data
app.use(express.urlencoded({ extended: true }));

//Connection Mongoose
const mongoURL = "mongodb://127.0.0.1:27017/wanderLust";

main()
  .then((res) => {
    console.log("Connect Successfully");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(mongoURL);
}

//Root API
app.get("/", (req, res) => {
  res.send("Hello There");
});

//-------------Creating Routes------------------------

//Index Route

app.get("/listings", async (req, res) => {
  let listings = await Listing.find({});
  res.render("listings/index", { listings });
});

//Show Route

app.get("/listings/:id/show", async (req, res) => {
  let id = req.params.id;
  let listing = await Listing.findById(id);
  res.render("listings/show", { listing });
});

//Geting Rquest For new Listing
app.get("/listings/new", (req, res) => {
  res.render("listings/new");
});

//Getting Data For New Lsiting
app.post("/listings", async (req, res, next) => {
  try {
    //As we create objects name in our new ejs so we can directly pass the new object
    //We pass the object
    let newList = new Listing(req.body.listing);
    //Saving our listing
    await newList.save();
    res.redirect("/listings");
  } catch (error) {
    next(error);
  }
});

//Editing our List

app.get("/listings/:id/edit", async (req, res) => {
  let id = req.params.id;
  let result = await Listing.findById(id);
  res.render("listings/edit", { result });
});

//Adding updated data to the DB
app.put(
  "/listings/:id",
  wrapAsync(async (req, res, next) => {
    let id = req.params.id;
    let updatedListing = req.body.listing;
    await Listing.updateOne({ _id: id }, updatedListing);
    res.redirect(`/listings/${id}/show`);
  })
);

//Deleting list

app.delete("/listings/:id", async (req, res) => {
  let id = req.params.id;
  await Listing.deleteOne({ _id: id });
  res.redirect("/listings");
});

//Middleweres

app.use((err, req, res, next) => {
  res.send("Something went wrong");
});
