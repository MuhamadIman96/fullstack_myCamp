const { campgroundSchemaJoi, reviewSchemaJoi } = require("./schemaJoi");
const Campground = require("./models/campground");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError");

// middleware mengecek apa sudah login atau belum
module.exports.isLogin = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnToUrl = req.originalUrl;
    req.flash("error", "You must be signed in first");
    return res.redirect("/login");
  }
  next();
};

// middleware validasi data campground
module.exports.validateCampground = (req, res, next) => {
  const { error } = campgroundSchemaJoi.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

// Middleware Review Validasi
module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchemaJoi.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

// middleware cek hak ases user
module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};
