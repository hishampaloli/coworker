const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelper");

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connetcion error:"));
db.once("open", () => {
  console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 100) + 10;
    const camp = new Campground({
      author: '62d4f4a9b999d14ef20b0e52',
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      image: `https://source.unsplash.com/collection/483251`,
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident illum pariatur deserunt, amet eos quibusdam quis quam. Minus hic beatae similique doloribus ducimus quos assumenda quo quis! Recusandae, facilis minima.',
      price: price
    });
    await camp.save();
  }
};

seedDB().then(() => {
    mongoose.connection.close();
});
