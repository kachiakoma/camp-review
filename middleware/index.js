// All The Middleware Goes Here
const Campground            = require("../models/campground"),
      Comment               = require("../models/comment");
      
const middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function (req, res, next) {
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground) {
            if(err || !foundCampground){
                req.flash("error", "Campground Not Found!");
                res.redirect("back");
            }
            else{
                // Does user own campground
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                }
                else{
                    req.flash("error", "Permission Required!");
                    res.redirect("back");
                }
            }
        });
    }
    else{
        req.flash("error", "Login Required!");
        res.redirect("/login");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if(err || !foundComment){
                req.flash("error", "Comment Not Found!");
                res.redirect("back");
            }
            else{
                // Does user own comment
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                }
                else{
                    req.flash("error", "Permission Required!");
                    res.redirect("back");
                }
            }
        });
    }
    else{
        req.flash("error", "Login Required!");
        res.redirect("/login");
    }
}

middlewareObj.isLoggedIn = function(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Login Required!");
    res.redirect("/login");
}

module.exports = middlewareObj;