const express = require('express');
const User = require("../models/user.js");
const passport = require('passport');
const Listing = require('../models/listing.js');
const { saveRedirectUrl } = require("../middleware.js");

const router = express.Router();

router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});

router.post("/signup", async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registerUser = await User.register(newUser, password);
        console.log(registerUser);
        req.login(registerUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "User registered successfully");
            res.redirect("/listings");
        })

    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
});


router.get("/login", (req, res) => {
    res.render("users/login.ejs");
});

router.post("/login", saveRedirectUrl, passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
}), async (req, res) => {
    req.flash("success", "Welcome back!");
    // console.log(res.locals.redirectUrl)
    res.redirect(res.locals.redirectUrl || "/listings");
});


router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "Your Are Logged Out now");
        res.redirect("/listings");
    })
})


module.exports = router;