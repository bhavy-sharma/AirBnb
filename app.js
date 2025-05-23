// All the Modules That use in this project Goes Here
const express = require('express');
const mongoose = require('mongoose');
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
// const wrapAsync = require("./utils/wrapAsync");
const Review = require("./models/review.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStatergy = require("passport-local");
const User = require("./models/user.js");

const listings = require("./routes/listing.js");
const userRouter = require("./routes/user.js")


// Express App Initilize
const app = express();



const sessionOptions = {
    secret : "Bhavy Sharma",
    resave : false,
    saveUninitialized : true,
    cookie : {
        httpOnly : true,
        expires : Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge : 1000 * 60 * 60 * 24 * 7
    }
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStatergy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Ye hai babu bhaiya humare MiddleWares
app.get("/", (req, res) => {
    res.send("Bhavy Sharma")
});

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user
    next();
});


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "public")));

app.use("/listings", listings);
app.use("/", userRouter);
app.use((err, req, res, next) => {
    console.error("Error:", err.message);
    res.status(500).send("Something went wrong!");
});



// DB se Connect krne ka Function
main().then(() => {
    console.log("DB is Connected");
}).catch(err => console.log(err));
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/AirBnb');
}


// app.get("/demouser", async (req, res) => {
//     let fakeUser = new User({
//         email : "modiji@gmail.com",
//         username : "modi ji"
//     });
//     let registerUser = await User.register(fakeUser, "password")
//     res.send(registerUser);
// })














// Main Home Page Route


// Review ka Post Route
app.post("/listings/:id/reviews", async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    const review = new Review(req.body.review);
    listing.reviews.push(review);
    await review.save();
    await listing.save();
     req.flash("success", "Successfully created a new review!");
    res.redirect(`/listings/${id}`);
});


// Ye hai Babu Bhaiya Review ka Delete Route
app.delete("/listings/:id/reviews/:reviewId", async (req, res) => {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully deleted the review!");
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