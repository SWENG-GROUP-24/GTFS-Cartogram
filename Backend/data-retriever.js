const express = require('express');
const fs = require('fs');

var app = express();

// This responds with "Hello World" on the homepage
app.get('/', function (req, res) {
   console.log("Got a GET request for the homepage");
   res.send("Hello GET");
})

app.get('/data', function(req, res) {
  console.log("data call");
  getData().then(x => {
    console.log(x);
    res.send(x);
  });
});

async function getData () {
  var password = "<redacted>";

  // try {
  //   password = fs.readFileSync('mongo_password.txt', 'UTF-8');
  // } catch(err){
  //   console.log(err);
  // }

  const MongoClient = require('mongodb').MongoClient;
  const uri = "mongodb+srv://mendesr:"+password+"@sweng-ncj49.mongodb.net/test?retryWrites=true&w=majority";

  const client = await MongoClient.connect(uri, { useUnifiedTopology: true })
          .catch(err => { console.log('Error occurred while connecting to MongoDB Atlas...\n',err); } );


  if (client) {
    console.log("connected\n")
  }


  try {
    const db = client.db("CartoMaps");

    let collection = db.collection("Stations");

    let res = await collection.find({"_id":"843GA00020"}).toArray();

    return res[0];

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