const express = require('express');
const router = express.Router({ mergeParams: true });

const Campground = require('../models/campground');
const Review = require('../models/review');
const {validateLoggin, validateReview} = require('../middlewares/middleware');

const { reviewSchema } = require('../schemas.js');


const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');


router.post('/', validateReview, validateLoggin, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/workspace/${campground._id}`);
}))

router.delete('/:reviewId',validateLoggin, catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review')
    res.redirect(`/workspace/${id}`);
}))

module.exports = router;