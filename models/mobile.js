var mongoose = require("mongoose");

var mobileSchema = new mongoose.Schema({
   name: String,
   image: String,
   description: String,
   ram: String,
   link: String,
   cpu: String,
   camera: String,
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ],
   author: {
      username: String,
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      }
   },
   price: String
});

module.exports = mongoose.model("Mobile", mobileSchema);
