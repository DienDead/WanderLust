const express = require("express");
const app = express();
const session = require("express-session");
const flash = require("connect-flash");

const sessionOptions = {
    secret: "PassKeyToSuccess",
    resave: false,
    saveUninitialized: true,
}

app.use(session(sessionOptions));
app.use(flash());

app.get("/register", (req, res) => {
    let { name = "Anonymous" } = req.query;
    console.dir(req.session.name = name);
    if (name != "Anonymous") {
        req.flash('Info', 'Important info: User has been registered');
    }
    else {
        req.flash('Error', 'Important info: User not registered');
    }
    res.redirect("/hey");
});

app.get("/hey", (req, res) => {
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    res.send(`Hey, ${req.session.name} . ${req.flash("Info")} ${req.flash("Error")}`);
    // console.log(req.session);
})

// app.get("/reqCount", (req, res) => {
//     req.session.count = !(req.session.count) ? 1 : req.session.count + 1;

//     res.send(`You sent a request ${req.session.count} times`);
// });

app.get("/", (req, res) => {
    res.redirect("/reqCount");
})

app.listen(3000, () => {
    console.log("Server on port 3000")
})