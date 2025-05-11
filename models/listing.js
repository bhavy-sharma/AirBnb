const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title : {
        type: String,
        require : true
    },
    description : String,
    image : {
        type: String,
        set : (v) => v === "" ? "https://plus.unsplash.com/premium_photo-1719997500757-c536c7cf8f48?q=80&w=1472&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v,
    },
    price : Number,
    location : String,
    country : String,
});

const Listing = mongoose.model("Listing", listingSchema);
module.export = Listing;
