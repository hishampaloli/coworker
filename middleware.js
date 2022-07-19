const {campgroundSchema, reviewSchema} = require('./schemas.js');
const ExpressError = require('./utils/ExpressError')
const Campground = require('./models/campground') 

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        console.log(req.session.returnTo);
        req.flash('error', 'you must sign In');
        return res.redirect('/login');
      }
      next(); 
  }

  module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
      const msg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(msg, 400);
    } else {
      next();
    }
  };
  
  module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
      req.flash("error", "permission denied");
      return res.redirect(`campgrounds/${id}`);
    }
    next();
  };
  
  module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
      const msg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(msg, 400);
    } else {
      next();
    }
  };