
var mongoose = require('mongoose');
var mongo = require('mongodb');
var nanoid = require('nanoid')
var dns = require('dns')

//Create urlEntry schema
var Schema = mongoose.Schema;

let UrlEntries = new Schema({
  url: {type: "String", required: true},
  id: {type: "String", required: true} 
})

let urlEntries = mongoose.model('UrlEntries', UrlEntries);


//Connect to DB
let collection

mongo.MongoClient.connect(process.env.MONGO_URI, { useNewUrlParser: true }, (error, client) => {
        if(error) return console.error(error)
        let database = client.db("urls");
        collection = database.collection("UrlEntries");
        console.log("Connected to database!")
});


//regexes
let uriRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm
let urnRegex = /[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm


//CRUD operations
function createUrl(req, res){
  let url = req.body.url
  if(!uriRegex.test(url)){
    return res.json({"error": "invalid URL"})
  }else{
    console.log("Looking up if valid URL:", url)
    dns.lookup(url.replace(/(^\w+:|^)\/\//, ''), (error, address) => {
      if(error) return console.error(error)
      
      let newEntry = new urlEntries({"url": url, id:nanoid(5)})
      console.log("Created new entry", newEntry)
      
      console.log("Trying to insert", url)
      collection.insertOne(newEntry, (err, result) => {
        res.json(newEntry)
      })  
    })
    
  }
}


function getUrlFromShortened( req, res ){
  console.log("Trying to redirect to url with id", req.params)
  collection.findOne({"id":req.params.url}, (error, result) => {
        console.log(error, result)
        if(error) return res.send(error);
        if(!result) {
          res.send("URL not found")
        }else{
          res.redirect(result.url);  
        }
  });
}




module.exports = {
  createUrl, 
  getUrlFromShortened
}