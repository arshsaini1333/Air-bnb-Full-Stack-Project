const mongoose = require("mongoose");
const data = require("./data.js");
const Listing = require("../models/listing.js");

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
