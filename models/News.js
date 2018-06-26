var mongoose = require("mongoose");

var Schema = mongoose.Schema;
var NewsSchema = new Schema({
  
  title: {
    type: String,
    required: true
  },
 
  link: {
    type: String,
    required: true
  },
 
  commint: {
    type: Schema.Types.ObjectId,
    ref: "Commints"//note.js
  }
});


var News = mongoose.model("News", NewsSchema);

module.exports = News;
