const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const Campground = require('./models/campground')

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connetcion error:'));
db.once('open', () => {
    console.log("Database connected");
});

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.send("786");
});

app.get('/camp', async(req, res) => {
    const camp = new Campground({title:'My Backyard', description: 'cheap'});
    await camp.save;
    res.send(camp);
})

app.listen(3000, () => {
  console.log("786 ready to go");
});
