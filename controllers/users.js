const User = require("../models/user");

module.exports.renderSignupForm = (req, res) => {
  res.render("user/signup");
};

module.exports.signup = async (req, res, next) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);

    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "welcome to wanderlust");
      res.redirect("/listings");
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/signup");
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("user/login");
};

module.exports.login = (req, res) => {
  let redirectUrl = res.locals.redirectUrl || "/listings";
  req.flash("success", "welcome back to wanderlust");
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success", "logged you out!");
    res.redirect("/listings");
  });
};
