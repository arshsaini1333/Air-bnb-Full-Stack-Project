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
    type: String,
    default:
      "https://images.unsplash.com/photo-1617980062787-1f24102227a6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    set: (v) =>
      v === ""
        ? "https://images.unsplash.com/photo-1617980062787-1f24102227a6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        : v,
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
