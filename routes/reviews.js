const express = require("express");
const router = express.Router({mergeParams: true});
const catchAsync = require("../utils/catchAsync");
const { reviewSchema } = require("../schemas");
const Campground = require("../models/campground");
const Review = require("../models/review");

const validateReveiw = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

router.post(
  "/",
  validateReveiw,
  catchAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await campground.save();
    await review.save();
    res.redirect("/campgrounds/" + campground._id);
  })
);

router.delete(
  "/:revId",
  catchAsync(async (req, res, next) => {
    const { id, revId } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
      $pull: { reviews: revId },
    });
    await Review.findByIdAndDelete(revId);
    res.redirect("/campgrounds/" + id);
  })
);

module.exports = router;
