// All the Modules That use in this project Goes Here
const express = require('express');
const mongoose = require('mongoose');
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
// const wrapAsync = require("./utils/wrapAsync");
const Review = require("./models/review.js");
const listings = require("./routes/listing.js");

// Express App Initilize
const app = express();


// Ye hai babu bhaiya humare MiddleWares
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "public")));
app.use("/listings", listings);


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



// Review ka Post Route
app.post("/listings/:id/reviews", async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    const review = new Review(req.body.review);
    listing.reviews.push(review);
    await review.save();
    await listing.save();
    res.redirect(`/listings/${id}`);
});


// Ye hai Babu Bhaiya Review ka Delete Route
app.delete("/listings/:id/reviews/:reviewId", async (req, res) => {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
});


app.use((err, req, res, next) => {
    const { status = 500 } = err;
    if (!err.message) err.message = "Oh No, Something Went Wrong";
    res.status(status).render("error.ejs", { err });
});


// App run kr rha hai Local Host 8080 Port pe
app.listen(8080, () => {
    console.log("Server is running on Port 8080");
});