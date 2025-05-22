const express = require('express');
const router = express.Router();
const Listing = require('../models/listing');
const wrapAsync = require("./utils/wrapAsync.js");


// Index Route
router.get("/", async (req, res) => {
    const allListings = await Listing.find();
    res.render("listings/index.ejs", { allListings });
});


// New Route
router.get("/new", async (req, res) => {
    res.render("listings/new");
});

// Show Route
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show", { listing });
});

// Create Route
router.post("/", wrapAsync(async (req, res, next) => {

    let newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect(`/listings`);

    console.log(err);
    res.status(500).send("Error creating listing");
}
));

// Edit Route
router.get("/:id/edit", async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
});

// Update Route
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const updatedListing = await Listing.findByIdAndUpdate(id, req.body.listing);
    res.redirect(`/listings/${id}`);
});

// Delete Route
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
});

module.exports = router;