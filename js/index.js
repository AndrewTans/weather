$(document).ready(function() {

    let userPosition, getUrl, getCity, userCityUrl, locationInfo;
    let apiKey = `AIzaSyA6xFVX1XWs7KZbBQ_2vxZ-SMqyhfkz1No`
    let apiLocationKey = `AIzaSyBzoB6Z3mEO1a7tjJLGgRnCC1BUvNEo6ss`;
    let tempCacheInfo = '';
    let cache = {};

    getLocation();

    $('button').on('click', function(event) {

        let inputCity = $('#city').val();
        userCityUrl = `https://cors.io/?https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${inputCity}&types=geocode&key=${apiLocationKey}`;

        // check if its on cache already
        if (cache[`${inputCity}`]) {
            $('.userCity').html(`Current city: ${cache[`${inputCity}`]['name']}`);
            $('.cityWeather').html(`Current weather: ${cache[`${inputCity}`]['weather']}`);
            return
        }
        getCityLocation(userCityUrl);
    });

    function getLocation() {
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
    }

    function getCityInfo(url) {
        fetch(url, {
            method: 'GET'
        }).then(function(response) {
            response.json().then(function(data) {

                if (!data) $('.userCity').html(`Could't show city`);
                tempCacheInfo = data.results[0].address_components[3].long_name;

                for (let i = 0; i < data.results[0].address_components.length; i++) {
                    if (data.results[0].address_components[i].types[0] == 'locality') {
                        tempCacheInfo = data.results[0].address_components[i].long_name;
                        break;
                    }
                }
                cache[`${tempCacheInfo}`] = { name: tempCacheInfo };
                $('.userCity').html(`Current city: ${tempCacheInfo}`);
            }).then(getWeather(getWeatherUrl(userPosition)))
        }).catch(err => console.log(err));
    }

    function getWeather(url) {
        fetch(url, {
            method: 'GET'
        }).then(function(response) {
            response.json().then(function(data) {
                cache[`${tempCacheInfo}`]['weather'] = `${data.currently.summary}`;
                cache[`${tempCacheInfo}`]['temperature'] = `${parseInt((data.currently.temperature - 32)/1.8)}°C`;
                if (!data) $('.cityWeather').html(`Wrong city selected`);
                $('.cityWeather').html(`Current weather: ${cache[`${tempCacheInfo}`]['weather']}`);
                $('.temperature').html(`Temperature: ${cache[`${tempCacheInfo}`]['temperature']}`)
            });
        }).catch(err => console.log(err));
    }

    function getCityLocation(url) {
        let tempId = '';
        fetch(url, {
            method: 'GET'
        }).then(function(response) {
            response.json().then(function(data) {
                if (data.predictions.length === 0) {
                    $('.userCity').html(`Wrong city selected`);
                    $('.cityWeather').html(``);
                    throw new Error('Wrong city selected!');
                };
                return tempId = data.predictions[0].place_id;
            }).then(getCityById);
        }).catch(err => console.log(err));
    }


    var getCityById = function(tempId) {

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
                userPosition = newLocation.toString();
            });
        })
    }


});