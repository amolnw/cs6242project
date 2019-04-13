var h3, geojson2h3, fetchedData;
var h3Granularity = 10;
mapboxgl.accessToken = 'pk.eyJ1IjoiYW1vbG53IiwiYSI6ImNqdGY4ZjlqNjFxZDkzeW9iczE4MWg4MGEifQ.YpUeahTCDxjUq84pSDGeNw';

var pickupEndpoint = 'https://gxv2awctcc.execute-api.us-east-1.amazonaws.com/taxi/taxipickupcounts'
var proxyUrl = 'https://cors-anywhere.herokuapp.com/'

const sourceId = 'h3-hexes';
const layerId = `${sourceId}-layer`;

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
	loadHeatmap(config.lat, config.lng);
});

require(['geojson2h3'], function (geojson2h3loaded) {
	geojson2h3 = geojson2h3loaded
});



function pickupLayer(pickupData) {
  const h3PickupLayer = {};
  console.log(pickupData);
  pickupData.forEach(({h3, pickup_count}) => {
    h3PickupLayer[h3] = (h3PickupLayer[h3] || 0) + pickup_count;
  });
  fetchedData = normalizeLayer(h3PickupLayer);
  return h3PickupLayer;
}

function collisionLayer(collision, lat, lng) {
  const collisionLayer = {};
  collision.forEach(({latitude, longitude, collision_count}) => {
    const h3Index = h3.geoToH3(latitude, longitude, h3Granularity);
    collisionLayer[h3Index] = (collisionLayer[h3Index] || 0) + collision_count;
  });
  fetchedData = normalizeLayer(collisionLayer);
  return fetchedData;
}

function loadHeatmap(lat, lng) {
	h3Index = h3.geoToH3(lat, lng, h3Granularity)
	
	var today = new Date();
	var hourOfDay = today.getHours()
	var dayOfWeek = today.getDay()
	const nearbyh3 = h3.kRing(h3Index, 3);
	
	var request = JSON.stringify({weekday: dayOfWeekAsString(dayOfWeek), hour:hourOfDay, h3:nearbyh3})
	postData(proxyUrl + pickupEndpoint, request)
	  .then(data => renderHexes(map, normalizeLayer(pickupLayer(data))) )
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

function dayOfWeekAsString(dayIndex) {
  return ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][dayIndex-1];
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

function renderHexes(map, hexagons) {
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

function onDragEnd() {
	var lngLat = marker.getLngLat();
	loadHeatmap(lngLat.lat, lngLat.lng);
	popup.setText('Longitude: ' + lngLat.lng + ' Latitude: ' + lngLat.lat);
}

marker.on('dragend', onDragEnd);

function handlePickups() {
  var checkBox = document.getElementById("pickup");
  if (checkBox.checked == true){
	map.setLayoutProperty(layerId, 'visibility', 'visible');
  } else {
    map.setLayoutProperty(layerId, 'visibility', 'none');
  }
}

function handleCollisions() {
  var checkBox = document.getElementById("collision");
  if (checkBox.checked == true){
	map.setLayoutProperty(collisionLayerId, 'visibility', 'visible');
  } else {
    map.setLayoutProperty(collisionLayerId, 'visibility', 'none');
  }
}  



