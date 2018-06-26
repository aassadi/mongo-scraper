var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var CommintSchema = new Schema({

  title: String,
 
  body: String
});

var Commint = mongoose.model("Commints", CommintSchema);

module.exports = Commint;
