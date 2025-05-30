const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

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
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect('/listings');
}));

// Edit form route
router.get("/:id/update", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    const id = req.params.id;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Requested Listing doesn't exist");
        res.redirect("/listings");
    }
    else {
        return res.render("listings/update.ejs", { listing });
    }
}));

// Update route
router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });
    req.flash("success", "Listing has been updated")
    return res.redirect("/listings");
}));

// Delete Route
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    const id = req.params.id;
    console.log(await Listing.findByIdAndDelete(id));
    req.flash("success", "Listing has been deleted")
    return res.redirect("/listings");
}));

// Id (Show Route)
router.get('/:id', wrapAsync(async (req, res) => {
    const id = req.params.id;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author"
            },
        })
        .populate("owner");
    if (!listing) {
        req.flash("error", "Requested Listing doesn't exist");
        res.redirect("/listings");
    }
    else {
        res.render("listings/show.ejs", { listing });
    }
}));


module.exports = router;