markers = [];
mapbox_apikey = 'pk.eyJ1IjoiYm9idG9tODQ4MiIsImEiOiJjazZzMXh1YmEwYmJrM2ZtbHU1dm5pZW92In0.5070Es5hbrpyO-li0XagsA'; 
thunderforest_apikey = '030ae5a7c98549079b98e1a051b27cb7';
stationNames = [];
var mymap;
var myRenderer;
var markersLayer;
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

function makeMap() {
	mymap = L.map('mapid').setView(centres.ireland,zooms.ireland);

	var Thunderforest_TransportDark = L.tileLayer(
		'https://{s}.tile.thunderforest.com/transport-dark/{z}/{x}/{y}.png?apikey='+thunderforest_apikey, {
		attribution: '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		apikey: thunderforest_apikey,
		maxZoom: 22
	}).addTo(mymap);

	myRenderer = L.canvas({padding: 0.5});

	markersLayer = new L.LayerGroup();
	mymap.addLayer(markersLayer);

	var controlSearch = new L.Control.Search({
		position: 'topright',
		layer: markersLayer,
		initial: false,
		zoom: 12,
		marker: false
	});

	mymap.addControl( controlSearch );
	

	getData();
	
}

function onInput() {
	var val = document.getElementById("stationInput").value;
	var opts = document.getElementById("stationNames").childNodes;
	for (var i = 0; i <opts.length; i++) {
		if (opts[i].value === val) {
			submitButton();
			break;
		}
	}
}

function submitButton() {
	var stationName = document.getElementById("stationInput").value;
	var stationId = stopNameToId(stationName);
	console.log(stationId);
	var time = document.getElementById("timeInput").value;
	if (stationId != ""){
		removeMarkers(stationId);

	}
}

function stopNameToId(name) {
	for (let i = 1; i < parsedCSV.data.length; i++) {
		if (parsedCSV.data[i][1] == name) {
			return parsedCSV.data[i][0];
		}
	}
	return "nope";
}

function getData() {
	$.ajax({
		url : "https://raw.githubusercontent.com/SWENG-GROUP-24/GTFS-Cartogram/darragh/js/assets/trains/stops.txt",
		success : function (data) {
			parseCSV(data);
		}
	});
}

function parseCSV(csv) {
	parsedCSV = Papa.parse(csv);
	getStationList();
	insertDataList();
	console.log("parsed data");
	// getSampleData(parsed);
	//createMarkers(parsed);
	// plotPoints(parsed);
}

function insertDataList() {
	var list = document.getElementById('stationNames');
	stationNames.forEach(function(item) {
		var option = document.createElement('option');
		option.value = item;
		list.appendChild(option);
	});
}

function getStationList() {
	for (let i = 1; i < parsedCSV.data.length; i++) {
		stationNames.push(parsedCSV.data[i][1]);
	}
}

var customIcon = L.icon({
	
	iconUrl: 'js/assets/images/circle.ico',
    iconSize: [5, 5],
	
});

var originIcon = L.icon({
	
	iconUrl: 'js/assets/images/circle.ico',
    iconSize: [10, 10],
	
});

var transformedIcon = L.icon({
	
	iconUrl: 'js/assets/images/transformed_circle.png',
    iconSize: [5, 5],
	
});

function createMarkers(csv) {
	for (let i = 1; i < csv.data.length-1; i++) {
		let lat = csv.data[i][2];
		let long = csv.data[i][3];
		console.log(lat,long);
		let title = csv.data[i][1];
		let coord = L.latLng(lat,long);
		let marker = new L.marker(coord, {
			icon: customIcon, 
			title: title
		});
		marker.bindPopup(csv.data[i][1]);
		// markers.push(marker);
		markersLayer.addLayer(marker);
		// marker.addTo(mymap);
	}
}

function removeMarkers(stationId){
	// for(let i = 0; i < markers.length; i++){
	// 	markersLayer.removeLayer(markers[i]);
	// 	// markers.splice(i,1);	
	// }
	markersLayer.eachLayer(function (layer) {
		markersLayer.removeLayer(layer);
	});
	transformedPoints = [];
	getSampleData(stationId);
}


function plotPoints(csv) {
	for (let i = 1; i < csv.data.length-1; i++) {
		let lat = csv.data[i][2];
		let long = csv.data[i][3];
		let title = csv.data[i][1];
		let coord = L.latLng(lat,long);
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
		let marker = new L.marker(coord, {
			icon: customIcon, 
			title: title
		});
		marker.bindPopup(title);
		// markers.push(marker);
		markersLayer.addLayer(marker);
	
}

function plotTransformedPoint(lat, long, title){
		title = "New: " + title
		let coord = L.latLng(lat,long);
		let marker = new L.marker(coord, {
			icon: transformedIcon, 
			title: title
		});
		marker.bindPopup(title);
		// markers.push(marker);
		markersLayer.addLayer(marker);
	
}

function plotOrigin(lat, long, title){
	
	let coord = L.latLng(lat,long);
		let marker = new L.marker(coord, {
			icon: originIcon, 
			title: title
		});
		marker.bindPopup(title);
		// markers.push(marker);
		markersLayer.addLayer(marker);
	
}

function getSampleData(stationId){
	
	// the sample input data located at https://intense-basin-71843.herokuapp.com/data
	// was converted from a json to a csv, and is then loaded into 'sampleData' as seen below
		
	$.ajax({
		url : "https://intense-basin-71843.herokuapp.com/data?id="+stationId,
		// url : "https://intense-basin-71843.herokuapp.com/data",		
		success : function (data) {
			document.getElementById("stationInput").value = "";

			sample(data, parsedCSV);
		}
	});
	
}

function sample(sampleData, csv){
	
	// draws the origin train station
	
	originX=0;
	originY=0;
		for(let k=1; k<csv.data.length; k++){
	
			if(sampleData._id==csv.data[k][0]){
				plotOrigin(csv.data[k][2], csv.data[k][3], csv.data[k][1]);
				originX=csv.data[k][2];
				originY=csv.data[k][3];
				
			}
			
		}
	
	// iterates through sampleData AND csv (stops.txt), and creates markers on the map only
	// for the stations that appear in the sample data
	
	for(let i=0; i<sampleData.data.length; i++){
		
		
		for(let j=1; j<csv.data.length; j++){
			
			if(sampleData.data[i].destination_station_id==csv.data[j][0]){
				plotPoint(csv.data[j][2], csv.data[j][3], csv.data[j][1]);
			}
			
		}
		
	}
	
	
	
	
	//plots transformed points

	
	for(let i=1; i<sampleData.data.length; i++){
		
		
		for(let j=1; j<csv.data.length; j++){
			
			if(sampleData.data[i].destination_station_id==csv.data[j][0] && !isDuplicate(sampleData.data[i].destination_station_id)){
				
				destinationX = csv.data[j][2];
				destinationY = csv.data[j][3];
				
				
				// calculates time between origin and destination stations
				timeDifference = time_diff(sampleData.data[i].departure_time, sampleData.data[i].arrival_time);
				
				
				
				
				
				// finds a new point on the same line between the origin and destination, but further past the destination
				
				
				/*
				var dest_x=Number(destinationX);
				var dest_y=Number(destinationY);
				distance=Math.sqrt(((dest_x-originX)*(dest_x-originX)) + ((dest_y-originY)*(dest_y-originY)));
				
				ratio=1;
				
				while(distance < 0.3){
					
					extendedPoint = lineDividing(originX, originY, dest_x, dest_y, ratio, 1);
					dest_x=extendedPoint.p1;
					dest_y=extendedPoint.p2;
					ratio-=0.0001;
					
					distance = Math.sqrt(((dest_x-originX)*(dest_x-originX)) + ((dest_y-originY)*(dest_y-originY)));
					
				}
				*/
				
				// calculates position of new point
				transformedPoint = lineDividing(originX, originY, destinationX, destinationY, 1, timeDifference/75);
				plotTransformedPoint(transformedPoint.p1, transformedPoint.p2, csv.data[j][1]);
				
				// adds station to array so that no duplicates appear
				transformedPoints.push(sampleData.data[i].destination_station_id);
				
				
				
			}
			
		}
		
	}
	

}

transformedPoints = [];

function isDuplicate(station_id){
	
	for(let i=0; i<transformedPoints.length; i++){
		if(transformedPoints[i]==station_id){
			return true;
		}
	}
	
	return false;
	
}



function time_diff(start, end){
	
	start = start.split(":");
    end = end.split(":");
    var startDate = new Date(0, 0, 0, start[0], start[1], 0);
    var endDate = new Date(0, 0, 0, end[0], end[1], 0);
    var diff = endDate.getTime() - startDate.getTime();
    var hours = Math.floor(diff / 1000 / 60 / 60);
    diff -= hours * 1000 * 60 * 60;
    var minutes = Math.floor(diff / 1000 / 60);

    // If using time pickers with 24 hours format, add the below line get exact hours
    if (hours < 0){
       hours = hours + 24;
	}

    return (hours*60 + minutes);
	
}

/*
	Given two points and a ratio a:b finds the point
	which splits the line in ratio a:b

	Make b constant for one less variable?
	Start station will always be the same 
*/
function lineDividing(x1, y1, x2, y2, a, b) {
	p1 = (b*x1 + a*x2)/(a+b);
	p2 = (b*y1 + a*y2)/(a+b);
	return {p1,p2};
}

start();
