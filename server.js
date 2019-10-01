'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')
var cors = require('cors');
var urlHandler = require('./urlHandler.js');

var app = express();

var port = process.env.PORT || 3000;
app.use(cors());

//Connect Database
// mongoose.connect(process.env.MONGO_URI);
// var db = mongoose.connection;
// db.on("error", console.error.bind(console, "connection error:"))
// db.once("open", function() {
//   console.log("Connected to MongoDB", db.db)
// })

// let connection = {database: null, collection: null}

// mongo.MongoClient.connect(process.env.MONGO_URI, { useNewUrlParser: true }, (error, client) => {
//         if(error) return console.error(error)
//         connection.database = client.db("urls");
//         connection.collection = connection.database.collection("UrlEntries");
//         console.log("Connected to database!");
// });


//Use bodyParser
// app.use(bodyParser.json())
app.use(bodyParser.urlencoded({'extended': false}))





//Routes
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/shorturl/new', urlHandler.createUrl)

app.get('/api/shorturl/:url', urlHandler.getUrlFromShortened)



app.listen(port, function () {
  console.log('Node.js listening ...');
});


// module.exports ={
//   connection
// }