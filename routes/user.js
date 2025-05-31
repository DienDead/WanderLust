const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controller/user.js");


router.route("/signup")
    .get(userController.renderSignUpForm)             //SIGN-UP Form
    .post(wrapAsync(userController.signUpUser));      //SIGN-UP User

router.route("/login")
    .get(userController.renderLoginForm)              //LOGIN Form
    .post(saveRedirectUrl,
        passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }),
        wrapAsync(userController.loginUser));         //LOGIN User

router.get("/logout", userController.logoutUser)      //LOGOUT User

module.exports = router;