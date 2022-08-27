const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const {logg} = require("../middlewares/middleware");

router.get('/register', logg, (req, res) => {
    res.render('users/register')
})

router.post('/register', async(req, res) => {
    try{
        const {email, username, password} = req.body;
        const user = new User({email, username});
        const registeredUser = await User.register(user, password);
        req.logIn(registeredUser, err => {
            if (err) {
                return next(err)
            }
        })
        req.flash("success", "Welcome to Coworker.in");
        res.redirect('/workspace')
    }catch(e){
        req.flash("error", e.message);
        res.redirect('/workspace');
    }
})

router.get("/login",logg, (req, res) => {
    res.render("users/login");
})

router.post("/login",passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), (req, res) => {
    req.flash("success", "Welcome back to Coworker.in");
    res.redirect('/workspace');
})

router.get('/logout', (req, res) => {
    req.logout(() => {});
    req.flash("Success", "Thank you for visiting CoWorker.in");
    res.redirect("/workspace");
})
module.exports = router;