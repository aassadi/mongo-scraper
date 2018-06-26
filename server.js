var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var path =require("path")
//-------------------------------------------------------------------
var db = require("./models");

var PORT = 3000;
var app = express();

app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

// mongoose.connect("mongodb://localhost/News");


//-------------------------------------------------------------------------
app.get("/scrape", function(req, res) {
  
  axios.get("http://www.echojs.com/").then(function(response) {
    
    var $ = cheerio.load(response.data);

   
    $("News h2").each(function(i, element) {
    
      var result = [];

    
      result.title = $(this)
        .children("a")
        .text();
      result.link = $(this)
        .children("a")
        .attr("href");

     
      db.News.create(result)
        .then(function(dbNews) {
         
          console.log(dbNews);
        })
        .catch(function(err) {
         
          return res.json(err);
        });
        console.log(result);
    });

  
    res.sendFile(__dirname,"index.html");
  });
});
//-------------------------------------------------

app.get("/news", function(req, res) {
 
  db.News.find({})
  .then(function(dbNews) {
   
    res.json(dbNews);
  })
  .catch(function(err) {
 
    res.json(err);
  });
});


app.get("/news/:id", function(req, res) {

  db.News.findOne({ _id :req.params.id

  })
  .populate("commint")
  .then(function(dbUser) {
   
    res.json(dbUser);
  })
  .catch(function(err) {
  
    res.json(err);
  })

});


app.post("/news/:id", function(req, res) {

  db.Commints.create(req.body)
 
  .then(function(dbCommints) {
    return db.News.findOneAndUpdate({_id :req.params.id}, { $push:{ commint: dbCommints._id }} , { new: true });
    res.json(dbCommints);
  })
  .then(function(dbNew){
    res.json(dbNew);
  })
  .catch(function(err) {
  
    res.json(err);
  })
 
});
app.post("/news/:id", function(req, res) {

  db.Commints.create(req.body)
 
  .then(function(dbCommints) {
    return db.News.findOneAndRemove({_id :req.params.id}, { commint: dbCommints._id }, { new: true });
    res.json(dbCommints);
  })
  .then(function(dbNew){
    res.json(dbNew);
  })
  .catch(function(err) {
  
    res.json(err);
  })
 
});


app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
