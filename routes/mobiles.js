var express = require("express");
var router = express.Router();
var Mobile = require("../models/mobile");
var middleware = require("../middleware/index");

//SHOW ALL Mobiles
router.get("/", function(req, res) {
   //Fuzzy Search
   if (req.query.search) {
      const regex = new RegExp(escapeRegex(req.query.search), "gi");
      Mobile.find(
         {
            $or: [
               {
                  name: regex
               },
               {
                  "author.username": regex
               }
            ]
         },
         function(err, foundMobiles) {
            if (err) {
               console.log(err);
            } else {
               if (foundMobiles.length < 1) {
                  req.flash("error", "Oops! No Mobiles found!");
                  return res.redirect("/mobiles");
               }
               res.render("mobiles/index", {
                  mobiles: foundMobiles
               });
            }
         }
      );
   } else {
      Mobile.find({}, function(err, allMobiles) {
         if (err) {
            console.log(err);
         } else {
            res.render("mobiles/index", {
               mobiles: allMobiles
            });
         }
      });
   }
});

//NEW -POST request for new mobile
router.post("/", middleware.isLoggedIn, function(req, res) {
   Mobile.create(req.body.mobile, function(err, mobile) {
      if (err) {
         console.log(err);
         res.redirect("back");
      } else {
         mobile.author.id = req.user._id;
         mobile.author.username = req.user.username;
         mobile.save();
         res.redirect("/mobiles");
      }
   });
});

router.get("/new", middleware.isLoggedIn, function(req, res) {
   res.render("mobiles/new");
});

router.get("/:id", function(req, res) {
   Mobile.findById(req.params.id)
      .populate("comments")
      .exec(function(err, foundMobile) {
         if (err) {
            console.log(err);
            res.redirect("back");
         } else {
            res.render("mobiles/show", {
               mobile: foundMobile
            });
         }
      });
});

//EDIT ROUTE
router.get("/:id/edit", middleware.checkUserAuthorization, function(req, res) {
   Mobile.findById(req.params.id, function(err, mobile) {
      if (err || !mobile) {
         console.log(err);
      } else {
         res.render("mobiles/edit", {
            mobile: mobile
         });
      }
   });
});

router.put("/:id", middleware.checkUserAuthorization, function(req, res) {
   Mobile.findByIdAndUpdate(req.params.id, req.body.mobile, function(
      err,
      updatedMobile
   ) {
      if (err) {
         console.log(err);
      } else {
         res.redirect("/mobiles/" + req.params.id);
      }
   });
});

router.delete("/:id", middleware.checkUserAuthorization, function(req, res) {
   Mobile.findByIdAndRemove(req.params.id, function() {
      req.flash("success", "Successfully deleted mobile");
      res.redirect("/mobiles");
   });
});

function escapeRegex(text) {
   return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

var defaultCode = 123;

module.exports = router;
