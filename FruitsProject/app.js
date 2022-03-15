// const MongoClient = require('mongodb').MongoClient;
// const ObjectId = require('mongodb').ObjectId;
// const assert = require('assert');

// //Connection URL
// const url = 'mongodb://localhost:27017';

// //Database name
// const dbName = 'fruitsDB';

// //Create a new MongoClient
// const client  = new MongoClient(url);

// //Use connect method to connect to the server
// client.connect(function(err) {
//     assert.equal(null, err);
//     console.log("Connected successfully to server");

//     const db = client.db(dbName);

//     removeDocumentById(db, function() {
//         client.close
//     });
    
// });

const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/fruitsDB");

const fruitSchema = new mongoose.Schema({
    name: {
        type : String,
        required : [true, 'Why no name !']
    },
    rating : {
        type : Number,
        min : 1,
        max : 10
    },
    review : String
})

const Fruit = mongoose.model("Fruit", fruitSchema);

const personSchema = new mongoose.Schema({
    name : String,
    age : Number,
    favouriteFruit : fruitSchema
});

const Person = mongoose.model("Person",personSchema);

const cherry = new Fruit({
    name : "Cherry",
    rating : 5,
    review : "Small fruit"
});

cherry.save();

Person.updateOne({_id : "61f75c5cbcd028e24ed0885c"} , {favouriteFruit : cherry}, function (err, res) {
    mongoose.connection.close();
    if (err) {
        console.log(err);
    }else {
        console.log(res.modifiedCount);
    }
})

// const person = new Person({
//     name :"Amy",
//     age : 12,
//     favouriteFruit : pineapple
// });

// person.save(function() {
//     mongoose.connection.close();
// });




const fruit = new Fruit({
    name :"Apple",
    rating : 7,
    review : "Pretty solid as a fruit"
})

//fruit.save()

const kiwi = new Fruit({
    name : "Kiwi",
    rating : 10,
    review : "The best fruit"
})

const orange = new Fruit({
    name :"Orange",
    rating :10,
    review : "Good for me"
});

const banana = new Fruit({
    name : "Banana",
    rating : 5,
    review : "Wierd texture"
});

// Fruit.insertMany([kiwi,orange,banana] ,function(err) {
//     if (err) {
//         console.log(err)
//     }else {
//         console.log("Successfully added 3 fruits");
//     }
    
// });


// Fruit.find(function(err, fruits) {
//     mongoose.connection.close();
//     if (err) {
//         console.log(err);
//     }
//     else {
//         fruits.forEach(element => {
//             console.log(element.name);
//         });
//     }
    
// });


// Fruit.deleteOne({name : "Peach"}, function(err ,res) {
//     mongoose.connection.close();
//     if (err) {
//         console.log(err);
//     }else {
//                 console.log(res.deletedCount);
//             }
// });

// Person.deleteMany({name : "John"}, function(err,res) {
//     mongoose.connection.close();
//     if (err) {
//         console.log(err);
//     }
//     else {
//         console.log(res.deletedCount);
//     }
// })


const insertDocuments = function(db, callback) {

    const collection = db.collection('fruits');

    collection.insertMany([
        {
            name : 'Apple',
            score: 8,
            review: "Great fruit"
        },
        {
            name : 'Orange',
            score: 6,
            review: "Kinda sour"
        },
        {
            name : 'Banana',
            score: 9,
            review: "Great stuff!"
        }
    ], function(err, result) {
        assert.equal(err,null);
        //console.log(result);
        assert.equal(3,result.insertedCount);
        assert.equal(3,Object.keys(result.insertedIds).length);
        console.log("Inserted 3 documents into the collection");
        callback(result);
    });
}

const findDocuments = function(db, callback) {

const collection = db.collection('fruits');

collection.find({}).toArray(function (err, fruits) {
    assert.equal(err,null);
    console.log("Found the following records");
    console.log(fruits);
    callback(fruits);
})
}

const removeDocumentById = function(db, callback){

    const collection = db.collection('fruits');
    
    collection.deleteMany({"_id" :{ $in:[ObjectId("61f695d4765716637a35b0fa"),ObjectId("61f695d4765716637a35b0f9"),ObjectId("61f695d4765716637a35b0f8"),]  } },
    function(err, fruits) {
        assert.equal(err, null);
        assert.equal(3,fruits.deletedCount);
        console.log(fruits);
        callback(fruits);
    }
    )
}