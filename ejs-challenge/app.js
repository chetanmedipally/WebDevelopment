//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const lodash = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutStartingContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactStartingContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/blogDB");

const postSchema = new mongoose.Schema({
  heading : {
    type : String,
    required: true
  },
  body : {
    type : String,
    required: true
  }
});

const Post = mongoose.model("Post", postSchema);


const aboutPost = new Post({
  heading : "About",
  body : aboutStartingContent
});

const contactPost = new Post({
  heading : "Contact",
  body : contactStartingContent
});


app.get("/", function(req, res) {
  Post.find({}, function(err, results) {
    
    if(results.length === 0) {
      const homePost = new Post({
        heading : lodash.capitalize("Home"),
        body : homeStartingContent
      });
      homePost.save();
      setTimeout(function () {
        res.redirect("/");
      },2000);
        
    }
    else {
      res.render("home",{
        // startingContent : homeStartingContent, 
        allposts : results });
    }

  });
});

app.get("/posts/:postId", function(req, res) {

  Post.findById(req.params.postId, function(err, foundResults) {
    
    if (!err){
      res.render("post",{postHeading:foundResults.heading, postContent: foundResults.body})
    }
  });

  
  // posts.forEach(element => {
  //   if (lodash.lowerCase(element.title) === lodash.lowerCase(req.params.postTitle)){
  //     res.render("post",{postHeading:element.title, postContent: element.post})
  //   }
  // });
});

app.get("/about", function(req, res) {
  res.render("about",{abContent:aboutStartingContent});
});

app.get("/contact", function(req, res) {
  res.render("contact", {ctContent:contactStartingContent});
});

app.get("/compose", function(req, res) {
  res.render("compose");
});

app.post("/compose", function(req,res) {

  const newPost = new Post ({
    heading : lodash.capitalize(req.body.titleInput),
    body : req.body.postInput
  });
  newPost.save(function(err) {
    if(!err) {
      res.redirect("/");
    }
  });


});





app.listen(3000, function() {
  console.log("Server started on port 3000");
});
