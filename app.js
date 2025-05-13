// All the Modules That use in this project Goes Here
const express = require('express');
const mongoose = require('mongoose');
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");


// Express App Initilize
const app = express();


// Ye hai babu bhaiya humare MiddleWares
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


// DB se Connect krne ka Function
main().then(() => {
    console.log("DB is Connected");
}).catch(err => console.log(err));
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/AirBnb');
}


// Main Home Page Route
app.get("/", (req, res) => {
    res.send("Bhavy Sharma")
});


// DB Testing Route
// app.get("/testListing", async (req,res) => {
//     let sampleListing = new Listing({
//         title : "My Home",
//         description : "My Home is Very Sweet Home and i Loved it...",
//         price : 12000,
//         location : "Hansi, Haryana",
//         country : "India"

//     });
//     await sampleListing.save();
//     console.log("Sample was Saved");
//     res.send("Successful");
// });


// Ye hai Babu bhaiya Index Route
app.get("/listings", async (req, res) => {
    const allListings = await Listing.find();
    res.render("listings/index.ejs", { allListings });
});


// Ye hai Babu Bhaiya New Route
app.get("/listings/new", async (req, res) => {
    res.render("listings/new");
});



// Ye hai babu bhaiya Show Route
app.get("/listings/:id", async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render('listings/show.ejs', {listing});
});


// Create Route hai ji ye
app.post("/listings", async (req, res) => {
    // let { title, description, price, location, country } = req.body;
    let newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect(`/listings`);
});


// Ye hai Babu Bhaiya Edit Route
app.get("/listings/:id/edit", async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
});


// Ye hai Babu Bhaiya Update Route
app.put("/listings/:id", async (req, res) => {
    const { id } = req.params;
    const updatedListing = await Listing.findByIdAndUpdate(id, req.body.listing);
    res.redirect(`/listings/${id}`);
});



// App run kr rha hai Local Host 8080 Port pe
app.listen(8080, () => {
    console.log("Server is running on Port 8080");
});