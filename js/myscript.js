markers = [];
mapbox_apikey = 'pk.eyJ1IjoiYm9idG9tODQ4MiIsImEiOiJjazZzMXh1YmEwYmJrM2ZtbHU1dm5pZW92In0.5070Es5hbrpyO-li0XagsA'; 
thunderforest_apikey = '030ae5a7c98549079b98e1a051b27cb7';
var mymap;
var myRenderer;
var markersLayer;
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

function getData() {
	$.ajax({
		url : "https://raw.githubusercontent.com/SWENG-GROUP-24/GTFS-Cartogram/master/js/assets/trains/stops.txt",
		// url : "https://raw.githubusercontent.com/SWENG-GROUP-24/GTFS-Cartogram/master/js/assets/trains/swiss_stops.txt",		
		success : function (data) {
			parseCSV(data);
		}
	});
}

function parseCSV(csv) {
	parsed = Papa.parse(csv);
	createMarkers(parsed);
	// plotPoints(parsed);
}

var customIcon = L.icon({
	
	iconUrl: 'js/assets/images/circle.ico',
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
		markers.push(marker);
		markersLayer.addLayer(marker);
		// marker.addTo(mymap);
	}
}

function removeMarkers(){
	for(let i = 0; i < markers.length; i++){
		markersLayer.removeLayer(markers[i]);
	}
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

