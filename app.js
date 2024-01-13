//Requiring all The packages we need

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const Listing = require("./models/listing.js");

//Defining port and Listning request
const port = 8080;
app.listen(port, () => {
  console.log("Listning Request");
});

//Setting paths
app.use(express.static(path.join(__dirname + "/public")));
app.set("views engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

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

//Testing Listing
app.get("/testing", async (req, res) => {
  let testList = new Listing({
    title: "My Property",
    desciption: "Lets celebrate you vacations",

    price: 1200,
    location: "Goa",
    country: "India",
  });

  await testList.save();
  console.log("Save Successfully");
  res.send("Success");
});
