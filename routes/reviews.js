const express = require("express");
const router = express.Router({ mergeParams: true });
const Review = require("../models/review");
const Campground = require("../models/campground");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const { reviewSchema } = require("../schemas.js");
const { merge } = require("./campgrounds");
const { validateReview ,isLoggedIn
} = require("../middleware");

router.post(
  "/",
  isLoggedIn,
  validateReview,
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash("success", "created new review");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.delete(
  "/:reviewId",
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(req.params.reviewId);
    req.flash("success", "reviev delted");
    res.redirect(`/campgrounds/${id}`);
  })
);

module.exports = router;
