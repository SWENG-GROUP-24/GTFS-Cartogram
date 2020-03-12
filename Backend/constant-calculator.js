var fs = require('fs');
var parse = require('csv-parse');

var inputFile='gtfs_data/shapes.txt';

var lastDistance = 0;
var currentDistance = 0;
var accDistance = 0;
var numberOfDistances = 0;
var averageDistance = 0;
var maxDistance = 0;
var minDistance = Number.MAX_SAFE_INTEGER;
var range = 0;

var parser = parse({delimiter: ','}, function (err, data){
  data.forEach(function(line){
    //makes sure that headers are not selected
    if (line[0]==="shape_id"){
      return true;
    }

    currentDistance = parseFloat(line[4]);

    //makes sure the last line isn't used 
    if (currentDistance !== currentDistance) {
      return true;
    }

    //if currentDistance is set back to 0 that means
    //we are getting distances from a new route 
    //so we reset
    if (currentDistance == 0) {
      lastDistance = currentDistance;
      return true;
    }
    //otherwise to get a distance between two stops 
    //we must take away the last distance from the current one
    //as 
    else {
      accDistance = accDistance + (currentDistance - lastDistance);
      lastDistance = currentDistance;
      numberOfDistances++;
    }

    if (currentDistance > maxDistance) {
      maxDistance=currentDistance;
    }

    if ((currentDistance - lastDistance) < minDistance) {
      minDistance= (currentDistance - lastDistance);
    }
    
  });
  averageDistance = accDistance/numberOfDistances;
  range = maxDistance - minDistance;
  console.log(range);
  console.log(averageDistance);
});

fs.createReadStream(inputFile).pipe(parser);