

const isLoggenIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash("error", "you must be Signed in");
        return res.redirect("/login");
      }

      next();
  }

  module.exports = isLoggenIn