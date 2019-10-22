var express = require("express");
var router = express.Router({
   mergeParams: true
});
var Mobile = require("../models/mobile");
var Comment = require("../models/comment");
var middleware = require("../middleware/index.js");

router.get("/new", middleware.isLoggedIn, function(req, res) {
   Mobile.findById(req.params.id, function(err, mobile) {
      if (err) {
         console.log(err);
      } else {
         res.render("comments/new", {
            mobile: mobile
         });
      }
   });
});

router.post("/", middleware.isLoggedIn, function(req, res) {
   Mobile.findById(req.params.id, function(err, mobile) {
      if (err) {
         console.log(err);
      } else {
         Comment.create(req.body.comment, function(err, comment) {
            if (err) {
               console.log(err);
            } else {
               comment.author.id = req.user._id;
               comment.author.username = req.user.username;
               comment.save();
               mobile.comments.push(comment);
               mobile.save();
               req.flash("success", "Comment Created");
               res.redirect("/mobiles/" + req.params.id);
            }
         });
      }
   });
});

//edit
router.get("/:comment_id/edit", middleware.checkCommentAuthorization, function(
   req,
   res
) {
   Comment.findById(req.params.comment_id, function(err, comment) {
      if (err) {
         console.log(err);
      } else {
         res.render("comments/edit", {
            comment: comment,
            mobile_id: req.params.id
         });
      }
   });
});

//Update
router.put("/:comment_id", middleware.checkCommentAuthorization, function(
   req,
   res
) {
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(
      err,
      updatedComment
   ) {
      if (err) {
         console.log(err);
      } else {
         res.redirect("/mobiles/" + req.params.id);
      }
   });
});

//Delete
router.delete("/:comment_id", middleware.checkCommentAuthorization, function(
   req,
   res
) {
   Comment.findByIdAndRemove(req.params.comment_id, function(err) {
      if (err) {
         console.log(err);
      } else {
         req.flash("success", "Successfully deleted comment");
         res.redirect("/mobiles/" + req.params.id);
      }
   });
});
module.exports = router;
