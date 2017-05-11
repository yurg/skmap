  var skmap = L.map('mapid').setView([48.730477, 19.704924], 8.4);

  var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  var osmAttrib='Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
  var osm = new L.TileLayer(osmUrl, {minZoom: 8, maxZoom: 18, attribution: osmAttrib}); 
  skmap.addLayer(osm);
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

  /*omnivore kml */
  omnivore.kml('kupele.kml')
      .on('ready', function(layer) {
          this.eachLayer(function(layer) {
              layer.bindPopup(layer.feature.properties.name + "<br>" + layer.feature.properties.description);
          });

      }).addTo(skmap);

  omnivore.kml('rekreacne.kml')
      .on('ready', function(layer) {
          

          this.eachLayer(function(layer) {


              layer.bindPopup(layer.feature.properties.name + "<br>" + layer.feature.properties.description);
          });

      }).addTo(skmap);

      /* icons */

 var mount = L.AwesomeMarkers.icon({
    icon: 'fa-area-chart',
    markerColor: 'red'
  });
