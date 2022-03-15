const mongoose = require("mongoose");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const express = require("express");
const _ = require("lodash");

const app = express();

app.set("view engine", ejs);

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema = new mongoose.Schema({
    title : {
        type:String,
        required:true
    },
    content : {
        type : String,
        required : false
    }
});

const Article = mongoose.model("article", articleSchema);

app.route("/articles")

.get(function(req, res) {
    Article.find({}, function(err, foundArticles) {
        if (!err) {
            res.send(foundArticles);
        }
        else {
            res.send(err);
        }
    });
})

.post(function(req, res) {
    
    const newArticle = new Article({
        title : _.lowerCase(req.body.title),
        content : req.body.content
    });
    newArticle.save(function(err) {
        if (!err) {
            res.send("Received the data and successfully added to database.")
        }
        else {
            res.send(err);
        }
    });
})

.delete(function(req, res) {
    Article.deleteMany({}, function(err) {
        if (!err) {
            res.send("Deleted all the articles in the database.")
        }
        else {
            res.send(err);
        } 
    });
});

app.route("/articles/:articleTitle")

.get(function(req, res) {
    
    Article.findOne({title : _.lowerCase(req.params.articleTitle)}, function(err, foundArticle) {
        if (foundArticle) {
            res.send(foundArticle);
        }
        else {
            res.send("No article matched.");
        } 
    });
})

.put(function(req, res) {
    Article.updateOne(
        {title : _.lowerCase(req.params.articleTitle)}, 
        {title : _.lowerCase(req.body.title), content : req.body.content},
        {overwrite : false}, 
        function(err) {
            
            if(!err) {
                res.send("Article updated.")
            }
            else {
                res.send(err);
            }
        });
})

.patch(function(req, res) {
    Article.updateOne(
        {title : _.lowerCase(req.params.articleTitle)},
        {$set : req.body},
        function(err){
            if(!err) {
                res.send("Article parameter updated.")
            }
            else {
                res.send(err);
            }
        });
})

.delete(function(req, res) {
    Article.deleteOne(
        {title : _.lowerCase(req.params.articleTitle)},
        function(err){
            if(!err) {
                res.send("Article deleted.")
            }
            else {
                res.send(err);
            }
        });
});


app.listen(process.env.PORT || 3000 , function() {
    console.log("Server is up and running...");
});