const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const { title } = require("process");
const Campground = require("./modals/campgrounds");
const methodOverride = require("method-override");
mongoose.connect("mongodb://localhost:27017/YelpCAMP", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/campgrounds", async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds: campgrounds });
});

app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

app.get("/campgrounds/:id", async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  res.render("campgrounds/show", { campground });
});

app.post("/campgrounds", async (req, res) => {
  const camp = new Campground(req.body.campground);
  await camp.save();
  res.redirect(`/campgrounds/${camp._id}`);
});

app.get("/campgrounds/:id/edit", async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  res.render("campgrounds/edit", { campground });
});

app.get("/campgrounds/:id/delete", async(req, res) => {
    const campground = await Campground.findByIdAndDelete(req.params.id);
    res.redirect("/campgrounds");
})

app.put("/campgrounds/:id", async (req, res) => {
    const {id} = req.params;
    const camp = await Campground.findByIdAndUpdate(req.params.id, req.body);
  res.redirect(`/campgrounds/${id}`);
});
app.listen(3000, () => {
  console.log("786 ready to go");
});