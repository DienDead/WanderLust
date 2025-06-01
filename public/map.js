mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12',
    center: mapCoordinates, // starting position [lng, lat]
    zoom: 13 // starting zoom
});

console.log(mapCoordinates);

const marker = new mapboxgl.Marker({color: "red"})
    .setLngLat(mapCoordinates)
    .setPopup(new mapboxgl.Popup({offset: 25})
    .setHTML(`<h4>${listing.location}</h4><p>Exact location post-booking</p>`)
    .setMaxWidth("300px"))
    .addTo(map);