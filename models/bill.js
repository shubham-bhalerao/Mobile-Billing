var mongoose = require("mongoose");

var billSchema = new mongoose.Schema({
   author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   },
   productName: String,
   price: String,
   type: String
});

module.exports = mongoose.model("Bill", billSchema);