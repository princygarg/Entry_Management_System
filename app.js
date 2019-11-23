const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const visitorRoutes = require("./routes/visitors");
const hostRoutes = require("./routes/hosts");
const flash = require("connect-flash");

require('dotenv').config();

app.use(cookieParser('secretString'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));

app.use(require("express-session")({
    secret: "taj is the one the famous hotel in india",
    resave:false,
    saveUninitialized: false
}));
app.use(flash());

app.use(function(req,res,next){
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.set("view engine", "ejs");
app.use("/visitor", visitorRoutes);
app.use("/host", hostRoutes);

app.get("/", (req, res, next)=>{ 
	res.render("landing");
});

module.exports = app;