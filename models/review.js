const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// buat schema database dimongo
const ReviewsSchema = new Schema({
  body: String,
  rating: Number,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Review", ReviewsSchema);
