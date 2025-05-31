const User = require("../models/user.js");

module.exports.renderSignUpForm=(req, res) => {
    res.render("users/signUp.ejs");
};

module.exports.signUpUser=async (req, res) => {
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
};

module.exports.renderLoginForm=(req, res) => {
    res.render("users/login.ejs");
};

module.exports.loginUser=async (req, res) => {
    req.flash("success", "Welcome back to WanderLust");
    let redirectUrl = res.locals.redirectUrl || '/listings';
    res.redirect(redirectUrl);
};

module.exports.logoutUser=(req, res) => {
    req.logout((err) => {
        if (err) next(err);
        req.flash("success", "Logged out successfully");
        res.redirect("/listings");
    })
};