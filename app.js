const express = require('express');
const mongoose = require('mongoose');
const Listing = require("./models/listing.js");
const path = require("path");



const app = express();


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


main().then(() => {
    console.log("DB is Connected");
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/AirBnb');
}

app.get("/", (req,res) => {
    res.send("Bhavy Sharma")
});

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


app.get("/listings", async (req, res) => {
    const allListings = await Listing.find();
    res.render("listings/index.ejs", {allListings});
});



app.listen(8080, () => {
    console.log("Server is running on Port 8080");
});