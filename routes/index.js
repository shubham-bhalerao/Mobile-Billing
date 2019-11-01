require('dotenv').config();
var express = require("express");
var nodemailer = require("nodemailer");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");
var Mobile = require("../models/mobile");
var middleware = require("../middleware/index");
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

router.get("/buy/:id", middleware.isLoggedIn, function (req, res) {
   Mobile.findById(req.params.id, function (err, mobile) {
      res.render("newBill", { mobile });
   });
})

router.post("/bills/:id", middleware.isLoggedIn, function (req, res) {
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


router.get("/contact", function (req, res) {
   res.render("contact");
});

router.post("/contact", async function (req, res) {
   var smtpTransport = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
         user: process.env.EMAIL,
         pass: process.env.PASS
      }
   });
   var mailOptions = {
      to: req.body.email,
      from: process.env.EMAIL,
      subject: 'Query Posted on Mobile App',
      html: `<h1>Hi ${req.body.firstName} ${req.body.lastName},</h1>
            <h2>This mail is regarding your query just posted on the mobile app</h2>
            <hr>
            <p>${req.body.feedback}</p>
            <hr>
            <p>We hope to recieve your complaint/query as soon as possible!</p>
            <h2>Thanks for Contacting Us!</h2>`
   };
   smtpTransport.sendMail(mailOptions, function (err) {
      req.flash('success', 'An e-mail has been sent to ' + req.body.email);
      res.redirect("/mobiles");
   });

});

router.get("/compare", function (req, res) {
   res.render("compare");
});

router.post("/compare", async function (req, res) {
   try {
      const mob1 = req.body.mobile1;
      const mob2 = req.body.mobile2;
      const foundMobile1 = await Mobile.findOne({ "name": { $regex: new RegExp(mob1, "i") } });
      const foundMobile2 = await Mobile.findOne({ "name": { $regex: new RegExp(mob2, "i") } });
      if (!foundMobile1 || !foundMobile2) {
         req.flash("error", "Please enter valid mobile names");
         res.redirect("back");
      }
      res.render("comparePhones", { mobileOne: foundMobile1, mobileTwo: foundMobile2 });
   } catch (e) {
      console.log(e.message);
      res.redirect("back");
   }
});

module.exports = router;
