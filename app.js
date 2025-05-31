const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/reviews.js");
const usersRouter = require("./routes/user.js");

if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const port = 8080;

const sessionOptions = {
    secret: "randomSecretsAreWrittenHere",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
};

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(flash());
app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
})

const MONGO_URL = 'mongodb://localhost:27017/wanderlust';

//Catch Error during DB connection establishment
main().then(res => {
    console.log("Database Connected");
}).catch(err => {
    console.log(err);
});
 
//Connecting to DB
async function main() {
    await mongoose.connect(MONGO_URL);
}

// Home Page (Root)
app.get('/', (req, res) => {
    res.redirect("/listings");
});

//Listings Path
app.use("/listings", listingsRouter);

//Reviews Path
app.use("/listings/:id/reviews", reviewsRouter);

//Users Path
app.use("/",usersRouter);

//Default path
app.all(/.*/, (req, res, next) => {
    next(new ExpressError("Page not Found!", 404));
});

//Middleware to Handle errors
app.use((err, req, res, next) => {
    let { code = 500, message = "Something went wrong!!" } = err;
    res.status(code).render("Error/error.ejs", { message });
    // res.status(code).send(message);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});