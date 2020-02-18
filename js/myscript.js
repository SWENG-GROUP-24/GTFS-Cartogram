markers = [];

var mymap = L.map('mapid').setView([53.5, -7.9],7); // Leaflet Map Object centred on Ireland

mapbox_apikey = 'pk.eyJ1IjoiYm9idG9tODQ4MiIsImEiOiJjazZzMXh1YmEwYmJrM2ZtbHU1dm5pZW92In0.5070Es5hbrpyO-li0XagsA'; 
thunderforest_apikey = '030ae5a7c98549079b98e1a051b27cb7';

// L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYm9idG9tODQ4MiIsImEiOiJjazZzMXh1YmEwYmJrM2ZtbHU1dm5pZW92In0.5070Es5hbrpyO-li0XagsA', {
//     attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
//     maxZoom: 18,
//     id: 'mapbox/streets-v11',
//     tileSize: 512,
//     zoomOffset: -1,
//     accessToken: 'pk.eyJ1IjoiYm9idG9tODQ4MiIsImEiOiJjazZzMXh1YmEwYmJrM2ZtbHU1dm5pZW92In0.5070Es5hbrpyO-li0XagsA'
// }).addTo(mymap);

// Creating base layer of map (more designs on line)
var Thunderforest_TransportDark = L.tileLayer(
	'https://{s}.tile.thunderforest.com/transport-dark/{z}/{x}/{y}.png?apikey='+thunderforest_apikey, {
	attribution: '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	apikey: thunderforest_apikey,
	maxZoom: 22
}).addTo(mymap);


$.ajax({
	url : "https://raw.githubusercontent.com/MySupersuit/leaflet_test/master/js/assets/trains/stops.txt",
	success : function (data) {
		parseCSV(data);
	}
});

function parseCSV(csv) {
	parsed = Papa.parse(csv);
	createMarkers(parsed);
}


function createMarkers(csv) {
	for (let i = 1; i < csv.data.length-1; i++) {
		lat = csv.data[i][2];
		long = csv.data[i][3];
		console.log(lat + " " + long);
		let coord = L.latLng(lat,long)
		let marker = new L.marker(coord);
		markers.push(marker);
		marker.addTo(mymap);
	}
}

