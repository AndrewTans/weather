$(document).ready(function() {

	let userPosition;


function getLocation() {
	console.log(navigator.geolocation);
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
    	$('.userPosition').html('Location is not supported');
    }
}
function showPosition(position) {
    console.log("Latitude: " + position.coords.latitude + 
    "<br>Longitude: " + position.coords.longitude); 
    userPosition = `${position.coords.latitude}, ${position.coords.longitude}`
}

getLocation();


});