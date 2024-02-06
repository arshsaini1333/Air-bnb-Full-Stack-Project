const mongoose = require("mongoose");
const Review = require("./review.js");
const Scheema = mongoose.Schema;

const listingScheema = new Scheema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
    url: String,
    fileName: String,
  },

  price: {
    type: Number,
  },
  location: {
    type: String,
  },
  country: {
    type: String,
  },
  reviews: [
    {
      type: Scheema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Scheema.Types.ObjectId,
    ref: "User",
  },
});

listingScheema.post("findOneAndDelete", async (lisiting) => {
  if (lisiting) {
    await Review.deleteMany({ _id: { $in: lisiting.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingScheema);
module.exports = Listing;
