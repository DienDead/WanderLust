const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const { isLoggedIn } = require("../middleware.js");

//New Listing validator
const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(errMsg, 400);
    } else {
        next();
    }
};

// LISTINGS (Index Route)
router.get('/', wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/home.ejs", { allListings });
}));

// New form route(New Route)
router.get('/new', isLoggedIn, async (req, res) => {
    return res.render("listings/new.ejs");
});

// Create route
router.post('/', isLoggedIn, validateListing, wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect('/listings');
}));

// Edit form route
router.get("/:id/update", isLoggedIn, wrapAsync(async (req, res) => {
    const id = req.params.id;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Requested Listing doesn't exist");
        res.redirect("/listings");
    }
    else {
        res.render("listings/update.ejs", { listing });
    }
}));

// Update route
router.put("/:id", isLoggedIn, validateListing, wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });
    req.flash("success", "Listing has been updated")
    return res.redirect("/listings");

}));

// Delete Route
router.delete("/:id", isLoggedIn, wrapAsync(async (req, res) => {
    const id = req.params.id;
    console.log(await Listing.findByIdAndDelete(id));
    req.flash("success", "Listing has been deleted")
    return res.redirect("/listings");
}));

// Id (Show Route)
router.get('/:id', wrapAsync(async (req, res) => {
    const id = req.params.id;
    const listing = await Listing.findById(id).populate("reviews");
    if (!listing) {
        req.flash("error", "Requested Listing doesn't exist");
        res.redirect("/listings");
    }
    else {
        res.render("listings/show.ejs", { listing });
    }
}));


module.exports = router;