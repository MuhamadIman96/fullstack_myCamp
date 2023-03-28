const Campground = require("../models/campground");
const mbxGeoCoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeoCoding({ accessToken: mapBoxToken });
const { cloudinary } = require("../cloudinary/index");

module.exports.index = async (req, res) => {
  // Mencari data dengan id di mongoo
  const campgrounds = await Campground.find({});
  res.render("campground/index", { campgrounds });
};

module.exports.newPage = (req, res) => {
  //   const campgrounds = await Campground.findById(req.params.id);
  res.render("campground/new");
};

module.exports.addDataCampground = async (req, res) => {
  const geoData = await geocoder
    .forwardGeocode({
      query: req.body.campground.location,
      limit: 1,
    })
    .send();
  const campgrounds = new Campground(req.body.campground);
  campgrounds.geometry = geoData.body.features[0].geometry;
  campgrounds.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  campgrounds.author = req.user._id;
  await campgrounds.save();
  console.log(campgrounds);
  req.flash("success", "Successfully made a new campground");
  res.redirect(`/campgrounds/${campgrounds._id}`);
};

module.exports.show = async (req, res) => {
  const campgrounds = await Campground.findById(req.params.id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  if (!campgrounds) {
    req.flash("error", "Cannot find campground");
    return res.redirect("/campgrounds");
  }
  res.render("campground/show", { campgrounds });
};

module.exports.edit = async (req, res) => {
  const campgrounds = await Campground.findById(req.params.id);
  if (!campgrounds) {
    req.flash("error", " Cannot find that campground");
    res.redirect(`/campgrounds`);
  }
  res.render("campground/edit", { campgrounds });
};

module.exports.editDataCampground = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  const imgs = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  campground.images.push(...imgs);
  await campground.save();
  if (req.body.deleteImages) {
    for (const filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }

    await campground.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
    console.log(campground);
  }
  req.flash("success", "Successfully edit a campground");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.delete = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndDelete(id, {
    ...req.body.campground,
  });
  req.flash("success", "Successfully Delete a campground");
  res.redirect(`/campgrounds`);
};
