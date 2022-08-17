const mongoose = require("mongoose");
const Campground = require("../modals/campgrounds");
const cities = require("./cities");

const { descriptors, places } = require("./seedHelpers");

mongoose.connect("mongodb://localhost:27017/YelpCAMP", {
  useNewUrlParser: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)]


const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 100);
    const camp = new Campground({
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`
    });
    await camp.save();
  }
};

seedDB();
