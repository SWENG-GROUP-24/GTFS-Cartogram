var fs = require('fs');
var parse = require('csv-parse');

var inputFile='gtfs_data/shapes.txt';

var shape = [];
var currentShapeID = '';
var lastShapeID = '';

var currentDistance = 0;

var accDistance = 0;

var numberOfDistances = 0;

var averageDistance = 0;

var parser = parse({delimiter: ','}, function (err, data){
  data.forEach(function(line){
    //makes sure that headers are not selected
    if (line[1]==="shape_pt_lat"){
      return true;
    }

    lat = parseFloat(line[1]);
    lon = parseFloat(line[2]);

    currentShapeID = line[0];

    if (currentShapeID!==lastShapeID && shape !== undefined && shape.length != 0) {
      for (var i=0; i<shape.length; i++) {
        for (var j=i+1; j<shape.length; j++) {
          currentDistance=calculateDistance(shape[i].lat, shape[i].lon, shape[j].lat, shape[j].lon);
          if (currentDistance!=0){
            accDistance=accDistance+currentDistance;
            numberOfDistances++;
          }
        }
      }
      shape = [];
    }
    lastShapeID = currentShapeID;
    shape.push({"lat":lat, "lon":lon});
  });
  for (var i=0; i<shape.length; i++) {
    for (var j=i+1; j<shape.length; j++) {
      currentDistance=calculateDistance(shape[i].lat, shape[i].lon, shape[j].lat, shape[j].lon);
      if (currentDistance!=0){
        accDistance=accDistance+currentDistance;
        numberOfDistances++;
      }
    }
  }

  averageDistance=accDistance/numberOfDistances;
  console.log(averageDistance);
});

fs.createReadStream(inputFile).pipe(parser);

function calculateDistance (lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}