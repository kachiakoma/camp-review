const express  = require("express"),
      passport = require("passport"),
      router   = express.Router();
      
const User       = require("../models/user"),
      middleware = require("../middleware");

// Root Route
router.get("/", function(req, res) {
    res.render("landing");
});
// Register Form Route
router.get("/register", function(req, res) {
    res.render("register");
});
// Register Logic Route
router.post("/register", function(req, res) {
    const newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user) {
        if(err){
            req.flash("error", err.message + "!");
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function() {
            res.redirect("/campgrounds");
        });
    });
});
// Login Form Route
router.get("/login", function(req, res) {
    res.render("login");
});
// Logic Form Logic Route
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res) {
});
// Logout Route
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged You Out!");
    res.redirect("/campgrounds");
});

module.exports = router;