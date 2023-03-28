if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const userModel = require("./models/users");
const mongoSanitize = require("express-mongo-sanitize");

// Routes
const campgroundRoute = require("./routes/campgrounds");
const reviewRoute = require("./routes/reviews");
const userRoute = require("./routes/users");

// Koneksi MongoDB
mongoose.connect("mongodb://localhost:27017/campground-app");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("Database Connected");
});

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
// untuk membaca data body html
app.use(express.urlencoded({ extended: true }));
// menambahkan method ke ejs file
app.use(methodOverride("_method"));
// Untuk membaca file dari folder public
app.use(express.static(path.join(__dirname, "public")));
app.use(
  mongoSanitize({
    replaceWith: "_",
  })
);

// konfigurasi session
const sessionConfig = {
  secret: "rahasiaYa",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure : true,
    expires: Date.now() * 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionConfig));
app.use(flash());

// session harus diatas passport session dan initialized
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(userModel.authenticate()));
passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());

// menggunakan flash
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// route campground
app.use("/campgrounds", campgroundRoute);
// route review
app.use("/campgrounds/:id/reviews", reviewRoute);
// route user
app.use("/", userRoute);

app.get("/", (req, res) => {
  res.render("home");
});

// error handling
app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

// catching error
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh NO, Something Went Wrong";
  res.status(statusCode).render("error", { err });
});

// Koneksi localhost
app.listen(3000, () => {
  console.log("Listening On Port 3000");
});
