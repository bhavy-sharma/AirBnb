const express = require('express');
const router = express.Router();
const Listing = require('../models/listing');
const wrapAsync = require("./utils/wrapAsync.js");
const { isLoggedIn, isOwner } = require("../middleware.js");

// Index Route
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find();
    res.render("listings/index.ejs", { allListings });
}));

// New Route
router.get("/new", isLoggedIn, (req, res) => {
    res.render("listings/new");
});

// Show Route
router.get("/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews").populate("owner");
    if (!listing) {
        req.flash("error", "Listing not Found");
        return res.redirect("/listings");
    }
    res.render("listings/show", { listing });
}));

// Create Route
router.post("/", isLoggedIn, wrapAsync(async (req, res) => {
    if (!req.body.listing.image || req.body.listing.image.trim() === "") {
        delete req.body.listing.image;
    }
    let newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "Successfully created a new listing!");
    res.redirect(`/listings`);
}));

// Edit Route
router.get("/:id/edit", isLoggedIn, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not Found");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
}));

// Update Route
router.put("/:id", isLoggedIn, isOwner ,wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id, req.body.listing);
    req.flash("success", "Successfully updated the listing!");
    res.redirect(`/listings/${id}`);
}));

// Delete Route
router.delete("/:id", isLoggedIn, isOwner,wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted the listing!");
    res.redirect("/listings");
}));

module.exports = router;
