//Reference to xlsx: "https://docs.sheetjs.com"
var xlsx = require("xlsx");

//Reading in the csv files
var stoptimes = xlsx.readFile("stop_times.txt"); 
var worksheet1 = stoptimes.Sheets["Sheet1"];

//Reading in the csv files
var stops = xlsx.readFile("stops.txt");
var worksheet2 = stops.Sheets["Sheet1"];

//Converting csv/xlsx to JSON
var data1 = xlsx.utils.sheet_to_json(worksheet1);
var data2 = xlsx.utils.sheet_to_json(worksheet2);

//Query
var query = "Pearse"; //Users input station
var stop_id = "";
var tripId = "";
var currentStopId = "";

for (query in data2) {
  var stop_id = data2[0];
  var stop_name = data2[1];
  var stop_lat = data2[2];
  var stop_lon = data2[3];

   if (query === stop_name) {
      stop_id = currentStopId;
   }
   //Printing the JSON format in the console
   var dataToJson=JSON.stringify(stop_id);
   console.log(dataToJson);
   
}

for (stop_id in data1) {
  var trip_id = data1[0];
  var arrival_time = data1[1];
  var departure_time = data1[2];
  var stops_id = data1[3];
  var stop_sequence = data1[4];
  var stop_headsign = data1[5];
  var pickup_type = data1[6];
  var drop_off_type = data1[7];
  var shape_dist_traveled = data1[8];

   if (stop_id === currentStopId) {
      trip_id = tripId;
   }
   //Printing the JSON format in the console
   var dataToJson=JSON.stringify(trip_id);
   console.log(dataToJson);
   
}



