const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let link="https://images.unsplash.com/photo-1746513791663-e1fcea6208ac?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw4N3x8fGVufDB8fHx8fA%3D%3D";

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: link,
        set: (v)=>v===""?link:v,
    },
    country: {
        type: String,
        required: true
    }
});

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;