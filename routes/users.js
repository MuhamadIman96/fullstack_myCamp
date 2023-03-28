const express = require("express");
const router = express.Router();
const passport = require("passport");
const catchAsync = require("../utils/catchAsync");
const userController = require("../controller/user");

// render page register
router.get("/register", userController.registerPage);

// manambah user
router.post("/register", catchAsync(userController.addUserRegister));

// render page login
router.get("/login", userController.loginPage);

//login user
router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  userController.loginUser
);

// logout routes
router.get("/logout", userController.logoutUser);

module.exports = router;
