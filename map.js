  var skmap = L.map('mapid').setView([48.730477, 19.704924], 8.4);

  var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  var osmAttrib='Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors. Icons: <div>Icons made by <a href="http://www.freepik.com" title="Freepik">Freepik</a> from <a href="http://www.flaticon.com" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>';
  var osm = new L.TileLayer(osmUrl, {minZoom: 8, maxZoom: 18, attribution: osmAttrib}); 
  skmap.addLayer(osm);
 
googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
});
skmap.addLayer(googleStreets);

 /*
  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
      maxZoom: 18,
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <br>' +
          '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
          'Imagery © <a href="http://mapbox.com">Mapbox</a>',
      id: 'mapbox.streets'
  }).addTo(skmap);
*/


  /*###Add geojson######*/

  var geojsonLayer = new L.GeoJSON.AJAX("slovensko.geojson", {
      pointToLayer: function(feature, latlng) {
          rdens = Math.round(feature.properties.Percent);
          return new L.CircleMarker(latlng, {
              radius: (rdens > 30) ? rdens / 10 : 5,
              color: (rdens > 30) ? "#333" : "Sienna",
              fillOpacity: (rdens > 30) ? .9 : .3,
          });
      },
      onEachFeature: function(feature, layer) {
          layer.bindPopup(
              feature.properties.Address + '<br>' + 'Total inhabitants: ' + feature.properties.TotalW + '<br>' + 'Rom: ' + feature.properties.TotalB + '<br>' + 'Percent: ' + feature.properties.Percent + '%<br>'
          );
      }
  });

  geojsonLayer.addTo(skmap).on("data:loaded", function() {
      map.fitBounds(geojsonLayer.getBounds());
  });


  /* Geocoder  */
  L.Control.geocoder().addTo(skmap);
/*
 omnivore.kml('rekreacne.kml')
      .on('ready', function(layer) {
            this.eachLayer(function(layer) {
              layer.bindPopup(layer.feature.properties.name + "<br>" + layer.feature.properties.description);
          });
}).addTo(skmap);
*/

/* http://jsfiddle.net/nathansnider/Lo8cmuvt/ */

/* SPA */
 var spaLayer = L.geoJson(null, {
    onEachFeature: getPopup,
    pointToLayer: getSpaMarker,
});

var spa = omnivore.kml('kupele.kml', null, spaLayer).addTo(skmap);

/*SKI*/
 var skiLayer = L.geoJson(null, {
    onEachFeature: getPopup,
    pointToLayer: getSkiMarker,
});



var ski = omnivore.kml('rekreacne.kml', null, skiLayer).addTo(skmap);

var spaIcon = L.icon({
    iconUrl: 'spa.png',
    iconSize:     [32, 32], // size of the icon
    shadowSize:   [0, 0], // size of the shadow
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    shadowAnchor: [0, 0],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

function getSpaMarker(feature, latlng) {
  return L.marker(latlng, {
    icon: spaIcon
  });
}

var skiIcon = L.icon({
    iconUrl: 'ski.png',
    iconSize:     [32, 32], // size of the icon
    shadowSize:   [0, 0], // size of the shadow
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    shadowAnchor: [0, 0],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});


function getSkiMarker(feature, latlng) {
  return L.marker(latlng, {
    icon: skiIcon
  });
}

function getPopup(feature, layer) {
      layer.bindPopup(layer.feature.properties.name + "<br>" + layer.feature.properties.description);
}

var maptypes = L.layerGroup([googleStreets, osm]);
var infotypes = L.layerGroup([spa, ski, geojsonLayer]);

var baseMaps = {
    "Google": googleStreets,
    "OSM": osm
};

var overlayMaps = {
    "Spa": spa,
    "Ski": ski,
    "R": geojsonLayer
};

L.control.layers(baseMaps, overlayMaps).addTo(skmap);