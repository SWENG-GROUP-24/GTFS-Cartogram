const fs = require('fs');

var password = "";

try {
  password = fs.readFileSync('mongo_password.txt', 'UTF-8');
} catch(err){
  console.log(err);
}

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://mendesr:"+password+"@sweng-ncj49.mongodb.net/test?retryWrites=true&w=majority";

async function getData () {
  const client = await MongoClient.connect(uri, { useUnifiedTopology: true })
          .catch(err => { console.log('Error occurred while connecting to MongoDB Atlas...\n',err); } );


  if (client) {
    console.log("connected\n")
  }

  

  try {
    const db = client.db("CartoMaps");

    let collection = db.collection("Stations");

    let res = await collection.find({"_id":"843GA00020"}).toArray();

    console.log(res[0]);

  } catch(err) {
    console.log(err);
  } finally {
    client.close();
  }
}

getData();