const userModel = require("../models/users");

module.exports.registerPage = async (req, res) => {
  res.render("users/register.ejs");
};

module.exports.loginPage = async (req, res) => {
  res.render("users/login.ejs");
};

module.exports.addUserRegister = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const user = new userModel({ email, username });
    const registerUser = await userModel.register(user, password);
    req.login(registerUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome To MyCamp");
      res.redirect("/campgrounds");
    });
  } catch (error) {
    req.flash("error", "An user with that username is already registered ");
    res.redirect("register");
  }
};

module.exports.loginUser = (req, res) => {
  req.flash("success", "Welcome back");
  const redirectUrl = req.session.returnToUrl || "/campgrounds";
  delete req.session.returnToUrl;
  res.redirect(redirectUrl);
};

module.exports.logoutUser = (req, res) => {
  req.session.destroy((err) => {
    res.redirect("/campgrounds"); //Inside a callback… bulletproof!
  });
};
