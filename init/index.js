const mongoose = require("mongoose");
const initData = require("./data.js");
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

//creaing function to initialize data base
const initDB = async () => {
  //First we delete all the data present in the database
  await Listing.deleteMany({});

  //Initializing our database
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "65b4a5784e12047659fa0b16",
  }));

  await Listing.insertMany(initData.data);
  console.log("Data initialize");
};

initDB();
