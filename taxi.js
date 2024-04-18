var map = L.map('map').setView([1.3521, 103.8198], 12);

// Open Street Map
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var yellowIcon = L.icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    shadowSize: [41, 41]
});


function updateTaxiLocations() {
    fetch('https://api.data.gov.sg/v1/transport/taxi-availability')
        .then(response => response.json())
        .then(data => {

            var numberOfTaxis = 0;

            data.features.forEach(feature => {

                if (feature.properties && feature.properties.taxi_count) {
                    numberOfTaxis += feature.properties.taxi_count;
                }
            });

            console.log("Number of taxis:", numberOfTaxis);

            document.getElementById('numberOfTaxis').textContent = "Number of Taxis: " + numberOfTaxis;

            // Clear 
            map.eachLayer(function (layer) {
                if (layer instanceof L.Marker) {
                    map.removeLayer(layer);
                }
            });

            // Add 
            L.geoJSON(data, {
                pointToLayer: function (feature, latlng) {
                    return L.marker(latlng, { icon: yellowIcon });
                }
            }).addTo(map);
        })
        .catch(error => console.error('Error fetching GeoJSON:', error));
}


updateTaxiLocations();
setInterval(updateTaxiLocations, 30000);