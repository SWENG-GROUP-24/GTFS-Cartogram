const express = require('express');
const fs = require('fs');

var app = express();

// enable CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


// function for each URL call
// '/' is the simple homepage
app.get('/', function (req, res) {
   console.log("GET homepage");
   res.send("Cartomaps Homepage");
})

// /data/ is the data call
// ?id=<id> specifies the stop ID
app.get('/data', function(req, res) {
  console.log("data call");
  var id = req.query.id;
  console.log(id);
  getData(id)
  .then(x => {
    res.send(x);
  });
});

// Call to MongoDB
async function getData (id) {

  var password = "";

  const MongoClient = require('mongodb').MongoClient;
  const uri = "mongodb+srv://mendesr:"+password+"@sweng-ncj49.mongodb.net/test?retryWrites=true&w=majority";

  const client = await MongoClient.connect(uri, { useUnifiedTopology: true })
          .catch(err => { console.log('Error occurred while connecting to MongoDB Atlas...\n',err); } );


  if (client) {
    console.log("connected\n")
  }


  try {
    const db = client.db("CartoMaps");

    // let collection = db.collection("Stations");
    let collection = db.collection("Sorted-Stations");

    let res = await collection.find({"_id":id}).toArray();

    // If result length is 0 => no results
    // else return the results
    if (res.length == 0) {
      return "No Data Found (Check stop ID)";
    } else {
      return res[0];
    }

  } catch(err) {
    console.log(err);
  } finally {
    client.close();
  }
}

var server = app.listen(process.env.PORT || 3000, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Listening on port: " + port);
});
// getData();