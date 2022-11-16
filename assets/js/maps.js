
function initMap() {
var map = new google.maps.Map(document.getElementById("map"), {
zoom:3,
center: {
    lat: 44.619261,
    lng: -38.134766
}
});
var labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var locations = [
{lat: 40.785091, lng: -73.968285},
{lat: 41.084045, lng: -73.874245},
{lat: 40.754932, lng: -73.984016},
];
const markers = locations.map((position, i) => {
const label = labels[i % labels.length];
const marker = new google.maps.Marker({
position,
label,
});
// markers can only be keyboard focusable when they have click listeners
// open info window when marker is clicked
marker.addListener("click", () => {
infoWindow.setContent(label);
infoWindow.open(map, marker);
});
return marker;
});
var markerCluster = new MarkerClusterer(map, markers, { imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m' });
}
