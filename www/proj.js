var h3, geojson2h3, fetchedData;
var h3Granularity = 10;
mapboxgl.accessToken = 'pk.eyJ1IjoiYW1vbG53IiwiYSI6ImNqdGY4ZjlqNjFxZDkzeW9iczE4MWg4MGEifQ.YpUeahTCDxjUq84pSDGeNw';

var pickupEndpoint = 'https://8f44ly4zrc.execute-api.us-east-1.amazonaws.com/taxi/pickupcounts'
var collisionEndpoint = 'https://8f44ly4zrc.execute-api.us-east-1.amazonaws.com/taxi/collisioncounts'
var combinedEndpoint = 'https://8f44ly4zrc.execute-api.us-east-1.amazonaws.com/taxi/pickupcollisioncounts'
var proxyUrl = 'https://cors-anywhere.herokuapp.com/'

const sourceId = 'h3-hexes';
const pickupLayerId = `${sourceId}-pickup-layer`;
const collisionLayerId = `${sourceId}-collision-layer`;
const combinedLayerId = `${sourceId}-combined-layer`;

var config = ({
  lng: -74.0111266,
  lat: 40.7051088,
  zoom: 14,
  fillOpacity: 0.6,
  colorScale: ['#0010E5','#3300E1','#7500DD','#B400D9','#D500BA','#D20078','#CE0038','#CA0500','#C64100','#C27A00','#BFB000'], 
  areaThreshold: 0.75
});

var map = new mapboxgl.Map({
  container: 'map',
  center: [
	config.lng,
	config.lat,
  ],
  zoom: config.zoom,
  style: 'mapbox://styles/mapbox/light-v9'
});

require(['h3-js'], function (h3loaded) {
	h3 = h3loaded
	loadPickupHeatmap(config.lat, config.lng);
	//loadCollisionHeatmap(config.lat, config.lng);
	//loadBothHeatmap(config.lat, config.lng);
});

require(['geojson2h3'], function (geojson2h3loaded) {
	geojson2h3 = geojson2h3loaded
});



function pickupLayer(pickupData) {
  const h3PickupLayer = {};
  pickupData.forEach(({h3, pickup_count}) => {
    h3PickupLayer[h3] = (h3PickupLayer[h3] || 0) + pickup_count;
  });
  fetchedData = normalizeLayer(h3PickupLayer);
  return fetchedData;
}

function collisionLayer(collisionData) {
  const h3collisionLayer = {};
  collisionData.forEach(({h3, collision_count}) => {
    h3collisionLayer[h3] = (h3collisionLayer[h3] || 0) + collision_count;
  });
  fetchedData = normalizeLayer(h3collisionLayer);
  return fetchedData;
}

function combinedLayer(combinedData) {
  const h3combinedLayer = {};
  combinedData.forEach(({h3, pickup_count, collision_count}) => { 
	h3combinedLayer[h3] = (h3combinedLayer[h3] || 0) + (pickup_count*0.1 - collision_count*2);
  });
  fetchedData = normalizeLayer(h3combinedLayer);
  return fetchedData;
}

function dayOfWeekAsString(dayIndex) {
  return ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][dayIndex];
}

function loadPickupHeatmap(lat, lng) {
	h3Index = h3.geoToH3(lat, lng, h3Granularity)
	
	var today = new Date();
	var hourOfDay = today.getHours()
	var dayOfWeek = today.getDay()
	const nearbyh3 = h3.kRing(h3Index, 3);
	
	var request = JSON.stringify({weekday: dayOfWeekAsString(dayOfWeek), hour:hourOfDay, h3:nearbyh3})

	postData(proxyUrl + pickupEndpoint, request)
	  .then(data => renderHexes(pickupLayerId, map, normalizeLayer(pickupLayer(data))) )
	  .catch(error => console.error(error));
}

function loadCollisionHeatmap(lat, lng) {
	h3Index = h3.geoToH3(lat, lng, h3Granularity)
	
	var today = new Date();
	var hourOfDay = today.getHours()
	var dayOfWeek = today.getDay()
	const nearbyh3 = h3.kRing(h3Index, 3);
	
	var request = JSON.stringify({weekday: dayOfWeekAsString(dayOfWeek), hour:hourOfDay, h3:nearbyh3})

	postData(proxyUrl + collisionEndpoint, request)
	  .then(data => renderHexes(collisionLayerId, map, normalizeLayer(collisionLayer(data))) )
	  .catch(error => console.error(error));
}

function loadBothHeatmap(lat, lng) {
	h3Index = h3.geoToH3(lat, lng, h3Granularity)
	
	var today = new Date();
	var hourOfDay = today.getHours()
	var dayOfWeek = today.getDay()
	const nearbyh3 = h3.kRing(h3Index, 3);
	
	var request = JSON.stringify({weekday: dayOfWeekAsString(dayOfWeek), hour:hourOfDay, h3:nearbyh3})

	postData(proxyUrl + combinedEndpoint, request)
	  .then(data => renderHexes(combinedLayerId, map, normalizeLayer(combinedLayer(data))) )
	  .catch(error => console.error(error));
}

async function postData(url, request) {
    let response  = await fetch(url, {
        method: "POST", 
        headers: {
            "Content-Type": "application/json"
        },
        body: request, 
    });
    let responseData = await response.json();
	return responseData;
}

function normalizeLayer(layer, baseAtZero = false) {
	  const newlayer = {};
	  const hexagons = Object.keys(layer);
	  // Pass one, get max
	  const max = hexagons.reduce((max, hex) => Math.max(max, layer[hex]), -Infinity);
	  const min = baseAtZero ? hexagons.reduce((min, hex) => Math.min(min, layer[hex]), Infinity) : 0;
	  // Pass two, normalize
	  hexagons.forEach(hex => {
		//if (nearbyh3.includes(hex)) {
		  newlayer[hex] = (layer[hex] - min) / (max - min); 
		//}
	  });
	  return newlayer;
}

function renderHexes(layerId, map, hexagons) {
  // Transform the current hexagon map into a GeoJSON object
  console.log(hexagons);
  const geojson = geojson2h3.h3SetToFeatureCollection(
    Object.keys(hexagons),
    hex => ({value: hexagons[hex]})
  );
  let source = map.getSource(sourceId);
  
  // Add the source and layer if we haven't created them yet
  if (!source) {
    map.addSource(sourceId, {
      type: 'geojson',
      data: geojson
    });
  }

  let layer = map.getLayer(layerId);
  
  if (!layer) {
	map.addLayer({
      id: layerId,
      source: sourceId,
      type: 'fill',
      interactive: false,
      paint: {
        'fill-outline-color': 'rgba(0,0,0,0)',
      }
    });
    source = map.getSource(sourceId);
  }

  // Update the geojson data
  source.setData(geojson);
  
  // Update the layer paint properties, using the current config values
  map.setPaintProperty(layerId, 'fill-color', {
    property: 'value',
    stops: [
	  [0, config.colorScale[0]],
      [0.1, config.colorScale[1]],
      [0.2, config.colorScale[2]],
	  [0.3, config.colorScale[3]],
      [0.4, config.colorScale[4]],
      [0.5, config.colorScale[5]],
	  [0.6, config.colorScale[6]],
      [0.7, config.colorScale[7]],
      [0.8, config.colorScale[8]],
	  [0.9, config.colorScale[9]],
	  [1, config.colorScale[10]]
    ]
  });
  
  map.setPaintProperty(layerId, 'fill-opacity', config.fillOpacity);
}

// create the popup

var popup = new mapboxgl.Popup({ offset: 25 })
	.setText('New York City to be filled');


// add markers to map
var marker = new mapboxgl.Marker({
	draggable: true
})
.setLngLat([config.lng,config.lat])
.setPopup(popup) // sets a popup on this marker
.addTo(map);

var lat = config.lat;
var lng = config.lng;

function onDragEnd() {
	lngLat = marker.getLngLat();
	lat = lngLat.lat;
	lng = lngLat.lng;
	var pickupBox = document.getElementById("pickup");
	var collisionBox = document.getElementById("collision");
	if (pickupBox.checked == true && collisionBox.checked == false){
		loadPickupHeatmap(lat, lng);
	}
	else if (pickupBox.checked == false && collisionBox.checked == true){
		loadCollisionHeatmap(lat, lng);
	}
	else if (pickupBox.checked == true && collisionBox.checked == true){
		loadBothHeatmap(lat, lng);
	}
	popup.setText('Longitude: ' + lng + ' Latitude: ' + lat);
}

marker.on('dragend', onDragEnd);

function HandleCheckboxes() {
	var pickupBox = document.getElementById("pickup");
	var collisionBox = document.getElementById("collision");
	if (pickupBox.checked == true && collisionBox.checked == false){
		loadPickupHeatmap(lat, lng);
		map.setLayoutProperty(collisionLayerId, 'visibility', 'none');
		map.setLayoutProperty(combinedLayerId, 'visibility', 'none');
		map.setLayoutProperty(pickupLayerId, 'visibility', 'visible');
	}
	else if (pickupBox.checked == false && collisionBox.checked == true){
		loadCollisionHeatmap(lat, lng);
		map.setLayoutProperty(collisionLayerId, 'visibility', 'visible');
		map.setLayoutProperty(combinedLayerId, 'visibility', 'none');
		map.setLayoutProperty(pickupLayerId, 'visibility', 'none');
	}
	else if (pickupBox.checked == true && collisionBox.checked == true){
		loadBothHeatmap(lat, lng);
		map.setLayoutProperty(collisionLayerId, 'visibility', 'none');
		map.setLayoutProperty(combinedLayerId, 'visibility', 'visible');
		map.setLayoutProperty(pickupLayerId, 'visibility', 'none');
	}
	else {
		map.setLayoutProperty(collisionLayerId, 'visibility', 'none');
		map.setLayoutProperty(combinedLayerId, 'visibility', 'none');
		map.setLayoutProperty(pickupLayerId, 'visibility', 'none');
	}
}



