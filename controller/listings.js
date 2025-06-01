require('dotenv').config();
const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geoCodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/home.ejs", { allListings });
};

module.exports.renderNewForm = async (req, res) => {
    return res.render("listings/new.ejs");
};

module.exports.createListing = async (req, res) => {
    let response = await geoCodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    }).send();
    let url = req.file.path;
    let fileName = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, fileName };
    newListing.geometry = response.body.features[0].geometry;
    console.log(await newListing.save());
    req.flash("success", "New Listing Created");
    return res.redirect('/listings');
};

module.exports.renderEditForm = async (req, res) => {
    const id = req.params.id;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Requested Listing doesn't exist");
        return res.redirect("/listings");
    }

    let originalImg = listing.image.url;
    originalImg = originalImg.replace("/upload", "/upload/w_250");
    return res.render("listings/update.ejs", { listing, originalImg });
};

module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });

    if (req.file) {
        let url = req.file.path;
        let fileName = req.file.filename;
        listing.image = { url, fileName };
        await listing.save();
    }
    req.flash("success", "Listing has been updated")
    return res.redirect("/listings");
};

module.exports.deleteListing = async (req, res) => {
    const id = req.params.id;
    console.log(await Listing.findByIdAndDelete(id));
    req.flash("success", "Listing has been deleted")
    return res.redirect("/listings");
};

module.exports.showListing = async (req, res) => {
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
        return res.redirect("/listings");
    }
    return res.render("listings/show.ejs", { listing });
};