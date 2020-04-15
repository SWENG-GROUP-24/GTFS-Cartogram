/*
** Global variables
*/ 

markers = [];
mapbox_apikey = 'pk.eyJ1IjoiYm9idG9tODQ4MiIsImEiOiJjazZzMXh1YmEwYmJrM2ZtbHU1dm5pZW92In0.5070Es5hbrpyO-li0XagsA';
thunderforest_apikey = '030ae5a7c98549079b98e1a051b27cb7';
stationNames = [];	// list of station names for autocomplete
stationFreq = {};	// dict for handling multiple stations with the same name
terminalStation = false; // if selected station is a terminal station (where no data will be returned)

/*
** Leaflet map variables
*/

var mymap;
var myRenderer;
var markersLayer;
var lastSearch = "";
//var linesLayer;

var parsedCSV;
var centres = {
	ireland: [53.5, -7.9],
	switzerland: [47, 8.3]
};

var zooms = {
	ireland: 7,
	switzerland: 7
}

function start() {
	makeMap();
}


// Create the main map layer
function makeMap() {
	mymap = L.map('mapid').setView(centres.ireland, zooms.ireland);

	var Thunderforest_TransportDark = L.tileLayer(
		'https://{s}.tile.thunderforest.com/transport-dark/{z}/{x}/{y}.png?apikey=' + thunderforest_apikey, {
		attribution: '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		apikey: thunderforest_apikey,
		maxZoom: 22
	}).addTo(mymap);

	myRenderer = L.canvas({ padding: 0.5 });

	// layer for holding the station markers
	markersLayer = new L.LayerGroup();
	mymap.addLayer(markersLayer);

	//adding a new layer group for lines
	//linesLayer = new L.LayerGroup();	
	//mymap.addLayer(linesLayer);

	getData();
}


// Onclick function for search button
// The entire search bar currently acts as a button
function onInput() {
	var val = document.getElementById("stationInput").value;

	var opts = document.getElementById("stationNames").childNodes;
	if (val != "") {
		lastSearch = val;
		// console.log(lastSearch);
	}

	for (var i = 0; i < opts.length; i++) {
		if (opts[i].value === val) {
			submitButton();
			break;
		}
	}
}

function submitButton() {
	// Show the loading animation
	document.getElementById("demo").className = "loader";

	var stationName = document.getElementById("stationInput").value;
	var stationId = stopNameToId(stationName);
	console.log(stationId);
	var time = document.getElementById("timeInput").value;
	// Only search if station name is valid
	if (stationId != "") {

		removeMarkers();
		getSampleData(stationId);

		//zoom out to its original position when user changes the station
		// mymap.setView(centres.ireland, zooms.ireland);
		//removeLines(stationId);
	}
}

//	Takes a stop name and returns its ID for searching the database
function stopNameToId(name) {
	// 	If the stop is one with duplicate names
	// 	we use the number after it to find it's ID 
	// 	eg. Newry Stop 2 would be the 3rd ID associated with Newry
	var splits = name.split("Stop");
	if (splits.length == 2) {
		baseName = splits[0].trim();
		num = parseInt(splits[1]) - 1;
	} else {
		baseName = name;
		num = 0;
	}

	// i = 1 as first line is metadata
	for (let i = 1; i < parsedCSV.data.length; i++) {
		if (parsedCSV.data[i][1] == baseName) {
			if (num == 0) {
				return parsedCSV.data[i][0];
			} else {
				num = num - 1;
			}
		}
	}
	return "nope";
}


// gets stop data hosted on Github
function getData() {
	$.ajax({
		url: "https://raw.githubusercontent.com/SWENG-GROUP-24/GTFS-Cartogram/master/Backend/gtfs_data/stops.txt",
		success: function (data) {
			parseCSV(data);
		}
	});
}

function parseCSV(csv) {
	// Parse the stop data and create autocomplete entries
	parsedCSV = Papa.parse(csv);
	makeStationList();
	insertDataList();
	console.log("parsed data");

}


// Populate the autocomplete data list
function insertDataList() {
	var list = document.getElementById('stationNames');
	stationNames.forEach(function (item) {
		var option = document.createElement('option');
		option.value = item;
		list.appendChild(option);
	});
}

// Make a list of the station names for Autocomplete
function makeStationList() {
	for (let i = 1; i < parsedCSV.data.length; i++) {
		name = parsedCSV.data[i][1];
		// Handle multiple stations with same name
		// by assigning them a number so their ID 
		// can be fetched correctly 
		if (name in stationFreq) {
			freq = stationFreq[name];
			stationFreq[name] = freq + 1;
			stationNames.push(name + " Stop " + (freq + 1));
		} else {
			stationNames.push(name);
			stationFreq[name] = 1;
		}
	}
}

// Remove markers from map
// and fetch the next station ID to ensure 
// markers are removed before more are added 
function removeMarkers() {

	markersLayer.eachLayer(function (layer) {
		markersLayer.removeLayer(layer);
	});
	transformedPoints = [];
	// getSampleData(stationId);
}

//removing the lines when user change the station
// function removeLines(stationId) {	
// 	linesLayer.eachLayer(function (layer1) {
// 		linesLayer.removeLayer(layer1);
// 	});
// 	transformedPoints = [];
// 	getSampleData(stationId);
// }

function plotPoints(csv) {
	for (let i = 1; i < csv.data.length - 1; i++) {
		let lat = csv.data[i][2];
		let long = csv.data[i][3];
		let title = csv.data[i][1];
		let coord = L.latLng(lat, long);
		let marker = new L.circleMarker(coord, {
			renderer: myRenderer,
			radius: 1,
			title: title
		});
		marker.bindPopup(csv.data[i][1]);
		markersLayer.addLayer(marker);
		// }).addTo(mymap).bindPopup(csv.data[i][1]);
	}
}


function plotPoint(lat, long, title){
	
		let coord = L.latLng(lat,long);
		let marker = new L.circleMarker(coord, {
			radius: 3,
			color: '#ff3832',
			title: title
		});
		marker.bindPopup(title);
		marker.on('mouseover', function (e) {
			this.openPopup();
		});
		marker.on('mouseout', function (e) {
			this.closePopup();
		});
		// markers.push(marker);
		markersLayer.addLayer(marker);
	
}


function plotTransformedPoint(lat, long, title){
		title = "New: " + title
		let coord = L.latLng(lat,long);
		let marker = new L.circleMarker(coord, {
			radius: 3,
			color: '#7effb2',
			title: title
		});
		marker.bindPopup(title);
		marker.on('mouseover', function (e) {
			this.openPopup();
		});
		marker.on('mouseout', function (e) {
			this.closePopup();
		});
		// markers.push(marker);
		markersLayer.addLayer(marker);
	
}


function plotOrigin(lat, long, title){
	
	let coord = L.latLng(lat,long);
		let marker = new L.circleMarker(coord, {
			radius: 8,
			color: 'white',
			title: title
		});
		marker.bindPopup(title);
		marker.on('mouseover', function (e) {
			this.openPopup();
		});
		marker.on('mouseout', function (e) {
			this.closePopup();
		});
		// markers.push(marker);
		markersLayer.addLayer(marker);
}

//drawing the line on the map
// function drawLine(lat, long, title) {	
// 	let coord = L.latLng(lat, long);
// 	let line = new L.polyline(coord, {
// 		title: title
// 	});

// 	var polylinePoints = [
// 		[p1, p2],
// 		[originX, originY],
// 	];

// 	line.bindPopup(title);
// 	console.log("This is the title: " + title);
// 	linesLayer.addLayer(line);
// 	console.log("This is the line: " + line);
// 	var polyline = L.polyline(polylinePoints, { color: '#00ccff', weight: 3 }).addTo(mymap);	
// }


//Adds message box to the map to display and information to the user for example: Terminal Station 
//or No departure at certain time etc.
L.Control.Messagebox = L.Control.extend({
    options: {
        position: 'bottomleft',
        timeout: 1500
    },

    onAdd: function (mymap) {
        this._container = L.DomUtil.create('div', 'leaflet-control-messagebox');
        return this._container;
    },

    show: function (message, timeout) {
        var element = this._container;
        element.innerHTML = message;
        element.style.display = 'block';

        timeout = timeout || this.options.timeout;

        if (typeof this.timeoutID == 'number') {
            clearTimeout(this.timeoutID);
        }
        this.timeoutID = setTimeout(function () {
            element.style.display = 'none';
        }, timeout);
    }
});

L.Map.mergeOptions({
    messagebox: false
});

L.Map.addInitHook(function () {
    if (this.options.messagebox) {
        this.messagebox = new L.Control.Messagebox();
        this.addControl(this.messagebox);
    }
});

L.control.messagebox = function (options) {
    return new L.Control.Messagebox(options);
};


function getSampleData(stationId) {
	// the sample input data located at https://intense-basin-71843.herokuapp.com/data
	// was converted from a json to a csv, and is then loaded into 'sampleData' as seen below
	$.ajax({
		// url: "https://intense-basin-71843.herokuapp.com/data?id=" + stationId,
		url: "https://eu-cartomaps.herokuapp.com/data?id=" + stationId,		
		success: function (data) {
			document.getElementById("stationInput").value = "";
			
			// hide loading animation
			document.getElementById("demo").className = "empty";
			// Check the data returned
			// If no data found then the stop is a terminal station
			// and has no data to show 
			if (data == "No Data Found (Check stop ID)") {
				console.log("Terminal Station - No Data");
				terminalStation = true;
				var options = { timeout: 1500 }
				var box = L.control.messagebox(options).addTo(mymap);
				box.show( 'This is the Terminal Station' );
				mymap.setView(centres.ireland, zooms.ireland);
			} else {
				terminalStation = false;
			}
			sample(data, parsedCSV);
		}
	});
}

function sample(sampleData, csv) {
	// draws the origin train station
	originX = 0;
	originY = 0;
	for (let k = 1; k < csv.data.length; k++) {
		if (sampleData._id == csv.data[k][0]) {
			plotOrigin(csv.data[k][2], csv.data[k][3], csv.data[k][1]);
			originX = csv.data[k][2];
			originY = csv.data[k][3];
		}
	}

	// iterates through sampleData AND csv (stops.txt), and creates markers on the map only
	// for the stations that appear in the sample data
	for (let i = 0; i < sampleData.data.length; i++) {
		for (let j = 1; j < csv.data.length; j++) {
			if (sampleData.data[i].destination_station_id == csv.data[j][0]) {
				plotPoint(csv.data[j][2], csv.data[j][3], csv.data[j][1]);
			}
		}
	}
	
	// calculuates the average time between trips for this specific origin station, this is outside of the loop because it only needs to be run once
	time_a=calculateAverageTime(sampleData, csv);
	
	//plots transformed points
	for (let i = 1; i < sampleData.data.length; i++) {
		for (let j = 1; j < csv.data.length; j++) {
			
			
			if (sampleData.data[i].destination_station_id == csv.data[j][0] && !isDuplicate(sampleData.data[i].destination_station_id) && trainHasNotLeft(sampleData.data[i].departure_time)) {

				destinationX = csv.data[j][2];
				destinationY = csv.data[j][3];


				//performs the calculation using the formula (time_i/time_a)*(distance_a/distance_i)=displacement factor
				// the average distance (distance_a) was previously calculated and is a constant
				
				distance_a=52.255713942272905;
				
				distance_i=calculateDistance(originX, originY, destinationX, destinationY);
				
				// calculates time between origin and destination station, and adds time from current time to time of departure
				time_i=time_diff(sampleData.data[i].departure_time, sampleData.data[i].arrival_time);
				
				
				
				displacementFactor=(time_i/time_a)*(distance_a/distance_i);

				// calculates position of new point
				transformedPoint = lineDividing(originX, originY, destinationX, destinationY, 1, displacementFactor);
				plotTransformedPoint(transformedPoint.p1, transformedPoint.p2, csv.data[j][1]);


				// adds station to array so that no duplicates appear
				transformedPoints.push(sampleData.data[i].destination_station_id);

				//drawLine(p1, p2, csv.data[j][1]);

				// get the lat and long of each transformed stations with the station name
				var newTransformed = [];
				var Station = csv.data[j][1];

				newTransformed = {
					Lat: p1,
					Long: p2,
					Station: Station,
				}
				// console.log(newTransformed);
				//L.polyline(newTransformed).addTo(mymap);
			}
		}
	}
	//added automatically zooming in to the origin station
	var latLon = L.latLng(originX, originY);
	var bounds = latLon.toBounds(50000); 
	mymap.panTo(latLon).fitBounds(bounds);
}

transformedPoints = [];

function isDuplicate(station_id) {
	for (let i = 0; i < transformedPoints.length; i++) {
		if (transformedPoints[i] == station_id) {
			return true;
		}
	}
	return false;
}

function trainHasNotLeft(timeOfDeparture){
	
	timeOfDeparture=timeOfDeparture.split(":");
	var current=Date.now();
	var departureTime=new Date();
	var departureTime=departureTime.setHours(Number(timeOfDeparture[0], Number(timeOfDeparture[1])));

	console.log(current);
	console.log(departureTime);
	
	if(Number(current)<Number(departureTime)){
		return true;
	} else return false;
		//var options = { timeout: 5000 }
		//var box = L.control.messagebox(options).addTo(mymap);
		//box.show( 'No trains at this time.' );
	return false;
	
}

function calculateAverageTime(sampleData, csv){
	
	accumulatedTime=0;
	
	for (let i= 1; i < csv.data.length; i++) {
		
		accumulatedTime+=time_diff(sampleData.data[i].departure_time, sampleData.data[i].arrival_time);
		
	}
	
	return (accumulatedTime/csv.data.length);
	
}

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

function time_diff(start, end) {
	start = start.split(":");
	end = end.split(":");
	var startDate = new Date(0, 0, 0, start[0], start[1], 0);
	var endDate = new Date(0, 0, 0, end[0], end[1], 0);
	var diff = endDate.getTime() - startDate.getTime();
	var hours = Math.floor(diff / 1000 / 60 / 60);
	diff -= hours * 1000 * 60 * 60;
	var minutes = Math.floor(diff / 1000 / 60);

	// If using time pickers with 24 hours format, add the below line get exact hours
	if (hours < 0) {
		hours = hours + 24;
	}
	
	timeFromDepartToArrive= (hours*60) + minutes;
	currentTime=new Date();
	var diff = currentTime.getTime() - startDate.getTime();
	var hours = Math.floor(diff / 1000 / 60 / 60);
	diff -= hours * 1000 * 60 * 60;
	var minutes = Math.floor(diff / 1000 / 60);

	// If using time pickers with 24 hours format, add the below line get exact hours
	if (hours < 0) {
		hours = hours + 24;
	}
	
	
	return (timeFromDepartToArrive+(hours * 60 + minutes));
}

/*
	Given two points and a ratio a:b finds the point
	which splits the line in ratio a:b
	Make b constant for one less variable?
	Start station will always be the same 
*/
function lineDividing(x1, y1, x2, y2, a, b) {
	p1 = (b * x1 + a * x2) / (a + b);
	p2 = (b * y1 + a * y2) / (a + b);
	return { p1, p2 };
}

start();