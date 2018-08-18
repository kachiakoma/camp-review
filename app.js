const express               = require("express"),
      app                   = express(),
      bodyParser            = require("body-parser"),
      mongoose              = require("mongoose"),
      passport              = require("passport"),
      LocalStrategy         = require("passport-local"),
      passportLocalMongoose = require("passport-local-mongoose"),
      methodOverride        = require("method-override"),
      flash                 = require("connect-flash"),
      Campground            = require("./models/campground"),
      Comment               = require("./models/comment"),
      User                  = require("./models/user"),
      seedDB                = require("./seeds");

// Requiring Routes
const campgroundRoutes  = require("./routes/campgrounds"),
      commentRoutes     = require("./routes/comments"),
      indexRoutes       = require("./routes/index");

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(flash());

mongoose.connect(process.env.DATABASEURL, {useNewUrlParser: true});

// Passport Configuration
app.use(require("express-session")({
    secret: "Valse di Fantastica!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use(indexRoutes);

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Yelp Camp Server Has Started!!!");
});