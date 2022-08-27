const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const { campgroundSchema } = require("../schemas.js");
const { validateLoggin, validateCampground, isAuthor } = require("../middlewares/middleware");

const ExpressError = require("../utils/ExpressError");
const Campground = require("../models/campground");




router.get(
  "/",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

router.get("/new", validateLoggin, (req, res) => {
  res.render("campgrounds/new");
});

router.post(
  "/",
  validateLoggin,
  validateCampground,
  catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash("success", "Successfully made a new WorkSpace!");
    res.redirect(`/workspace/${campground._id}`);
  })
);

router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
      .populate("reviews").populate({
        path: 'reviews',
        populate: [
          {
            path: 'author',
            select: 'username',
          },
        ],
      })
      .populate("author")
    console.log(campground);
    if (campground) {
      res.render("campgrounds/show", { campground });
    } else {
      req.flash("error", "Cannot find that WorkSpace!");
      return res.redirect("/workspace");
    }
  })
);

router.get(
  "/:id/edit",
  isAuthor,
  validateLoggin,
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
      req.flash("error", "Cannot find that WorkSpace!");
      return res.redirect("/workspace");
    }
    res.render("campgrounds/edit", { campground });
  })
);

router.put(
  "/:id",
  isAuthor,
  validateCampground,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    console.log(req.body.campground);
    const campground = await Campground.findByIdAndUpdate(id,req.body.campground);

    req.flash("success", "Successfully updated the WorkSpace!");
    res.redirect(`/workspace/${campground._id}`);
  })
);

router.delete(
  "/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted the WorkSpace");
    res.redirect("/workspace");
  })
);

module.exports = router;
