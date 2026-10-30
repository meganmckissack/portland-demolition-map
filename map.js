
var map = window.L.map('map').setView([45.5235494,-122.654917], 13);


var demUrl = 'Residential_Demolition_Permits.geojson';
var boundaryUrl = 'pdxBoundaryCount.geojson';


// base tile layer
L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles &copy; Esri &mdash; Esri, HERE, Garmin, &copy; OpenStreetMap contributors',
  maxZoom: 16
}).addTo(map);


function style(feature) {
  return {
    fillColor: getColor(feature.properties.NUMPOINTS),
    weight: 2,
    opacity: 1,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.7
  };
}


function getColor(d) {
  return d >= 275 ? '#980043' :
         d >= 189 ? '#dd1c77' :
         d >= 113 ? '#df65b0' :
         d >= 65  ? '#d7b5d8' :
         d >= 23  ? '#f1eef6' :
         '#c5c3c6';
}

// Neighborhood boundaries
fetch(boundaryUrl)
  .then(resp => resp.json())
  .then(json => {
    L.geoJSON(json, {
      style: style,
      onEachFeature: (feature, layer) => {
        layer.bindPopup(`<h2>${feature.properties.MAPLABEL}</h2>
          <p>Number of demolitions: ${feature.properties.NUMPOINTS}</p>`);
      }
    }).addTo(map).bringToBack();
  })
  .catch(err => console.error(err));


var demLayer = window.L.geoJSON(null, {
  pointToLayer: (feature, latlng) => new window.L.CircleMarker(latlng, {
    radius: 3,
    fillColor: "#4c0353",
    color: 'transparent',
    opacity: 1,
    fillOpacity: 0.4
  }),
  onEachFeature: (feature, layer) => {
    layer.bindPopup(`
      <h2>Residential Demolition Permits</h2>
      <ul>
        <li>Status: ${feature.properties.STATUS}</li>
        <li>Propstreet: ${feature.properties.PROPSTREET}</li>
        <li>Permit: ${feature.properties.PERMIT}</li>
        <li>Type: ${feature.properties.TYPE}</li>
        <li>Work Description: ${feature.properties.WORK_DESCRIPTION}</li>
        <li>Issued: ${feature.properties.ISSUED}</li>
        <li>Finaled: ${feature.properties.FINALED}</li>
        <li>Description: ${feature.properties.DESCRIPTION}</li>
      </ul>
    `)
  },
})


fetch (demUrl)
.then ((resp) => resp.json())
.then (json => {
    demLayer.addData(json)
    demLayer.addTo(map);
})
  .catch(err => { console.error(err) });
