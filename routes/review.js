const express = require("express");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const router = express.Router({ mergeParams: true });
const { isLoggedin } = require("../middleware.js");
const { isreviewAuthor } = require("../middleware.js");

const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body.review);
  if (error) {
    throw new ExpressError(400, error);
  }
  next();
};

router.post(
  "/",
  isLoggedin,
  validateReview,
  wrapAsync(async (req, res, next) => {
    let id = req.params.id;

    let listing = await Listing.findById(id);
    let review = new Review(req.body.review);
    review.author = req.user._id;

    listing.reviews.push(review);
    await listing.save();
    await review.save();
    req.flash("success", "review is posted!");

    res.redirect(`/listings/${id}`);
  }),
);

router.delete(
  "/:reviewId",
  isLoggedin,
  isreviewAuthor,
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;

    // 1. Listing ke array se review ki id ko $pull (remove) karo
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

    // 2. Reviews collection se us asli review ko hamesha ke liye delete karo
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "review is deleted!");

    res.redirect(`/listings/${id}`);
  }),
);

module.exports = router;
