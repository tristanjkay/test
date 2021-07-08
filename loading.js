selectedCountry = {"name": JSON.parse(localStorage.selectedCountry).name, "iso_a2": JSON.parse(localStorage.selectedCountry).iso_a2, "iso_a3": JSON.parse(localStorage.selectedCountry).iso_a3, "geometry": JSON.parse(localStorage.selectedCountry).geometry};
var mycountry = JSON.parse(localStorage.selectedCountry).iso_a2;
var mycountryname = JSON.parse(localStorage.selectedCountry).name;

//Dates for lookups
var date = new Date();
var sevendaysago = new Date();
sevendaysago.setDate(date.getDate() - 7);
date = date.toLocaleDateString();
date = date.split("/").reverse().join("/");
sevendaysago = sevendaysago.toLocaleDateString();
sevendaysago = sevendaysago.split("/").reverse().join("/");

$(document).ajaxStop(function() {
    // place code to be executed on completion of last outstanding ajax call here
    localStorage.setItem('todaysDate', date);
    localStorage.setItem('sevendaysago', sevendaysago);
    localStorage.setItem('selectedCountry', JSON.stringify(selectedCountry));
    console.log("Finished!");
    window.location.replace("screen2.html");
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



        }
    
    },
    error: function(jqXHR, textStatus, errorThrown) {
        //console.log("Weather Current Fail")
    }
    
});

//DictionaryAPI
$.ajax({
    url: "php/general/dictionary.php",
    type: 'POST',
    dataType: 'json',
    data: {
        country: selectedCountry.name,
    },
    success: function(result) {

        //console.log("Dictionary Success");

        if (result.status.name == "ok") {
            selectedCountry.description = result['data'][0]['meanings'][0]['definitions'][0]['definition']
            //$("#description-text").html(selectedCountry.description);
            
            
    }
},
    error: function(jqXHR, textStatus, errorThrown) {
        //console.log("Dictionary Fail")
    }
    
});

//Airports
$.ajax({
    url: "php/flights/airports-fileget.php",
    type: 'POST',
    dataType: 'json',
    data: {
        country: selectedCountry.iso2,
    },
    success: function(result) {
        selectedCountry.airports = [];

        //console.log("Airports Success");

        if (result.status.name == "ok") {
            result['data'].forEach(element => {
            if(element.Country == selectedCountry.name){
                selectedCountry.airports.push(element);

                
            }
            if(element.City == selectedCountry.capital){
                selectedCountry.airport = element;
            }
            });

            //Flights
/* $.ajax({
url: "php/flights/flights.php",
type: 'POST',
dataType: 'json',
data: {
    country: selectedCountry.airport.name,
},
success: function(result) {
    selectedCountry.flights = [];

    //console.log("Flights Success");

    if (result.status.name == "ok") {

        if(selectedCountry.airports.length > 0){
            selectedCountry.airports.forEach(element => {
                selectedCountry.flights.push(element);


                if(element.city == selectedCountry.name){
                    selectedCountry.airport = element.name;
                }	
            });
        }
        
        //console.log(result['data']);
}
},
error: function(jqXHR, textStatus, errorThrown) {
    //console.log("Dictionary Fail")
}

}); */
            
            
    }
},
    error: function(jqXHR, textStatus, errorThrown) {
        //console.log("Dictionary Fail")
    }
    
});



//ExchangeRateAPI
$.ajax({
    url: "php/economy/exchangerate.php",
    type: 'POST',
    dataType: 'json',
    data: {
        country: selectedCountry.currencycode,
    },
    success: function(result) {

        //console.log("Exchange Rate Success");

        if (result.status.name == "ok") {
            //console.log(selectedCountry.currencycode);
            if(typeof selectedCountry.currencycode != 'undefined'){
                selectedCountry.exchangerate = result['data']['rates'][selectedCountry.currencycode].toFixed(2);
            }
            
            //console.log(selectedCountry.exchangerate);
            selectedCountry.othercurrencies = result['data']['rates'];

            for (const [key, value] of Object.entries(selectedCountry.othercurrencies)) {
                ////console.log(`${key}: ${value}`);

                //1 in other currencies = x chosen country
                selectedCountry.othercurrencies[key] = selectedCountry.exchangerate/value;
                
                //Inverse
                //selectedCountry.othercurrencies[key] = 1/value;

              };

            $('#currency').html(selectedCountry.currency);
            //TODO Make this work
            $('#exchangeratevalue').html(selectedCountry.exchangerate);
            
            
    }
},
    error: function(jqXHR, textStatus, errorThrown) {
        //console.log("Exchange Rate Fail")

    }
    
});

//NewsAPI
$.ajax({
    url: "php/events/news.php",
    type: 'POST',
    dataType: 'json',
    data: {
        country: selectedCountry.name,
    },
    success: function(result) {

        

        if (result.status.name == "ok") {
            //console.log("News Success");

            selectedCountry.news = result['data']['response']['results'];
            selectedCountry.news.forEach(article => {
                var webtitle = article.webTitle;
                selectedCountry.news[article.webPublicationDate.split("T")[0]] = [];
                selectedCountry.news[article.webPublicationDate.split("T")[0]][webtitle] = article;
                selectedCountry.news[article.webPublicationDate.split("T")[0]][article.webTitle]['text'] = (article.blocks.body[0].bodyTextSummary).split(" ").slice(0, 65).join(" ") + "...";
                //article['text'] = (article.blocks.body[0].bodyTextSummary).split(" ").slice(0, 65).join(" ") + "...";
                //(article.blocks.body[0].bodyTextSummary).split(" ").slice(0, 65).join(" ");
                //(article.blocks.body[0].bodyTextSummary).substring(0, 300) + "...";
                //article.text = article.blocks.body[0].bodyTextSummary
            });
             }
},
    error: function(jqXHR, textStatus, errorThrown) {

        //console.log("News Fail")

    }
    
});

//POIs
$.ajax({
    url: "php/culture/pointsofinterest.php",
    type: 'POST',
    dataType: 'json',
    data: {
        country: selectedCountry.name,
    },
    
    success: function(result) {

        //console.log("POI Success")

        if (result.status.name == "ok") {
            selectedCountry.pois = result['data'];
            
    }
},
    error: function(jqXHR, textStatus, errorThrown) {
        //console.log("POI Fail")

    }
    
});

//WorldBank
//GDP
$.ajax({
url: "php/worldbank/worldbankgdp.php",
type: 'POST',
dataType: 'json',
data: {
    country: mycountry,
},
success: function(result) {

    //console.log("WorldBank Success")

    
    
    //console.log(thousands);

    

    if (result.status.name == "ok") {
        //Formatting String
    var rounded0 = result['data'][1][0]['value'].toFixed();
    var length = rounded0.toString().length;
    var thousands = (length/3).toFixed();
        
        selectedCountry.gdp = {
            "value": result['data'][1][0]['value'],
            "description": result['data'][1][0]['indicator']['value'],
            "string": "test"
            
        };
        switch (thousands) {
            case "0":
                //Less than 1000
                
                selectedCountry.gdp["string"] = result['data'][1][0]['value'];
                break;

            case "1":
                //Thousand
                selectedCountry.gdp["string"] = result['data'][1][0]['value'].toString().charAt(0) + "." + result['data'][1][0]['value'].toString().charAt(1) + result['data'][1][0]['value'].toString().charAt(2) + "K";
                break;

            case "2":
                //Million
                selectedCountry.gdp["string"] = result['data'][1][0]['value'].toString().charAt(0) + "." + result['data'][1][0]['value'].toString().charAt(1) + result['data'][1][0]['value'].toString().charAt(2) + "M";
                break;

            case "3":
                //Billion
                selectedCountry.gdp["string"] = result['data'][1][0]['value'].toString().charAt(0) + "." + result['data'][1][0]['value'].toString().charAt(1) + result['data'][1][0]['value'].toString().charAt(2) + "B";
                break;
            
            case "4":
                //Trillion
                selectedCountry.gdp["string"] = result['data'][1][0]['value'].toString().charAt(0) + "." + result['data'][1][0]['value'].toString().charAt(1) + result['data'][1][0]['value'].toString().charAt(2) + "T";
                break;

            case "5":
                selectedCountry.gdp["string"] = "5";
                break;

            case "6":
                selectedCountry.gdp["string"] = "6";
                break;
            
            case "7":
                selectedCountry.gdp["string"] = "7";
                break;

            default:
                //console.log("It didnt work");
                break;
        }
        
        


    }

},
error: function(jqXHR, textStatus, errorThrown) {

    //console.log("WorldBank Fail")

}

});

//Inflation Rate
$.ajax({
url: "php/worldbank/worldbankinflation.php",
type: 'POST',
dataType: 'json',
data: {
    country: mycountry,
},
success: function(result) {

    //console.log("WorldBank INF Success")

    if (result.status.name == "ok") {
        //Formatting String
    var rounded0 = result['data'][1][0]['value'].toFixed();
    var length = rounded0.toString().length;
    var thousands = (length/3).toFixed();


        selectedCountry.inflation = {
            "value": result['data'][1][0]['value'],
            "description": result['data'][1][0]['indicator']['value'],
            "string": "test"
            
        };

        switch (thousands) {
            case "0":
                //Less than 1000
                
                selectedCountry.inflation["string"] = result['data'][1][0]['value'];
                break;

            case "1":
                //Thousand
                selectedCountry.inflation["string"] = result['data'][1][0]['value'].toString().charAt(0) + "." + result['data'][1][0]['value'].toString().charAt(1) + result['data'][1][0]['value'].toString().charAt(2) + "K";
                break;

            case "2":
                //Million
                selectedCountry.inflation["string"] = result['data'][1][0]['value'].toString().charAt(0) + "." + result['data'][1][0]['value'].toString().charAt(1) + result['data'][1][0]['value'].toString().charAt(2) + "M";
                break;

            case "3":
                //Billion
                selectedCountry.inflation["string"] = result['data'][1][0]['value'].toString().charAt(0) + "." + result['data'][1][0]['value'].toString().charAt(1) + result['data'][1][0]['value'].toString().charAt(2) + "B";
                break;
            
            case "4":
                //Trillion
                selectedCountry.inflation["string"] = result['data'][1][0]['value'].toString().charAt(0) + "." + result['data'][1][0]['value'].toString().charAt(1) + result['data'][1][0]['value'].toString().charAt(2) + "T";
                break;

            case "5":
                selectedCountry.inflation["string"] = "5";
                break;

            case "6":
                selectedCountry.inflation["string"] = "6";
                break;
            
            case "7":
                selectedCountry.inflation["string"] = "7";
                break;

            default:
                //console.log("It didnt work");
                break;
        };
        
        

    }

},
error: function(jqXHR, textStatus, errorThrown) {

    //console.log("WorldBank Fail")

}

});

//Total Government Annual Expense (BUD)
$.ajax({
url: "php/worldbank/worldbankgovtotalexpense.php",
type: 'POST',
dataType: 'json',
data: {
    country: mycountry,
},
success: function(result) {

    //console.log("WorldBank BUD Success")

    if (result.status.name == "ok") {
        selectedCountry.budget = {
            "value": result['data'][1][0]['value'],
            "description": result['data'][1][0]['indicator']['value']
            
        };
        
        
        //$("#bud_value").html(selectedCountry.budget['value']);

    }

},
error: function(jqXHR, textStatus, errorThrown) {

    //console.log("WorldBank Failed")

}

});

//Total Government Annual Expense (BUD)
$.ajax({
url: "php/worldbank/worldbankgovtotalexpensepercent.php",
type: 'POST',
dataType: 'json',
data: {
    country: mycountry,
},
success: function(result) {

    //console.log("WorldBank BUD% Success")

    if (result.status.name == "ok") {
        if(result['data'][1][0]['value'] != 'null'){
            selectedCountry.budget.percent = result['data'][1][0]['value']
        }
        
        selectedCountry.budget.total = ((selectedCountry.budget['value'])*100)/(result['data'][1][0]['value'])

        
        $("#bud_value").html(selectedCountry.budget['total']);

    }

},
error: function(jqXHR, textStatus, errorThrown) {

    //console.log("WorldBank Fail")

}

});

//Alcohol Consumption
$.ajax({
url: "php/worldbank/worldbankalcohol.php",
type: 'POST',
dataType: 'json',
data: {
    country: mycountry,
},
success: function(result) {

    ////console.log(result);

    if (result.status.name == "ok") {

        selectedCountry.alcConsompution = {
            "value": result['data'][1][0]['value'],
            "description": result['data'][1][0]['indicator']['value']
        };
        
        

    }

},
error: function(jqXHR, textStatus, errorThrown) {

}

});
$.ajax({
url: "php/worldbank/worldbankeducation.php",
type: 'POST',
dataType: 'json',
data: {
    country: mycountry,
},
success: function(result) {

    ////console.log(result);

    if (result.status.name == "ok") {

        selectedCountry.education = {
            "value": result['data'][1][0]['value'],
            "description": result['data'][1][0]['indicator']['value']
        };

        $("#education_ph").html(selectedCountry.education['value']);

        
        

    }

},
error: function(jqXHR, textStatus, errorThrown) {

}

});
$.ajax({
url: "php/worldbank/worldbankelectricity.php",
type: 'POST',
dataType: 'json',
data: {
    country: mycountry,
},
success: function(result) {

    ////console.log(result);

    if (result.status.name == "ok") {

        selectedCountry.electricity = {
            "value": result['data'][1][0]['value'],
            "description": result['data'][1][0]['indicator']['value']
        };
        

    }

},
error: function(jqXHR, textStatus, errorThrown) {

}

});
$.ajax({
url: "php/worldbank/worldbankgovedexpense.php",
type: 'POST',
dataType: 'json',
data: {
    country: mycountry,
},
success: function(result) {

    ////console.log(result);

    if (result.status.name == "ok") {

        selectedCountry.edExpense = {
            "value": result['data'][1][0]['value'],
            "description": result['data'][1][0]['indicator']['value']
        };

        $("#govedexpense_ph").html(selectedCountry.edExpense['value']);
        

    }

},
error: function(jqXHR, textStatus, errorThrown) {

}

});
$.ajax({
url: "php/worldbank/worldbankinfantmortality.php",
type: 'POST',
dataType: 'json',
data: {
    country: mycountry,
},
success: function(result) {

    ////console.log(result);

    if (result.status.name == "ok") {

        selectedCountry.infantMortality = {
            "value": result['data'][1][0]['value'],
            "description": result['data'][1][0]['indicator']['value']
        };
        $("#infantmortality_ph").html(selectedCountry.infantMortality['value']);

    }

},
error: function(jqXHR, textStatus, errorThrown) {

}

});
$.ajax({
url: "php/worldbank/worldbankliteracy.php",
type: 'POST',
dataType: 'json',
data: {
    country: mycountry,
},
success: function(result) {

    ////console.log(result);

    if (result.status.name == "ok") {

        selectedCountry.literacy = {
            "value": result['data'][1][0]['value'],
            "description": result['data'][1][0]['indicator']['value']
        };

        $("#literacy_ph").html(selectedCountry.literacy['value']);
        

    }

},
error: function(jqXHR, textStatus, errorThrown) {

}

});
$.ajax({
url: "php/worldbank/worldbanklow10dist.php",
type: 'POST',
dataType: 'json',
data: {
    country: mycountry,
},
success: function(result) {

    ////console.log(result);

    if (result.status.name == "ok") {

        selectedCountry.worldbanklow10dist = {
            "value": result['data'][1][0]['value'],
            "description": result['data'][1][0]['indicator']['value']
        };
        

    }

},
error: function(jqXHR, textStatus, errorThrown) {

}

});
$.ajax({
url: "php/worldbank/worldbanksanitation.php",
type: 'POST',
dataType: 'json',
data: {
    country: mycountry,
},
success: function(result) {

    ////console.log(result);

    if (result.status.name == "ok") {

        selectedCountry.sanitation = {
            "value": result['data'][1][0]['value'],
            "description": result['data'][1][0]['indicator']['value']
        };
        

    }

},
error: function(jqXHR, textStatus, errorThrown) {

}

});
$.ajax({
url: "php/worldbank/worldbankslums.php",
type: 'POST',
dataType: 'json',
data: {
    country: mycountry,
},
success: function(result) {

    ////console.log(result);

    if (result.status.name == "ok") {

        selectedCountry.percentInSlums = {
            "value": result['data'][1][0]['value'],
            "description": result['data'][1][0]['indicator']['value']
        };
        

    }

},
error: function(jqXHR, textStatus, errorThrown) {

}

});
$.ajax({
url: "php/worldbank/worldbanktop10dist.php",
type: 'POST',
dataType: 'json',
data: {
    country: mycountry,
},
success: function(result) {

    ////console.log(result);

    if (result.status.name == "ok") {

        selectedCountry.worldbanktop10dist = {
            "value": result['data'][1][0]['value'],
            "description": result['data'][1][0]['indicator']['value']
        };
        

    }

},
error: function(jqXHR, textStatus, errorThrown) {

}

});
$.ajax({
url: "php/worldbank/worldbankunemployment.php",
type: 'POST',
dataType: 'json',
data: {
    country: mycountry,
},
success: function(result) {

    ////console.log(result);

    if (result.status.name == "ok") {

        selectedCountry.unemployment = {
            "value": result['data'][1][0]['value'],
            "description": result['data'][1][0]['indicator']['value']
        };
        

    }

},
error: function(jqXHR, textStatus, errorThrown) {

}

});
$.ajax({
url: "php/worldbank/worldbankwater.php",
type: 'POST',
dataType: 'json',
data: {
    country: mycountry,
},
success: function(result) { 

    ////console.log(result);

    if (result.status.name == "ok") {

        selectedCountry.water = {
            "value": result['data'][1][0]['value'],
            "description": result['data'][1][0]['indicator']['value']
        };
        

    }

},
error: function(jqXHR, textStatus, errorThrown) {

}

});

$.ajax({
url: "php/worldbank/worldbanklogisticspi.php",
type: 'POST',
dataType: 'json',
data: {
    country: mycountry,
},
success: function(result) { 

    ////console.log(result);

    if (result.status.name == "ok") {

        selectedCountry.logisticsperfindex = {
            "value": result['data'][1][0]['value'],
            "description": result['data'][1][0]['indicator']['value']
        };
        

    }

},
error: function(jqXHR, textStatus, errorThrown) {

}

});

$.ajax({
url: "php/worldbank/worldbanklifeexpectancy.php",
type: 'POST',
dataType: 'json',
data: {
    country: mycountry,
},
success: function(result) { 

    ////console.log(result);

    if (result.status.name == "ok") {

        selectedCountry.lifeexpectancy = {
            "value": result['data'][1][0]['value'].toFixed(),
            "description": result['data'][1][0]['indicator']['value']
        };

        $("#lifeexpectancy_ph").html(selectedCountry.lifeexpectancy['value']);
        

    }

},
error: function(jqXHR, textStatus, errorThrown) {

}

});

$.ajax({
url: "php/worldbank/worldbankhospitalbeds.php",
type: 'POST',
dataType: 'json',
data: {
    country: mycountry,
},
success: function(result) { 

    ////console.log(result);

    if (result.status.name == "ok") {

        selectedCountry.hospitalbeds = {
            "value": result['data'][1][0]['value'],
            "description": result['data'][1][0]['indicator']['value']
        };
        $("#hospitalbeds_ph").html(selectedCountry.hospitalbeds['value']);

    }

},
error: function(jqXHR, textStatus, errorThrown) {

}

});

$.ajax({
url: "php/worldbank/worldbanksurgicalprocedures.php",
type: 'POST',
dataType: 'json',
data: {
    country: mycountry,
},
success: function(result) { 

    ////console.log(result);

    if (result.status.name == "ok") {

        selectedCountry.surgicalprocedures = {
            "value": result['data'][1][0]['value'],
            "description": result['data'][1][0]['indicator']['value']
        };
        

    }

},
error: function(jqXHR, textStatus, errorThrown) {

}

});

$.ajax({
url: "php/worldbank/worldbankcommdeaths.php",
type: 'POST',
dataType: 'json',
data: {
    country: mycountry,
},
success: function(result) { 

    ////console.log(result);

    if (result.status.name == "ok") {

        selectedCountry.commdeaths = {
            "value": result['data'][1][0]['value'],
            "description": result['data'][1][0]['indicator']['value']
        };
        

    }

},
error: function(jqXHR, textStatus, errorThrown) {

}

});

$.ajax({
url: "php/worldbank/worldbankdeathrate.php",
type: 'POST',
dataType: 'json',
data: {
    country: mycountry,
},
success: function(result) { 

    ////console.log(result);

    if (result.status.name == "ok") {

        selectedCountry.deathrate = {
            "value": result['data'][1][0]['value'],
            "description": result['data'][1][0]['indicator']['value']
        };
        

    }

},
error: function(jqXHR, textStatus, errorThrown) {

}

});

$.ajax({
url: "php/worldbank/worldbankdiabetes.php",
type: 'POST',
dataType: 'json',
data: {
    country: mycountry,
},
success: function(result) { 

    ////console.log(result);

    if (result.status.name == "ok") {

        selectedCountry.diabetes = {
            "value": result['data'][1][0]['value'],
            "description": result['data'][1][0]['indicator']['value']
        };
        

    }

},
error: function(jqXHR, textStatus, errorThrown) {

}

});

$.ajax({
url: "php/worldbank/worldbankunderweight.php",
type: 'POST',
dataType: 'json',
data: {
    country: mycountry,
},
success: function(result) { 

    ////console.log(result);

    if (result.status.name == "ok") {

        selectedCountry.underweight = {
            "value": result['data'][1][0]['value'],
            "description": result['data'][1][0]['indicator']['value']
        };
        

    }

},
error: function(jqXHR, textStatus, errorThrown) {

}

});

$.ajax({
url: "php/worldbank/worldbankroaddeaths.php",
type: 'POST',
dataType: 'json',
data: {
    country: mycountry,
},
success: function(result) { 

    ////console.log(result);

    if (result.status.name == "ok") {

        selectedCountry.deathsroad = {
            "value": result['data'][1][0]['value'],
            "description": result['data'][1][0]['indicator']['value']
        };
        

    }

},
error: function(jqXHR, textStatus, errorThrown) {

}

});

$.ajax({
url: "php/worldbank/worldbankhiv.php",
type: 'POST',
dataType: 'json',
data: {
    country: mycountry,
},
success: function(result) { 

    ////console.log(result);

    if (result.status.name == "ok") {

        selectedCountry.hiv = {
            "value": result['data'][1][0]['value'],
            "description": result['data'][1][0]['indicator']['value']
        };
        

    }

},
error: function(jqXHR, textStatus, errorThrown) {

}

});

$.ajax({
url: "php/worldbank/worldbankunderoverweight.php",
type: 'POST',
dataType: 'json',
data: {
    country: mycountry,
},
success: function(result) { 

    ////console.log(result);

    if (result.status.name == "ok") {

        selectedCountry.overweight = {
            "value": result['data'][1][0]['value'],
            "description": result['data'][1][0]['indicator']['value']
        };
        

    }

},
error: function(jqXHR, textStatus, errorThrown) {

}

});

$.ajax({
url: "php/worldbank/worldbankundernourishment.php",
type: 'POST',
dataType: 'json',
data: {
    country: mycountry,
},
success: function(result) { 

    ////console.log(result);

    if (result.status.name == "ok") {

        selectedCountry.undernourishment = {
            "value": result['data'][1][0]['value'],
            "description": result['data'][1][0]['indicator']['value']
        };
        

    }

},
error: function(jqXHR, textStatus, errorThrown) {

}

});

$.ajax({
url: "php/worldbank/worldbankcontraception.php",
type: 'POST',
dataType: 'json',
data: {
    country: mycountry,
},
success: function(result) { 

    ////console.log(result);

    if (result.status.name == "ok") {

        selectedCountry.contraception = {
            "value": result['data'][1][0]['value'],
            "description": result['data'][1][0]['indicator']['value']
        };
        

    }

},
error: function(jqXHR, textStatus, errorThrown) {

}

});

$.ajax({
url: "php/worldbank/worldbankprenatal.php",
type: 'POST',
dataType: 'json',
data: {
    country: mycountry,
},
success: function(result) { 

    ////console.log(result);

    if (result.status.name == "ok") {

        selectedCountry.prenatal = {
            "value": result['data'][1][0]['value'],
            "description": result['data'][1][0]['indicator']['value']
        };
        

    }

},
error: function(jqXHR, textStatus, errorThrown) {

}

});

$.ajax({
url: "php/worldbank/worldbanktotalpowerconsumption.php",
type: 'POST',
dataType: 'json',
data: {
    country: mycountry,
},
success: function(result) { 

    ////console.log(result);

    if (result.status.name == "ok") {

        selectedCountry.totalpowerconsumption = {
            "value": result['data'][1][0]['value'],
            "description": result['data'][1][0]['indicator']['value']
        };
        

    }

},
error: function(jqXHR, textStatus, errorThrown) {

}

});

$.ajax({
url: "php/worldbank/worldbankrenewableelectricoutput.php",
type: 'POST',
dataType: 'json',
data: {
    country: mycountry,
},
success: function(result) { 

    ////console.log(result);

    if (result.status.name == "ok") {

        selectedCountry.renewableelectricoutput = {
            "value": result['data'][1][0]['value'],
            "description": result['data'][1][0]['indicator']['value']
        };
        

    }

},
error: function(jqXHR, textStatus, errorThrown) {

}

});

$.ajax({
url: "php/worldbank/worldbankelectricoilgascoal.php",
type: 'POST',
dataType: 'json',
data: {
    country: mycountry,
},
success: function(result) { 

    ////console.log(result);

    if (result.status.name == "ok") {

        selectedCountry.oilgascoal = {
            "value": result['data'][1][0]['value'],
            "description": result['data'][1][0]['indicator']['value']
        };
        

    }

},
error: function(jqXHR, textStatus, errorThrown) {

}

});

$.ajax({
url: "php/worldbank/worldbankdeathspollution.php",
type: 'POST',
dataType: 'json',
data: {
    country: mycountry,
},
success: function(result) { 

    ////console.log(result);

    if (result.status.name == "ok") {

        selectedCountry.deathspollution = {
            "value": result['data'][1][0]['value'],
            "description": result['data'][1][0]['indicator']['value']
        };
        

    }

},
error: function(jqXHR, textStatus, errorThrown) {

}

});

$.ajax({
url: "php/worldbank/worldbankendangeredbirds.php",
type: 'POST',
dataType: 'json',
data: {
    country: mycountry,
},
success: function(result) { 

    ////console.log(result);

    if (result.status.name == "ok") {

        selectedCountry.endangeredbirds = {
            "value": result['data'][1][0]['value'],
            "description": result['data'][1][0]['indicator']['value']
        };
        

    }

},
error: function(jqXHR, textStatus, errorThrown) {

}

});

$.ajax({
url: "php/worldbank/worldbankendangeredfish.php",
type: 'POST',
dataType: 'json',
data: {
    country: mycountry,
},
success: function(result) { 

    ////console.log(result);

    if (result.status.name == "ok") {

        selectedCountry.endangeredfish = {
            "value": result['data'][1][0]['value'],
            "description": result['data'][1][0]['indicator']['value']
        };
        

    }

},
error: function(jqXHR, textStatus, errorThrown) {

}

});

$.ajax({
url: "php/worldbank/worldbankendangeredmammal.php",
type: 'POST',
dataType: 'json',
data: {
    country: mycountry,
},
success: function(result) { 

    ////console.log(result);

    if (result.status.name == "ok") {

        selectedCountry.endangeredmammal = {
            "value": result['data'][1][0]['value'],
            "description": result['data'][1][0]['indicator']['value']
        };
        

    }

},
error: function(jqXHR, textStatus, errorThrown) {

}

});

$.ajax({
url: "php/worldbank/worldbankendangeredplant.php",
type: 'POST',
dataType: 'json',
data: {
    country: mycountry,
},
success: function(result) { 

    ////console.log(result);

    if (result.status.name == "ok") {

        selectedCountry.endangeredplant = {
            "value": result['data'][1][0]['value'],
            "description": result['data'][1][0]['indicator']['value']
        };
        

    }

},
error: function(jqXHR, textStatus, errorThrown) {

}

});

$.ajax({
url: "php/worldbank/worldbankco2.php",
type: 'POST',
dataType: 'json',
data: {
    country: selectedCountry.iso3,
},
success: function(result) { 

    //BUG: NOT RETURNING AS "OK"

    if (result.status.co2ouput == "ok") {

        //console.log("co2 worked!");

        selectedCountry.co2ouput = {
            "value": result['data'][1][0]['value'],
            "description": result['data'][1][0]['indicator']['value']
        };

        $("#co2output_ph").html(selectedCountry.co2ouput['value']);
        

    }

},
error: function(jqXHR, textStatus, errorThrown) {

}

});

$.ajax({
url: "php/worldbank/worldbankairpollution.php",
type: 'POST',
dataType: 'json',
data: {
    country: mycountry,
},
success: function(result) { 

    ////console.log(result);

    if (result.status.name == "ok") {

        selectedCountry.airpollution = {
            "value": result['data'][1][0]['value'],
            "description": result['data'][1][0]['indicator']['value']
        };

        $("#airpollution_ph").html(selectedCountry.airpollution['value']);
        

    }

},
error: function(jqXHR, textStatus, errorThrown) {

}

});

$.ajax({
url: "php/worldbank/worldbankelectricityfromrenewables.php",
type: 'POST',
dataType: 'json',
data: {
    country: mycountry,
},
success: function(result) { 

    ////console.log(result);

    if (result.status.name == "ok") {

        selectedCountry.electricityfromrenewables = {
            "value": result['data'][1][0]['value'],
            "description": result['data'][1][0]['indicator']['value']
        };

        $("#energyfromrenewables_ph").html(selectedCountry.electricityfromrenewables['value']);
        

    }

},
error: function(jqXHR, textStatus, errorThrown) {

}

});

$.ajax({
url: "php/worldbank/worldbankgovedexpensesecondary.php",
type: 'POST',
dataType: 'json',
data: {
    country: mycountry,
},
success: function(result) { 

    ////console.log(result);

    if (result.status.name == "ok") {

        selectedCountry.govedexpensesecondary = {
            "value": result['data'][1][0]['value'],
            "description": result['data'][1][0]['indicator']['value']
        };
        

    }

},
error: function(jqXHR, textStatus, errorThrown) {

}

});

$.ajax({
url: "php/worldbank/worldbankgovedexpensetertiary.php",
type: 'POST',
dataType: 'json',
data: {
    country: mycountry,
},
success: function(result) { 

    ////console.log(result);

    if (result.status.name == "ok") {

        selectedCountry.govedexpensetertiary = {
            "value": result['data'][1][0]['value'],
            "description": result['data'][1][0]['indicator']['value']
        };
        

    }

},
error: function(jqXHR, textStatus, errorThrown) {

}

});

$.ajax({
url: "php/worldbank/worldbankprimaryedcompletion.php",
type: 'POST',
dataType: 'json',
data: {
    country: mycountry,
},
success: function(result) { 

    ////console.log(result);

    if (result.status.name == "ok") {

        selectedCountry.primaryedcompletion = {
            "value": result['data'][1][0]['value'],
            "description": result['data'][1][0]['indicator']['value']
        };
        

    }

},
error: function(jqXHR, textStatus, errorThrown) {

}

});

$.ajax({
url: "php/worldbank/worldbankprimaryteacherpupilratio.php",
type: 'POST',
dataType: 'json',
data: {
    country: mycountry,
},
success: function(result) { 

    ////console.log(result);

    if (result.status.name == "ok") {

        selectedCountry.primaryteacherpupilratio = {
            "value": result['data'][1][0]['value'],
            "description": result['data'][1][0]['indicator']['value']
        };
        

    }

},
error: function(jqXHR, textStatus, errorThrown) {

}

});

$.ajax({
url: "php/worldbank/worldbankenrollmentpreprimary.php",
type: 'POST',
dataType: 'json',
data: {
    country: mycountry,
},
success: function(result) { 

    ////console.log(result);

    if (result.status.name == "ok") {

        selectedCountry.enrollmentpreprimary = {
            "value": result['data'][1][0]['value'],
            "description": result['data'][1][0]['indicator']['value']
        };
        

    }

},
error: function(jqXHR, textStatus, errorThrown) {

}

});

$.ajax({
url: "php/worldbank/worldbankenrollmentprimary.php",
type: 'POST',
dataType: 'json',
data: {
    country: mycountry,
},
success: function(result) { 

    ////console.log(result);

    if (result.status.name == "ok") {

        selectedCountry.enrollmentprimary = {
            "value": result['data'][1][0]['value'],
            "description": result['data'][1][0]['indicator']['value']
        };
        

    }

},
error: function(jqXHR, textStatus, errorThrown) {

}

});

$.ajax({
url: "php/worldbank/worldbankenrollmentsecondary.php",
type: 'POST',
dataType: 'json',
data: {
    country: mycountry,
},
success: function(result) { 

    ////console.log(result);

    if (result.status.name == "ok") {

        selectedCountry.enrollmentsecondary = {
            "value": result['data'][1][0]['value'],
            "description": result['data'][1][0]['indicator']['value']
        };
        

    }

},
error: function(jqXHR, textStatus, errorThrown) {

}

});

$.ajax({
url: "php/worldbank/worldbankenrollmenttertiary.php",
type: 'POST',
dataType: 'json',
data: {
    country: mycountry,
},
success: function(result) { 

    ////console.log(result);

    if (result.status.name == "ok") {

        selectedCountry.enrollmenttertiary = {
            "value": result['data'][1][0]['value'],
            "description": result['data'][1][0]['indicator']['value']
        };
        

    }

},
error: function(jqXHR, textStatus, errorThrown) {

}

});

$.ajax({
url: "php/worldbank/worldbanktrainedteachersprimary.php",
type: 'POST',
dataType: 'json',
data: {
    country: mycountry,
},
success: function(result) { 

    ////console.log(result);

    if (result.status.name == "ok") {

        selectedCountry.trainedteachersprimary = {
            "value": result['data'][1][0]['value'],
            "description": result['data'][1][0]['indicator']['value']
        };
        

    }

},
error: function(jqXHR, textStatus, errorThrown) {

}

});

$.ajax({
url: "php/worldbank/worldbankarrivals.php",
type: 'POST',
dataType: 'json',
data: {
    country: mycountry,
},
success: function(result) { 

    ////console.log(result);

    if (result.status.name == "ok") {

        selectedCountry.arrivals = {
            "value": result['data'][1][0]['value'],
            "description": result['data'][1][0]['indicator']['value']
        };
        $("#arrivals_ph").html(selectedCountry.arrivals['value']);

    }

},
error: function(jqXHR, textStatus, errorThrown) {

}

});

$.ajax({
url: "php/worldbank/worldbankdepartures.php",
type: 'POST',
dataType: 'json',
data: {
    country: mycountry,
},
success: function(result) { 

    ////console.log(result);

    if (result.status.name == "ok") {

        selectedCountry.departures = {
            "value": result['data'][1][0]['value'],
            "description": result['data'][1][0]['indicator']['value']
        };

        $("#departures_ph").html(selectedCountry.departures['value']);
        

    }

},
error: function(jqXHR, textStatus, errorThrown) {

}

});

$.ajax({
url: "php/worldbank/worldbanktourismincome.php",
type: 'POST',
dataType: 'json',
data: {
    country: mycountry,
},
success: function(result) { 

    ////console.log(result);

    if (result.status.name == "ok") {

        selectedCountry.tourismincome = {
            "value": result['data'][1][0]['value'],
            "description": result['data'][1][0]['indicator']['value']
        };

        $("#tourismincome_ph").html(selectedCountry.tourismincome['value']);
        

    }

},
error: function(jqXHR, textStatus, errorThrown) {

}

});