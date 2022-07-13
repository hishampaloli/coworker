const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodoverride = require('method-override');
const ejsMate = require('ejs-mate')
const Campground = require("./models/campground");

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connetcion error:"));
db.once("open", () => {
  console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({extended: true}))
app.use(methodoverride('_method'))

app.get("/", (req, res) => {
  res.send("786");
});

app.get("/campgrounds", async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
});


app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new')
})

app.post('/campgrounds', async (req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
})

app.get('/campgrounds/:id', async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/show', {campground})
})

app.get('/campgrounds/:id/edit', async (req, res) => {
  const {id} = req.params;
  const campground = await Campground.findById(id);
  res.render('campgrounds/edit', {campground})
})

app.put('/campgrounds/:id', async (req, res) => {

  const {id} = req.params;
  const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground}, {new: true});
  res.redirect(`/campgrounds/${campground._id}`)
})

app.delete('/campgrounds/:id', async (req, res) => {
  const {id} = req.params;
  await Campground.findByIdAndDelete(id);
  res.redirect('/campgrounds');
})

app.listen(3000, () => {
  console.log("786 ready to go");
});
