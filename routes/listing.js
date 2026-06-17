const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const { isLoggedin } = require("../middleware.js");
const { isOwner } = require("../middleware.js");
const listingControllers = require("../controllers/listings.js");

const router = express.Router();

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400, error);
  }
  next();
};

router
  .route("/")
  //index route
  .get(wrapAsync(listingControllers.index))
  // create listing route
  .post(
    isLoggedin,
    validateListing,
    wrapAsync(listingControllers.createListing),
  );
//newRenderform route
router.get("/new", isLoggedin, wrapAsync(listingControllers.renderNewform));
//showlisting route
router.get("/:id", wrapAsync(listingControllers.showlisting));
//editListingform route
router.get(
  "/:id/edit",
  isLoggedin,
  wrapAsync(listingControllers.editListingform),
);

router.patch(
  "/:id",
  isLoggedin,
  isOwner,
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner.equals(res.locals.user._id)) {
      req.flash("error", "you don't have permission to edit");
      return res.redirect(`/listings/${id}`);
    }
    await Listing.findByIdAndUpdate(
      id,
      { ...req.body },
      { returnDocument: "after", runValidators: true },
    );
    req.flash("success", "Listing is updated!");

    res.redirect(`/listings/${id}`);
  }),
);

router.delete(
  "/:id",
  isLoggedin,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing is deleted!");
    res.redirect("/listings");
  }),
);

module.exports = router;
