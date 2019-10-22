var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
   username: String,
   password: String,
   isAdmin: { type: Boolean, default: false },
   firstName: String,
   lastName: String,
   image: { type: String },
   bills: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Bill"
      }
   ],
});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userSchema);