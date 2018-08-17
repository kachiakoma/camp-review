const express = require("express"),
      router  = express.Router({mergeParams: true});

const Campground = require("../models/campground"),
      Comment    = require("../models/comment"),
      middleware = require("../middleware");

// Comments New
router.get("/new", middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        if(err || !foundCampground){
            req.flash("error", "Campground Not Found!");
            res.redirect("back");
        }
        else{
            res.render("comments/new", {campground: foundCampground});
        }
    });
});
// Comments Create
router.post("/", middleware.isLoggedIn, function(req, res) {
    // Look up campground using ID
    Campground.findById(req.params.id, function(err, foundCampground) {
        if(err || !foundCampground){
            req.flash("error", "Campground Not Found!");
            res.redirect("back");
        }
        else{
            // Create new comment
            Comment.create(req.body.comment, function(err, foundComment) {
                if(err || !foundComment){
                    req.flash("error", "Comment Not Found!");
                    res.redirect("back");
                }
                else{
                    // add username and id to comment
                    foundComment.author.username = req.user.username;
                    foundComment.author.id = req.user._id;
                    // save comment
                    foundComment.save();
                    foundCampground.comments.push(foundComment);
                    foundCampground.save();
                    req.flash("success", "Comment Created!");
                    // redirect to campground show page
                    res.redirect("/campgrounds/"+req.params.id);
                }
            });
        }
    });
});
// Comments Edit
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        if(err || !foundCampground){
            req.flash("error", "Campground Not Found!");
            res.redirect("back");
        }
        else{
            Comment.findById(req.params.comment_id, function(err, foundComment) {
                if(err){
                    res.redirect("back");
                }
                else{
                    res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
                }
            });
        }
    });
    
});
// Comments Update
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
        if(err){
            res.redirect("back");
        }
        else{
            res.redirect("/campgrounds/" + req.params.id)
        }
    });
});
// Comments Destroy
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(err) {
        if(err){
            res.redirect("back");
        }
        else{
            req.flash("success", "Comment Removed!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = router;