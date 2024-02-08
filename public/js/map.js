mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  center: [75.3412, 31.1471], // starting position [lng, lat]
  zoom: 9, // starting zoom
});
