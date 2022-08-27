const { campgroundSchema, reviewSchema } = require("../schemas");
const ExpressError = require("../utils/ExpressError");

const Campground = require("../models/campground");

const validateLoggin = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "you must be signedIn to Add a Workspace !");
    return res.redirect("/login");
  }

  next();
};

const logg = (req, res, next) => {
  if (req.isAuthenticated()) {
    req.flash("error", "you are already LoggedIn");
    return res.redirect("/campgrounds");
  }
  next();
};

const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details[0].message;
  req.flash("error", msg);
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
}; 

const isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground.author.equals(req.user._id)) {
    req.flash("error", "Only the creater of this Space can access this page !");
    return res.redirect(`/campgrounds/${campground._id}`);
  }
  next();
};

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports = { validateLoggin, logg, validateCampground, isAuthor, validateReview };
