mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12',
    center: mapCoordinates, // starting position [lng, lat]
    zoom: 13 // starting zoom
});

console.log(mapCoordinates);

const marker = new mapboxgl.Marker()
    .setLngLat(mapCoordinates)
    .addTo(map);