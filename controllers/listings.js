const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
  console.log("Home route hit");

  let listings = await Listing.find({});
  res.render("listings/home", { listings });
};

module.exports.createListing = async (req, res, next) => {
  let newListing = new Listing({ ...req.body });
  newListing.owner = req.user._id;
  await newListing.save();
  req.flash("success", "New Listing created!");
  res.redirect("/listings");
};

module.exports.renderNewform = async (req, res) => {
  res.render("listings/new");
};
module.exports.showlisting = async (req, res) => {
  let id = req.params.id;
  let listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "listing you requested for does not exist");
    return res.redirect("/listings");
  }
  res.render("listings/show", { listing });
};
module.exports.editListingform = async (req, res) => {
  let id = req.params.id;
  let listing = await Listing.find({ _id: id });
  if (!listing) {
    req.flash("error", "listing you requested for does not exist");
    return res.redirect("/listings");
  }
  res.render("listings/edit", { listing });
};
