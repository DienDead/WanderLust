const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const multer = require("multer");
const listingController = require("../controller/listings.js");
const { storage } = require("../cloudConfig.js");

const upload = multer({ storage });

router.route("/")
    .get(wrapAsync(listingController.index))                                                                                // Index Route
    .post(isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync(listingController.createListing));        // Create Listing Route; paste: upload.single('listing[image]')

router.get('/new', isLoggedIn, wrapAsync(listingController.renderNewForm));                   // New Form Route

router.route("/:id")
    .put(isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing))    // Update Listing Route
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing))                  // Delete Listing Route
    .get(wrapAsync(listingController.showListing));                                           // Show Listing Route

router.get("/:id/update", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));  // Edit Form Route

module.exports = router;