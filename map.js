
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
  return d > 200 ? '#980043' :
         d > 150 ? '#dd1c77' :
         d > 100 ? '#b95191' :
         d > 50  ? '#d879a8' :
         d > 20  ? '#f78ac2' :
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

const legend = L.control({ position: 'bottomright' });

legend.onAdd = function (map) {
  const div = L.DomUtil.create('div', 'info legend');
  // match the breaks in your getColor()
  const grades = [0, 10, 50, 100, 150, 200, 240];

  div.innerHTML = '<strong>Demolitions</strong><br>';
  for (let i = 0; i < grades.length; i++) {
    div.innerHTML +=
      '<i style="background:' + getColor(grades[i]) + '"></i> ' +
      grades[i] + (grades[i + 1] ? '&ndash;' + (grades[i + 1] - 1) + '<br>' : '+');
  }
  return div;
};

legend.addTo(map);


fetch (demUrl)
.then ((resp) => resp.json())
.then (json => {
    demLayer.addData(json)
    demLayer.addTo(map);
})
  .catch(err => { console.error(err) });
