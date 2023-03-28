const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const { isLogin, validateCampground, isAuthor } = require("../middleware");
const campgroundController = require("../controller/campgrounds");
const multer = require("multer");
const { storage } = require("../cloudinary/index");
const upload = multer({ storage });

// render index
router.get("/", campgroundController.index);

// render page New
router.get("/new", isLogin, campgroundController.newPage);

// Menambah Data campgrounds
router.post(
  "/",
  isLogin,
  upload.array("image"),
  validateCampground,
  catchAsync(campgroundController.addDataCampground)
);

// Render Page show
router.get("/:id", catchAsync(campgroundController.show));

// Render page Edit
router.get(
  "/:id/edit",
  isLogin,
  isAuthor,
  catchAsync(campgroundController.edit)
);

// Edit data Campgrounds
router.put(
  "/:id",
  isLogin,
  isAuthor,
  upload.array("image"),
  validateCampground,
  catchAsync(campgroundController.editDataCampground)
);

// Menghapus Data Campgrounds
router.delete(
  "/:id",
  isLogin,
  isAuthor,
  catchAsync(campgroundController.delete)
);

module.exports = router;
