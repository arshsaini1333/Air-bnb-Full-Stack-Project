//Requiring all The packages we need

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressErrors.js");

const listing = require("./routes/listing.js");
const review = require("./routes/review.js");

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

//Using Our Routes
app.use("/listings/:id/reviews", review);
app.use("/listings", listing);

//If Path do not match with anyone
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

//Middleweres

app.use((err, req, res, next) => {
    let { status = 500, message = "Something went wrong" } = err;
    res.status(status).render("error.ejs", { err });
    // res.status(status).send(message);
});