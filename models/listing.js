const mongoose = require("mongoose");
const review = require("./review");

const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        require: true
    },
    description: String,
    image: {
        type: String,
        default: "https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=500&auto=format&fit=crop"
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "review"
        }
    ],
    owner : {
        type : Schema.Types.ObjectId,
        ref : "User"
    }
});


listingSchema.post("findOneAndDelete", async function (doc) {
    if (doc) {
        await review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        });
    }
});


const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
