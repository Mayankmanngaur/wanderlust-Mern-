const Listing = require("./models/listing.js");
const Review = require("./models/review.js");

module.exports.isLoggedin = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "you must be Logged in");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirecturl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!res.locals.user || !listing.owner.equals(res.locals.user._id)) {
    req.flash("error", "you don't have permission to edit");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.isreviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!res.locals.user || !review.author.equals(res.locals.user._id)) {
    req.flash("error", "you are not the author of this review");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
