const express = require("express");
const router = express.Router({ mergeParams: true }); //harus ditambahkan mergeparams karna review mengambil dari campground
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");
const Review = require("../models/review");
const { validateReview, isLogin, isReviewAuthor } = require("../middleware");
const reviewController = require("../controller/review");

// menambah review
router.post(
  "/",
  isLogin,
  validateReview,
  catchAsync(reviewController.addReview)
);

// Hapus review comentar
router.delete(
  "/:reviewId",
  isLogin,
  isReviewAuthor,
  catchAsync(reviewController.deleteReview)
);

module.exports = router;
