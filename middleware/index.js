//all middleware goes here

var middlewareObj = {};
var Mobile = require("../models/mobile");
var Comment = require("../models/comment");

//middleware
middlewareObj.isLoggedIn = function(req, res, next) {
   if (req.isAuthenticated()) {
      return next();
   } else {
      req.flash("error", "You need to LogIn First!");
      res.redirect("/login");
   }
};

middlewareObj.checkCommentAuthorization = function(req, res, next) {
   if (req.isAuthenticated()) {
      Comment.findById(req.params.comment_id, function(err, comment) {
         if (err) {
            console.log(err);
         } else {
            if (
               comment.author.id.equals(req.user._id) ||
               (req.user && req.user.isAdmin)
            ) {
               next();
            } else {
               req.flash("error", "You dont have permission to do that");
               res.redirect("back");
            }
         }
      });
   } else {
      req.flash("You need to login to do that");
      res.redirect("/login");
   }
};

middlewareObj.checkUserAuthorization = function(req, res, next) {
   if (req.isAuthenticated()) {
      Mobile.findById(req.params.id, function(err, mobile) {
         if (err) {
            console.log(err);
         } else {
            if (
               mobile.author.id.equals(req.user._id) ||
               (req.user && req.user.isAdmin)
            ) {
               //campground.user.id is mongoose object
               next();
            } else {
               req.flash("error", "You dont have permission to do that");
               res.redirect("back");
            }
         }
      });
   } else {
      req.flash("error", "You need to login to do that");
      res.redirect("/login");
   }
};

module.exports = middlewareObj;
