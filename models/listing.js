const mongoose = require("mongoose");
const Review = require("./review.js");

const listingSchema = new mongoose.Schema({
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
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=1000",
    set: (v) =>
      v === ""
        ? "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=1000"
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
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Listing = mongoose.model("Listing", listingSchema);

listingSchema.post("findOneAndDelete", async (listing) => {
  // Agar koi listing sahi mein delete hui hai aur usme reviews the
  if (listing && listing.reviews.length > 0) {
    // Un saare reviews ko delete karo jinki _id is listing ke reviews array mein thi
    await Review.deleteMany({ _id: { $in: listing.reviews } });
    console.log("Listing ke sath uske saare reviews bhi delete ho gaye!");
  }
});

module.exports = Listing;
