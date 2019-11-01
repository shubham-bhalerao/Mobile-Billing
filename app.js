var express = require("express"),
   app = express(),
   bodyParser = require("body-parser"),
   mongoose = require("mongoose"),
   Mobile = require("./models/mobile"),
   Comment = require("./models/comment"),
   passport = require("passport"),
   LocalStrategy = require("passport-local"),
   flash = require("connect-flash"),
   methodOverride = require("method-override"),
   passportLocalMongoose = require("passport-local-mongoose"),
   User = require("./models/user");
//seedDB = require("./seeds");

//ROUTES
var commentRoutes = require("./routes/comments");
var mobileRoutes = require("./routes/mobiles");
var indexRoutes = require("./routes/index");

mongoose.connect("mongodb://localhost:27017/mobile-system", {
   useNewUrlParser: true,
   useUnifiedTopology: true
});

app.set("view engine", "ejs");
app.use(
   bodyParser.urlencoded({
      extended: true
   })
);
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash()); //use flash for flash messages
//seedDB();

//passport things
app.use(
   require("express-session")({
      secret: "Hello Mobile App",
      resave: false,
      saveUninitialized: false
   })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
   res.locals.currentUser = req.user; //add CurrentUser to every route
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next(); //this is a middleware. so go to callback after its completion
});

app.use("/mobiles", mobileRoutes);
app.use("/mobiles/:id/comments", commentRoutes);
app.use(indexRoutes);

var port = process.env.PORT || 3000;
app.listen(port, function () {
   console.log("Mobile App Server has started");
});
