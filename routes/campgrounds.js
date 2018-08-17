const express = require("express"),
      router  = express.Router();

const Campground = require("../models/campground"),
      middleware = require("../middleware");

// Index Route
router.get("/", function(req, res) {
    // Get All Campgrounds From DB
    Campground.find({}, function(err, allCampgrounds) {
        if(err){
            console.log(err);
        }
        else{
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    });
});
// New Route
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});
// Create Route
router.post("/", middleware.isLoggedIn, function(req, res) {
    const name = req.body.name;
    const image = req.body.image;
    const desc = req.body.description;
    const price = req.body.price;
    const author = {
        id: req.user._id,
        username: req.user.username
    };
    const newCamp = {name: name, image: image, description: desc, price: price, author: author};
    
    // Create a new campground in DB
    Campground.create(newCamp, function(err, newCampground) {
        if(err){
            console.log(err);
        }
        else{
            res.redirect("/campgrounds");
        }
    });
});
// Show Route
router.get("/:id", function(req, res) {
    // Find campground with provided id
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
       if(err || !foundCampground){
           req.flash("error", "Campground Not Found!");
           res.redirect("back");
       }
       else{
           res.render("campgrounds/show", {campground: foundCampground});
       }
    });
});

// Edit Campground Route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        if(err){}
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});
// Update Campground Route
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    // Find and update campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, campground) {
        if(err){
            console.log(err);
            res.redirect("/campgrounds")
        }
        else {
            // Redirect to show page
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
    
});

// Destroy Campground Route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err) {
        if(err){
            res.redirect("/campgrounds");
        }
        else{
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;