selectedCountry = {"name": JSON.parse(localStorage.selectedCountry).name, "iso_a2": JSON.parse(localStorage.selectedCountry).iso_a2, "iso_a3": JSON.parse(localStorage.selectedCountry).iso_a3, "geometry": JSON.parse(localStorage.selectedCountry).geometry};
var mycountry = JSON.parse(localStorage.selectedCountry).iso_a2;
var mycountryname = JSON.parse(localStorage.selectedCountry).name;

$(document).ajaxStop(function() {
    // place code to be executed on completion of last outstanding ajax call here
    localStorage.setItem('selectedCountry', JSON.stringify(selectedCountry));
  });

function replaceAccents(str){

    var diacritics = [
      {char: 'A', base: /[\300-\306]/g},
      {char: 'a', base: /[\340-\346]/g},
      {char: 'E', base: /[\310-\313]/g},
      {char: 'e', base: /[\350-\353]/g},
      {char: 'I', base: /[\314-\317]/g},
      {char: 'i', base: /[\354-\357]/g},
      {char: 'O', base: /[\322-\330]/g},
      {char: 'o', base: /[\362-\370]/g},
      {char: 'U', base: /[\331-\334]/g},
      {char: 'u', base: /[\371-\374]/g},
      {char: 'N', base: /[\321]/g},
      {char: 'n', base: /[\361]/g},
      {char: 'C', base: /[\307]/g},
      {char: 'c', base: /[\347]/g}
    ]
  
    diacritics.forEach(function(letter){
      str = str.replace(letter.base, letter.char);
    });
  
    return str;
  };

//Geonames

//test
$.ajax({
    url: "php/general/geonames.php",
    type: 'POST',
    dataType: 'json',
    data: {
        country: mycountry,
    },
    success: function(result) {


        if (result.status.name == "ok") {
            selectedCountry.continent = result['data'][0]['continentName']; //NOPE
            selectedCountry.area = result['data'][0]['areaInSqKm']; //NOPE
            
        }
    
    },
    error: function(jqXHR, textStatus, errorThrown) {

    }
    
});

//RESTCountries
$.ajax({
    url: "php/general/restcountries.php",
    type: 'POST',
    dataType: 'json',
    data: {
        country: mycountry,
    },
    success: function(result) {

        //console.log("RESTCountries Success");

        if (result.status.name == "ok") {

            //Set Data to Country Object
            selectedCountry.capital = replaceAccents(result['data']['capital']);
            selectedCountry.region = result['data']['region'];
            selectedCountry.population = result['data']['population'];
            selectedCountry.currency = result['data']['currencies'][0]['name'];
            selectedCountry.currencycode = result['data']['currencies'][0]['code'];
            selectedCountry.currencysymbol = result['data']['currencies'][0]['symbol'];
            selectedCountry.currencies = result['data']['currencies'];
            selectedCountry.language = result['data']['languages'][0]['name'];
            selectedCountry.flag = result['data']['flag'];
            selectedCountry.timezones = result['data']['timezones'];
            


            
            

        }
    
    },
    error: function(jqXHR, textStatus, errorThrown) {
        //console.log("RESTCountries Fail")

    }
    
});

//Weather
$.ajax({
    url: "php/climate/weather.php",
    type: 'POST',
    dataType: 'json',
    data: {
        country: selectedCountry.name,
    },
    success: function(result) {

        //console.log("Weather Current Success");
        

        if (result.status.name == "ok") {
            
            //Set Data to Country Object

            //Capital
            //Current Weather
            selectedCountry.weather = {};

            selectedCountry.weather.temperature = result['data']['current']['temp_c'];
            selectedCountry.weather.description = result['data']['current']['condition']['text'];
            selectedCountry.weather.windSpeed = result['data']['current']['wind_mph'];
            selectedCountry.weather.windDirection = result['data']['current']['wind_dir'];
            selectedCountry.weather.precipitation = result['data']['current']['precip_mm'];

            selectedCountry.weather.humidity = result['data']['current']['humidity'];
            selectedCountry.weather.cloudcover = result['data']['current']['cloud'];
            selectedCountry.weather.feelslike = result['data']['current']['feelslike_c'];
            selectedCountry.weather.uvIndex = result['data']['current']['uv'];
            selectedCountry.weather.visibility = result['data']['current']['vis_km'];
            selectedCountry.weather.isDay = result['data']['current']['is_day'];
            selectedCountry.weather.barPressure = result['data']['current']['pressure_mb'];

            //Forecast for the Week
            selectedCountry.weather.forecast = result['data']['forecast']['forecastday'];

            
            
            //Weather icon
            switch(selectedCountry.weather.description) {
                
                case "Sunny":
                  // code block
                  selectedCountry.weather.icon = "https://api.met.no/images/weathericons/svg/clearsky_day.svg"
                  break;
                case "Partly cloudy":
                  // code block
                  selectedCountry.weather.icon = "https://api.met.no/images/weathericons/svg/fair_day.svg"
                  break;
                case "Cloudy":
                    // code block
                    selectedCountry.weather.icon = "https://api.met.no/images/weathericons/svg/cloudy.svg"
                  break;
                case "Overcast":
                    // code block
                    selectedCountry.weather.icon = "https://api.met.no/images/weathericons/svg/partlycloudy_day.svg"
                  break;
                case "Mist":
                    // code block
                    selectedCountry.weather.icon = "https://api.met.no/images/weathericons/svg/fog.svg"
                  break;
                case "Patchy rain possible":
                    // code block
                    selectedCountry.weather.icon = "https://api.met.no/images/weathericons/svg/lightrain.svg"
                  break;
                case "Patchy snow possible":
                    // code block
                    selectedCountry.weather.icon = "https://api.met.no/images/weathericons/svg/lightsnow.svg"
                  break;
                case "Patchy sleet possible":
                    // code block
                    selectedCountry.weather.icon = "https://api.met.no/images/weathericons/svg/sleet.svg"
                  break;
                case "Patchy freezing drizzle possible":
                    // code block
                    selectedCountry.weather.icon = "https://api.met.no/images/weathericons/svg/lightsleet.svg"
                  break;
                case "Thundery outbreaks possible":
                    // code block
                    selectedCountry.weather.icon = "https://api.met.no/images/weathericons/svg/lightrainshowersandthunder_day.svg"
                  break;
                case "Blowing snow":
                    // code block
                    selectedCountry.weather.icon = "https://api.met.no/images/weathericons/svg/snow.svg"
                  break;
                case "Blizzard":
                    // code block
                    selectedCountry.weather.icon = "https://api.met.no/images/weathericons/svg/snow.svg"
                  break;
                case "Fog":
                    // code block
                    selectedCountry.weather.icon = "https://api.met.no/images/weathericons/svg/fog.svg"
                  break;
                case "Freezing fog":
                    // code block
                    selectedCountry.weather.icon = "https://api.met.no/images/weathericons/svg/snow.svg"
                  break;
                case "Patchy light drizzle":
                    // code block
                    selectedCountry.weather.icon = "https://api.met.no/images/weathericons/svg/lightrain.svg"
                  break;
                case "Light drizzle":
                    // code block
                    selectedCountry.weather.icon = "https://api.met.no/images/weathericons/svg/lightrain.svg"
                  break;
                case "Freezing drizzle":
                    // code block
                    selectedCountry.weather.icon = "https://api.met.no/images/weathericons/svg/lightsnow.svg"
                  break;
                case "Heavy freezing drizzle":
                    // code block
                    selectedCountry.weather.icon = "https://api.met.no/images/weathericons/svg/lightsnow.svg"
                  break;
                case "Patchy light rain":
                    // code block
                    selectedCountry.weather.icon = "https://api.met.no/images/weathericons/svg/lightrain.svg"
                  break;
                case "Light Rain":
                    // code block
                    selectedCountry.weather.icon = "https://api.met.no/images/weathericons/svg/lightrain.svg"
                  break;
                case "Moderate rain at times":
                    // code block
                    selectedCountry.weather.icon = "https://api.met.no/images/weathericons/svg/rain.svg"
                  break;
                case "Moderate rain":
                    // code block
                    selectedCountry.weather.icon = "https://api.met.no/images/weathericons/svg/rain.svg"
                  break;
                case "Heavy rain at times":
                    // code block
                    selectedCountry.weather.icon = "https://api.met.no/images/weathericons/svg/rain.svg"
                  break;
                case "Heavy rain":
                    // code block
                    selectedCountry.weather.icon = "https://api.met.no/images/weathericons/svg/rain.svg"
                  break;
                case "Light freezing rain":
                    // code block
                    selectedCountry.weather.icon = "https://api.met.no/images/weathericons/svg/sleet.svg"
                  break;
                case "Moderate or heavy freezing rain":
                    // code block
                    selectedCountry.weather.icon = "https://api.met.no/images/weathericons/svg/sleet.svg"
                  break;
                case "Light sleet":
                    // code block
                    selectedCountry.weather.icon = "https://api.met.no/images/weathericons/svg/lightsnow.svg"
                  break;
                case "Moderate or heavy sleet":
                    // code block
                    selectedCountry.weather.icon = "https://api.met.no/images/weathericons/svg/sleet.svg"
                  break;
                case "Patchy light snow":
                    // code block
                    selectedCountry.weather.icon = "https://api.met.no/images/weathericons/svg/lightsnow.svg"
                  break;
                case "Light snow":
                    // code block
                    selectedCountry.weather.icon = "https://api.met.no/images/weathericons/svg/lightsnow.svg"
                  break;
                case "Patchy moderate snow":
                    // code block
                    selectedCountry.weather.icon = "https://api.met.no/images/weathericons/svg/snow.svg"
                  break;
                case "Moderate snow":
                    // code block
                    selectedCountry.weather.icon = "https://api.met.no/images/weathericons/svg/snow.svg"
                  break;
                case "Patchy heavy snow":
                    // code block
                    selectedCountry.weather.icon = "https://api.met.no/images/weathericons/svg/snow.svg"
                  break;
                case "Heavy snow":
                    // code block
                    selectedCountry.weather.icon = "https://api.met.no/images/weathericons/svg/snow.svg"
                  break;
                case "Ice pellets":
                    // code block
                    selectedCountry.weather.icon = "https://api.met.no/images/weathericons/svg/snow.svg"
                  break;
                case "Light rain shower":
                    // code block
                    selectedCountry.weather.icon = "https://api.met.no/images/weathericons/svg/lightrain.svg"
                  break;
                case "Moderate or heavy rain shower":
                    // code block
                    selectedCountry.weather.icon = "https://api.met.no/images/weathericons/svg/rain.svg"
                  break;
                case "Torrential rain shower":
                    // code block
                    selectedCountry.weather.icon = "https://api.met.no/images/weathericons/svg/heavyrain.svg"
                  break;
                case "Light sleet showers":
                    // code block
                    selectedCountry.weather.icon = "https://api.met.no/images/weathericons/svg/sleet.svg"
                  break;
                case "Moderate or heavy sleet showers":
                    // code block
                    selectedCountry.weather.icon = "https://api.met.no/images/weathericons/svg/sleet.svg"
                  break;
                case "Light snow showers":
                    // code block
                    selectedCountry.weather.icon = "https://api.met.no/images/weathericons/svg/lightsnow.svg"
                  break;
                case "Moderate or heavy snow showers":
                    // code block
                    selectedCountry.weather.icon = "https://api.met.no/images/weathericons/svg/snowshowers_day.svg"
                  break;
                case "Light showers of ice pellets":
                    // code block
                    selectedCountry.weather.icon = "https://api.met.no/images/weathericons/svg/sleet.svg"
                  break;
                case "Moderate or heavy showers of ice pellets":
                    // code block
                    selectedCountry.weather.icon = "https://api.met.no/images/weathericons/svg/sleet.svg"
                  break;
                case "Patchy light rain with thunder":
                    // code block
                    selectedCountry.weather.icon = "https://api.met.no/images/weathericons/svg/rainandthunder.svg"
                  break;
                case "Moderate or heavy rain with thunder":
                    // code block
                    selectedCountry.weather.icon = "https://api.met.no/images/weathericons/svg/rainandthunder.svg"
                  break;
                case "Patchy light snow with thunder":
                    // code block
                    selectedCountry.weather.icon = "https://api.met.no/images/weathericons/svg/snowandthunder.svg"
                  break;
                case "Moderate or heavy snow with thunder":
                    // code block
                    selectedCountry.weather.icon = "https://api.met.no/images/weathericons/svg/snowandthunder.svg"
                  break;
                case "Clear":
                    // code block
                    selectedCountry.weather.icon = "https://api.met.no/images/weathericons/svg/clearsky_day.svg"
                  break;
                default:
                  // code block
                  selectedCountry.weather.icon = "https://api.met.no/images/weathericons/svg/clearsky_day.svg"

              }

            //Location
            selectedCountry.location = [result['data']['location']['lat'],result['data']['location']['lon']];

            //Update UI
            
            $('#climate-icon').html('<img src="' + selectedCountry.weather.icon + '" alt="Weathericon">');
            $('#climate-description').html(selectedCountry.weather.description);
            $('#climate-temperature').html(selectedCountry.weather.temperature + "&deg");
            $('#climate-feelslike').html("Feels like " + selectedCountry.weather.feelslike + "&deg");

        }
    
    },
    error: function(jqXHR, textStatus, errorThrown) {
        //console.log("Weather Current Fail")
    }
    
});
