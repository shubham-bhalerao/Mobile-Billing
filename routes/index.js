var express = require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");
var Mobile = require("../models/mobile");
var Bill = require("../models/bill");


//LANDING PAGE
router.get("/", function (req, res) {
   res.render("landing");
});

router.get("/register", function (req, res) {
   res.render("register");
});

router.post("/register", function (req, res) {
   var newUser = new User({
      username: req.body.username,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      image: req.body.profilePic
   });
   if (req.body.adminCode == "secretcode123") {
      newUser.isAdmin = true;
   }
   User.register(newUser, req.body.password, function (err, user) {
      if (err) {
         req.flash("error", err.message);
         return res.redirect("/register");
      } else {
         passport.authenticate("local")(req, res, function () {
            if (user.isAdmin) {
               req.flash(
                  "success",
                  "Welcome To Mobile Shop, " +
                  user.username +
                  "! You are an Admin!"
               );
               res.redirect("/mobiles");
            } else {
               req.flash(
                  "success",
                  "Welcome To Mobile Shop, " + user.username + "!"
               );
               res.redirect("/mobiles");
            }
         });
      }
   });
});

router.get("/login", function (req, res) {
   res.render("login");
});

router.get("/logout", function (req, res) {
   req.logout();
   req.flash("success", "Logged You Out ");
   res.redirect("/mobiles");
});

router.post("/login", function (req, res, next) {
   passport.authenticate("local", {
      successRedirect: "/mobiles",
      failureRedirect: "/login",
      failureFlash: true,
      successFlash:
         "Welcome to Mobile Shop, " +
         req.body.username +
         "! Good To See You Back!"
   })(req, res);
});

//===========
//New Routes
//===========

router.get("/users/:id", function (req, res) {
   User.findById(req.params.id, function (err, user) {
      if (err || !user) {
         res.redirect("back");
      } else {
         Mobile.find()
            .where("author.id")
            .equals(user._id)
            .exec(function (er, mobiles) {
               if (err) {
                  res.redirect("back");
               } else {
                  res.render("user", { user: user, mobiles: mobiles });
               }
            });
      }
   });
});

router.get("/bills/:id", function (req, res) {
   User.findById(req.params.id).populate("bills").exec(function (err, user) {
      if (err || !user) {
         console.log(user);
         res.redirect("back");
      } else {
         console.log(user);
         res.render("bills", { user });
      }
   });
});

router.get("/buy/:id", function (req, res) {
   Mobile.findById(req.params.id, function (err, mobile) {
      res.render("newBill", { mobile });
   });
})

router.post("/bills/:id", function (req, res) {
   User.findById(req.user._id).populate("bills").exec(function (err, user) {
      if (!user || err) {
         res.redirect("back");
      } else {
         Bill.create(req.body.bill, function (err, bill) {
            if (err) {
               return res.redirect("back");
            }
            bill.author.id = req.user._id;
            bill.author.username = req.user.username;
            bill.save();
            user.bills.push(bill);
            user.save();
            req.flash("success", `Succesfully bought mobile`);
            res.redirect(`/mobiles/${req.params.id}`);
         });
      }
   });
});

module.exports = router;
