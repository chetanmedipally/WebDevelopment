const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const date = require(__dirname+"/date.js")
const _ = require("lodash");


const app = express();

let workItems = [];

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public",));

mongoose.connect("mongodb+srv://admin-chetan:Test-123@cluster0.d78o4.mongodb.net/todolistDB?retryWrites=true&w=majority");

const itemsSchema = new mongoose.Schema({
        name : {
            type : String,
            required : true
        }
});

const Item = mongoose.model("Item", itemsSchema);

const listsSchema = new mongoose.Schema({
    name :{
        type : String,
        required:true
    },
    items : [itemsSchema]
});

const List = mongoose.model("List", listsSchema);

const item1 = new Item({
    name : "Start Work",
});
const item2 = new Item({
    name : "Do Work",
});
const item3 = new Item({
    name : "Complete Work",
});

const defualtItems = [item1,item2,item3];


app.get("/", function(req, res) {
    //let day = date.getDate();
    Item.find({}, function(err, foundItems) {
        console.log("No of items : "+foundItems?.length);
        if(foundItems.length === 0) {
            Item.insertMany(defualtItems, function(err, results) {
                if (err) {
                    console.log(err)
                } else {
                    console.log("Successfully added items");
                }
            
            });
            res.redirect("/");
        }
        else {
            
            res.render("list",{listTitle: "Today", newItemsList:foundItems});
        }
        
    });

});

app.post("/", function(req, res) {
    let itemName = req.body.newItem;
    let listName = req.body.list;
    console.log((req.body));
    const newItem = new Item({
        name: itemName
    });

    if(listName === "Today") {
        newItem.save();
        console.log("New Item saved.");
        res.redirect("/");
    }else {
        List.findOne({name : listName}, function(err, foundList) {
            if(foundList) {
                foundList.items.push(newItem);
                foundList.save();
                res.redirect("/" + listName);
            }
        });
    }


    
    
});

app.post("/delete", function(req, res) {
    const checkedItemId = req.body.checkbox;
    const listName = req.body.list;
    
    if(listName === "Today") {
        Item.findByIdAndRemove(checkedItemId, function (err, results) {
            if (err) {
                console.log(err);
            } else {
                console.log(results);
                res.redirect("/");
            }
        });
        
    }else {
        List.findOneAndUpdate({name : listName},
                              { $pull : {items : {_id : checkedItemId}}},
                               function(err, foundList) {

                                   
                                   if (!err) {
                                       res.redirect("/" + listName);
                                   }
        });

        
    }

    
    
});

app.get("/about", function(req, res) {
    res.render("about");
});

app.get("/:customListName", function(req, res){
    const customListName = _.capitalize(req.params.customListName);

    List.findOne({name : customListName},function(err, foundList) {
        
        if(!err){
            if(!foundList){
                const list = new List({
                    name : customListName,
                    items : defualtItems
                });
                list.save();
                res.redirect("/" + customListName);
            }else {
                if (foundList.items.length === 0) {
                    defualtItems.forEach(element => {
                        foundList.items.push(element);
                    });
                    foundList.save();
                }
                res.render("list",{listTitle: foundList.name, newItemsList:foundList.items});
            }
        }
    });

});

app.listen(process.env.PORT || 3000, function() {
    console.log("Server up and running...");
});

