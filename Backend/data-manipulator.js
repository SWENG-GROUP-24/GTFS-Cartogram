const fs = require('fs');
const parse = require('csv-parse');


var password = "";

try {
  password = fs.readFileSync('mongo_password.txt', 'UTF-8');
} catch(err){
  console.log(err);
}

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://mendesr:"+password+"@sweng-ncj49.mongodb.net/test?retryWrites=true&w=majority";


var inputFile = 'gtfs_data/stop_times.txt';
var trip = [];
var currentTripID = '';
var lastTripID = '';
var processedData = {};

//parser which goes over csv file
var stopTimesParser = parse({delimiter: ','}, function (err, data){
  data.forEach(function(line){
    //skips the header
    if (line[1]==="arrival_time"){
      return true;
    }
    currentTripID = line[0];
    //if we have moved on to a new current trip we make sure
    //to take every stop_id from the trip array as a key
    //and map stops that can be reached from the initial 
    //stop to it, as well as departure and arrival times 
    //for the journey. we also reset the trip array
    if(currentTripID!==lastTripID && trip !== undefined && trip.length != 0) {
      for (var i=0; i<trip.length; i++){
        for (var j=i+1; j<trip.length; j++){
          if(!((trip[i][2]) in processedData)){
            processedData[trip[i][2]]=[];
          }
          processedData[trip[i][2]].push({'destination_station_id':trip[j][2],'departure_time':trip[i][1],'arrival_time':trip[j][0]});
        }
      }
      trip = [];
    }
    //we add arrival_time,departure time and stop_id as an array of values
    //to the trip array, each index of this array represents one stop
    //the array represents a sequential series of stops
    trip.push([line[1],line[2],line[3]]);
    lastTripID = currentTripID;
  });
  //make sure to empty array for final trip
  for (var i=0; i<trip.length; i++){
    for (var j=i+1; j<trip.length; j++){
      if(!((trip[i][2]) in processedData)){
        processedData[trip[i][2]]=[];
      }
      processedData[trip[i][2]].push({'destination_station_id':trip[j][2],'departure_time':trip[i][1],'arrival_time':trip[j][0]});
    }
  }

  var dataToSend;
  sort(processedData);
  Object.keys(processedData).forEach(function(key) {
    dataToSend={};
    dataToSend={_id:key};
    dataToSend['data'] = processedData[key];
    sendData(dataToSend);
  });
});

fs.createReadStream(inputFile).pipe(stopTimesParser);

async function sendData (processedData) {
  const client = await MongoClient.connect(uri, {useUnifiedTopology: true})
    .catch(err => { console.log('Error occurred while connecting to MongoDB Atlas...\n',err); });

  if (client) {
    console.log("connected\n")
  }

  try {
    const db = client.db("CartoMaps");

    let collection = db.collection("Sorted-Stations");

    let res = await collection.insert(processedData);

    console.log(res);
  } catch(err) {
    console.log(err);
  } finally {
    client.close();
  }
}

function sort (processedData) {
  var temp;
  var count=0;
  for (key of Object.keys(processedData)) {
    console.log(count);
    for(var i = 1; i<processedData[key].length; i++) {
      tempData = processedData[key][i];
      tempString = processedData[key][i].departure_time;
      for(var j = i-1; j>=0; j--){
        var currentString = processedData[key][j].departure_time;
        var currentSplit = currentString.split(":");
        var tempSplit = tempString.split(":");
        var currentDate = new Date(1,1,1,currentSplit[0],currentSplit[1], currentSplit[2]);
        var tempDate = new Date(1,1,1,tempSplit[0],tempSplit[1], tempSplit[2]);
        if (tempDate.getTime() < currentDate.getTime()){
          processedData[key][j+1]=processedData[key][j];
          processedData[key][j] = tempData;
        }
      }
    }
    count++;
  }
}