$(document).ready(function() {

    let userPosition, getUrl, getCity, userCityUrl, locationInfo;
    let apiKey = `AIzaSyA6xFVX1XWs7KZbBQ_2vxZ-SMqyhfkz1No`
    let apiLocationKey = `AIzaSyBzoB6Z3mEO1a7tjJLGgRnCC1BUvNEo6ss`;

    $('button').on('click', function(event) {
        console.log($('#city').val());
        let inputCity = $('#city').val();
        userCityUrl = `https://cors.io/?https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${inputCity}&types=geocode&key=${apiLocationKey}`;
        getCityLocation(userCityUrl);
    });

    function getLocation() {
        console.log(navigator.geolocation);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            $('.userPosition').html('Location is not supported');
        }
    }

    function getWeatherUrl(location) {
        return `https://cors.io/?https://api.darksky.net/forecast/ad5b3ee03304b5b14059582d2a42dbdf/${location}`;
    }

    function getCityUrl(location) {
        return `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location}&key=${apiKey}`;
    }

    function showPosition(position) {
        userPosition = `${position.coords.latitude},${position.coords.longitude}`;
        getCityInfo(getCityUrl(userPosition));
        getWeather(getWeatherUrl(userPosition));
    }

    getLocation();

    function getWeather(url) {
        fetch(url, {
            method: 'GET'
        }).then(function(response) {
            response.json().then(function(data) {
                if (!data) return $('.cityWeather').html(`Wrong city selected`);
                $('.cityWeather').html(`Current weather: ${data.currently.summary}<br>
                						timezone: ${data.timezone}`);
            });
        }).catch(err => console.log(err));
    }

    function getCityInfo(url) {
        fetch(url, {
            method: 'GET'
        }).then(function(response) {
            response.json().then(function(data) {
                if (!data) return $('.userCity').html(`Could't show city`);
                console.log(data);
                $('.userCity').html(`Current city: ${data.results[0].address_components[3].long_name}`);
            })
        }).catch(err => console.log(err));
    }

    function getCityLocation(url) {
        let tempId = '';
        fetch(url, {
            method: 'GET'
        }).then(function(response) {
            response.json().then(function(data) {
            	console.log(data);
                if (!data) return $('.userCity').html(`Wrong city selected`);
                return tempId = data.predictions[0].place_id;
            }).then(getCityById);
        }).catch(err => console.log(err));
    }


    var getCityById = function(tempId) {
        console.log(tempId);
        fetch(`https://cors.io/?https://maps.googleapis.com/maps/api/place/details/json?placeid=${tempId}&key=${apiLocationKey}`, {
            method: 'GET'
        }).then(function(response) {
            response.json().then(function(data) {
                let locationObj = data.result.geometry.location;
                let newLocation = [];
                for (key in locationObj) {
                    newLocation.push(locationObj[key]);
                }

                getCityInfo(getCityUrl(newLocation.toString()));
                getWeather(getWeatherUrl(newLocation.toString()));
            });
        })
    }


});