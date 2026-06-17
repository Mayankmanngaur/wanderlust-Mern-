const express = require("express");
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router({ mergeParams: true });
const passport = require("passport");
const { saveRedirecturl } = require("../middleware.js");

router.get("/signup", (req, res) => {
  res.render("user/signup");
});

router.post(
  "/signup",
  wrapAsync(async (req, res, next) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({ email, username });
      const rgisterUSer = await User.register(newUser, password);
      // res.send(rgisterUSer);
      req.login(rgisterUSer, (err) => {
        if (err) {
          return next(err);
        }
        req.flash("success", "welcome to wanderlust");
        res.redirect("/listings");
      });
    } catch (err) {
      req.flash("error", err.message);
      res.redirect("/signup");
    }
  }),
);

router.get("/login", (req, res) => {
  res.render("user/login");
});

router.post(
  "/login",
  saveRedirecturl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {
    let redirectUrl = res.locals.redirectUrl || "/listings";
    req.flash("success", "welcome back to wanderlust");
    res.redirect(redirectUrl);
  },
);

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "logged you out!");
    res.redirect("/listings");
  });
});

module.exports = router;
