const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isAuthor, validateReview } = require("../middleware.js");
const reviewsController = require("../controller/reviews.js");

// Add Review Route
router.post("/",isLoggedIn, validateReview, wrapAsync(reviewsController.addNewReview));

//Delete Review Route
router.delete("/:reviewId",isLoggedIn, isAuthor, wrapAsync(reviewsController.destroyReview));

module.exports = router;