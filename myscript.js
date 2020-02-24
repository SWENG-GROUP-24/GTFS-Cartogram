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
	//for (let i = 1; i < csv.data.length-1; i++) {
		lat = csv.data[1][2];
		long = csv.data[1][3];
		console.log(lat + " " + long);
		let coord = L.latLng(lat,long)
		let marker = new L.marker(coord, {icon: customIcon});
		markers.push(marker);
		marker.addTo(mymap);
		
		lat = csv.data[22][2];
		long = csv.data[22][3];
		console.log(lat + " " + long);
		coord = L.latLng(lat,long)
		marker = new L.marker(coord, {icon: customIcon});
		markers.push(marker);
		marker.addTo(mymap);
		
		userLocation = (csv.data[1][2], csv.data[1][3]);
		otherLocation = (csv.data[22][2], csv.data[22][3]);
		
		newPoint = transformPoint(userLocation, otherLocation, 20);
		
		coord = L.latLng(newPoint[0],newPoint[1])
		marker = new L.marker(coord, {icon: customIcon});
		markers.push(marker);
		marker.addTo(mymap);
	//}
}



//userLocation is a point, otherLocation is a point, timeBetween is the time in minutes between both locations
function transformPoint(userLocation, otherLocation, timeBetween){
	
	averageTime = 20;
	transformConstant = averageTime*0.1;
	
	transformValue = 2;
	
	transformedPoint = [( (transformValue*otherLocation[0] + 1*userLocation[0]) / (transformValue+1) ), ( (transformValue*otherLocation[1] + 1*userLocation[1]) / (transformValue+1) )];
	
	return transformedPoint;
}

