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

var customIcon = L.icon({
	
	iconUrl: 'https://www.stickpng.com/assets/images/58afdad6829958a978a4a693.png',
    iconSize: [8, 8],
	
})

function createMarkers(csv) {
	// for (let i = 1; i < csv.data.length-1; i++) {
		lat = csv.data[1][2];
		long = csv.data[1][3];
		console.log(lat + " " + long);
		let coord = L.latLng(lat,long)
		let marker = new L.marker(coord, {icon: customIcon});
		markers.push(marker);
		marker.addTo(mymap);

		connollyX = 53.3524594780812;
		connollyY  = -6.24708495616048;

		m2 = new L.marker(L.latLng(connollyX,connollyY));
		m2.addTo(mymap);

		newP = lineDividing(lat, long, connollyX, connollyY, 1,-5);

		console.log(newP);

		m1 = new L.marker(L.latLng(newP.p1, newP.p2));

		m1.addTo(mymap);
	// }
}

function lineDividing(x1, y1, x2, y2, a, b) {
	p1 = (b*x1 + a*x2)/(a+b);
	p2 = (b*y1 + a*y2)/(a+b);
	return {p1,p2};
}

