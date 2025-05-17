const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("../AirBnB-WanderLust/models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema}  = require("./schema.js");

const port = 8080;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const MONGO_URL = 'mongodb://localhost:27017/wanderlust';

main().then(res => {
    console.log("Database Connected");
}).catch(err => {
    console.log(err);
});

const validateListing = (req,res,next)=>{
    const {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(errMsg, 400);
    }else{
        next();
    }
};

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.get('/', (req, res) => {
    res.redirect("/listings");
});

// LISTINGS (Index Route)
app.get('/listings', wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/home.ejs", { allListings });
}));

// new form route(New Route)
app.get('/listings/new', wrapAsync(async (req, res) => {
    res.render("listings/new.ejs");
}));

// create route
app.post('/listings', validateListing, wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect('/listings');
}));

// edit form route
app.get("/listings/:id/update", wrapAsync( async (req, res) => {
    const id = req.params.id;
    const listing = await Listing.findById(id);
    res.render("listings/update.ejs", { listing });
}));

// update route
app.put("/listings/:id", validateListing, wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });
    res.redirect("/listings");
}));

app.delete("/listings/:id", wrapAsync(async (req, res) => {
    const id = req.params.id;
    console.log(await Listing.findByIdAndDelete(id));
    res.redirect("/listings");
}));

// Id (Show Route)
app.get('/listings/:id', wrapAsync(async (req, res) => {
    const id = req.params.id;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
}));

// app.get('/testListing',async (req,res)=>{

//     let sampleListing = new Listing({
//         title: "Sample Listing",
//         description: "This is a sample listing",
//         price: 1000,
//         location: "Paris",
//         country: "France"
//     });

//     await sampleListing.save();
//     res.send("Listing saved");
// });

app.all(/.*/,(req,res,next)=>{
    next(new ExpressError("Page not Found!",404));
})

app.use((err, req, res, next) => {
    let {code=500, message="Something went wrong!!"}=err;
    res.status(code).render("error.ejs",{message});
    // res.status(code).send(message);
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});