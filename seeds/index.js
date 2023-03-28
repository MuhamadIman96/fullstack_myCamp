const mongoose = require("mongoose");
const cities = require("./cities");
const { descriptors, places } = require("./seedHelpers");
const Campground = require("../models/campground");

mongoose.connect("mongodb://localhost:27017/campground-app");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("Database Connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDb = async () => {
  await Campground.deleteMany({});

  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      author: "6350195ca2b6c9be246e151a",
      location: `${cities[random1000].state} ${cities[random1000].city}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores, cumque ipsa? Doloremque modi molestias laboriosam iure impedit culpa mollitia. Molestiae beatae incidunt aspernatur ipsum eum sed eaque esse maiores deserunt.",
      price: price,
      geometry: {
        type: "Point",
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
      images: [
        {
          url: "https://res.cloudinary.com/dnjizwian/image/upload/v1666409958/MyCamp/gf4lib0vzn87ontihr4n.jpg",
          filename: "MyCamp/gf4lib0vzn87ontihr4n",
        },
      ],
    });
    await camp.save();
  }
};

seedDb().then(() => {
  mongoose.connection.close();
});
