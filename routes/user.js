const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

router.get("/signup", (req, res) => {
    res.render("users/signUp.ejs");
})

router.post("/signup", wrapAsync(async (req, res) => {
    try {
        const { user } = req.body;
        const newUser = new User(user);
        const registeredUser = await User.register(newUser, user.password);
        req.login(registeredUser, (err) => {
            if (err) next(err);
            req.flash("success", "User Registered Successfully ------ Welcome to WanderLust!!");
            res.redirect("/listings");
        });
    } catch (error) {
        req.flash("error", error.message);
        res.redirect("/signup");
    }
}));

router.get("/login", (req, res) => {
    res.render("users/login.ejs");
});

router.post("/login",saveRedirectUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), async (req, res) => {
    req.flash("success", "Welcome back to WanderLust");
    // console.log(res.locals.redirectUrl);
    let redirectUrl = res.locals.redirectUrl || '/listings';
    res.redirect(redirectUrl);
});

router.get("/logout", (req, res) => {
    req.logout((err) => {
        if (err) next(err);
        req.flash("success", "Logged out successfully");
        res.redirect("/listings");
    })
})

module.exports = router;