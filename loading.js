// Loading.js
// Description: Intermediate page where data is collected from API calls based on what country the user has chosen. 
// This page also includes a loading bar so that the user can see visible progress, as data collection can take a few seconds.


// Varibles-------------------------------------------------------------------||
    //Loading Progress Bar (62 requests)
        var percentLoaded = 0;
        var ajaxCount = 0;
        var ajaxSuccess = 0;
    
    //Selected Country
        var selectedCountry = {
            "name": JSON.parse(localStorage.selectedCountry).name, 
            "iso_a2": JSON.parse(localStorage.selectedCountry).iso_a2, 
            "iso_a3": JSON.parse(localStorage.selectedCountry).iso_a3, 
            "geometry": JSON.parse(localStorage.selectedCountry).geometry, 
            "flag": "", 
            "wtocode": localStorage.getItem('wtocode'),
        };
   
        var mycountry = JSON.parse(localStorage.selectedCountry).iso_a2;
        var mycountry3 = JSON.parse(localStorage.selectedCountry).iso_a3;
        var mycountryname = encodeURIComponent((JSON.parse(localStorage.selectedCountry).name).toString().toLowerCase());

    //Dates for lookups
        var date = new Date();
        var sevendaysago = new Date();
        sevendaysago.setDate(date.getDate() - 7);
        date = date.toLocaleDateString();
        dateminus = date.split("/").reverse().join("-");
        date = date.split("/").reverse().join("/");
        sevendaysago = sevendaysago.toLocaleDateString();
        sevendaysagominus = sevendaysago.split("/").reverse().join("-");
        sevendaysago = sevendaysago.split("/").reverse().join("/");
        var capitalLatLng = localStorage.getItem("capitalLocation").split(",");
        localStorage.setItem("capitalLat", localStorage.getItem("capitalLocation").split(",")[0]);
        localStorage.setItem("capitalLong", localStorage.getItem("capitalLocation").split(",")[1]);


// Browser-------------------------------------------------------------------||
    //URL Rewrite to remove /***.html
        window.history.replaceState('','','/');


// AJAX Listeners ---------------------------------------------------------------------||

    //When all AJAX calls have completed
        $(document).ajaxStop(function() {    
                localStorage.setItem('todaysDate', date);
                localStorage.setItem('todaysDateMinus', dateminus);
                localStorage.setItem('sevendaysago', sevendaysago);
                localStorage.setItem('sevendaysagominus', sevendaysagominus);
                localStorage.setItem('selectedCountry', JSON.stringify(selectedCountry));
                localStorage.setItem('ajaxTotal', ajaxCount);
                localStorage.setItem('ajaxSuccess', ajaxSuccess);
                localStorage.setItem('ProgressValue',  $('#intProgress').html());
                window.location.replace("screen2.html");
                
            });


// Functions-------------------------------------------------------------------||        

    //Update progress bar    
        $('body').on('DOMSubtreeModified', '#intProgress', function(){
            var percentLoadedPercent = (percentLoaded+10).toString() + "%";
            $('.progress-bar').css("width", percentLoadedPercent);
        });

    //Replace accents and special chracters in Strings
        const replaceAccents = (str) => {
            return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
                .replace(/([^\w]+|\s+)/g, '-')
                .replace(/\-\-+/g, '-')	
                .replace(/(^-+|-+$)/, '');
        }




// API Calls -------------------------------------------------------------------||

    // Geonames API - http://www.geonames.org/
    // This API is given the selected countries name. The API then continent data and size
        $.ajax({
            url: "php/general/geonames.php",
            type: 'POST',
            dataType: 'json',
            data: {
                country: mycountry,
            },

            success: function(result) {
                ajaxCount++;
                ajaxSuccess++
                $('#intProgress').text((ajaxSuccess/62)*100);
                percentLoaded = (ajaxSuccess/62)*100;

                
                if (result.status.name == "ok") {

                    selectedCountry.continent = result['data'][0]['continentName']; 
                    selectedCountry.area = result['data'][0]['areaInSqKm']; 
 
                }
            
            },

            error: function(jqXHR, textStatus, errorThrown) {
                ajaxCount++;
                console.log("Geonames API Failed")

            }
            
        });




    // RestCountries API - https://restcountries.com/
    // This API is given the selected countries name. The API then returns general data for that country
        $.ajax({
            url: "php/general/restcountries.php",
            type: 'POST',
            dataType: 'json',
            data: {
                country: mycountry,
            },

            success: function(result) {
                ajaxCount++;
                ajaxSuccess++
                $('#intProgress').text((ajaxSuccess/62)*100);
                percentLoaded = (ajaxSuccess/62)*100;

        

                if (result.status.name == "ok") {
                
                    
                    selectedCountry.capital = replaceAccents(result['data'][0]['capital'][0]);
                    selectedCountry.region = result['data'][0]['region'];
                    selectedCountry.population = result['data'][0]['population'];
                    selectedCountry.flag = result['data'][0].flags['png'];
                    selectedCountry.currency = result['data'][0]['currencies'];
                    selectedCountry.currencycode = [[result['data'][0]['currencies']].flat()][0][0];
                    
                   
                    //TODO: Use selectCountry instead
                    localStorage.setItem("capitalLocationLat", result['data'][0]['capitalInfo']['latlng'][0]);
                    localStorage.setItem("capitalLocationLong", result['data'][0]['capitalInfo']['latlng'][1]);
                    

        for (const [key, value] of Object.entries(selectedCountry.currency)) {
            
            return [selectedCountry.currencyabbrev = Object.getOwnPropertyNames(result['data'][0]['currencies'])[0], selectedCountry.currencycode = value['symbol'] , selectedCountry.currencyname = value['name']]
        };
                    //TODO: THESE ARE NOT BEING ADDED
                    selectedCountry.currencies = result['data'][0]['currencies'];
                    selectedCountry.language = result['data'][0]['languages'];
                    
                    selectedCountry.timezones = result['data'][0]['timezones'];
                    selectedCountry.location = result['data'][0]['latlng'];
                    


                }
            
            },
            error: function(jqXHR, textStatus, errorThrown) {
                ajaxCount++;
                console.log("RestCountries API Failed")
                

            }
            
        });





// Weather API - https://www.weatherapi.com/docs/
// This API is given the selected countries name. The API then returns weather data from the capital of that country.

$.ajax({
    url: "php/climate/weather.php",
    type: 'POST',
    dataType: 'json',
    data: {
        country: mycountryname,
    },
    success: function(result) {
        
        //Progress Indicator Update
        ajaxCount++;
        ajaxSuccess++
        $('#intProgress').text((ajaxSuccess/62)*100);
        percentLoaded = (ajaxSuccess/62)*100;

        //Returned Data
        if (result.status.name == "ok") {

            selectedCountry.weather = {};

            //Forecast for Today
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

            
            
            //Weather Icons
            switch(selectedCountry.weather.description) {
                
                case "Sunny":
                  selectedCountry.weather.icon = "https://api.met.no/images/weathericons/svg/clearsky_day.svg"
                  break;
                case "Partly cloudy":
                  selectedCountry.weather.icon = "https://api.met.no/images/weathericons/svg/fair_day.svg"
                  break;
                case "Cloudy":
                    selectedCountry.weather.icon = "https://api.met.no/images/weathericons/svg/cloudy.svg"
                  break;
                case "Overcast":
                    selectedCountry.weather.icon = "https://api.met.no/images/weathericons/svg/partlycloudy_day.svg"
                  break;
                case "Mist":
                    selectedCountry.weather.icon = "https://api.met.no/images/weathericons/svg/fog.svg"
                  break;
                case "Patchy rain possible":
                    selectedCountry.weather.icon = "https://api.met.no/images/weathericons/svg/lightrain.svg"
                  break;
                case "Patchy snow possible":
                    selectedCountry.weather.icon = "https://api.met.no/images/weathericons/svg/lightsnow.svg"
                  break;
                case "Patchy sleet possible":
                    selectedCountry.weather.icon = "https://api.met.no/images/weathericons/svg/sleet.svg"
                  break;
                case "Patchy freezing drizzle possible":
                    selectedCountry.weather.icon = "https://api.met.no/images/weathericons/svg/lightsleet.svg"
                  break;
                case "Thundery outbreaks possible":
                    selectedCountry.weather.icon = "https://api.met.no/images/weathericons/svg/lightrainshowersandthunder_day.svg"
                  break;
                case "Blowing snow":
                    selectedCountry.weather.icon = "https://api.met.no/images/weathericons/svg/snow.svg"
                  break;
                case "Blizzard":
                    selectedCountry.weather.icon = "https://api.met.no/images/weathericons/svg/snow.svg"
                  break;
                case "Fog":
                    selectedCountry.weather.icon = "https://api.met.no/images/weathericons/svg/fog.svg"
                  break;
                case "Freezing fog":
                    selectedCountry.weather.icon = "https://api.met.no/images/weathericons/svg/snow.svg"
                  break;
                case "Patchy light drizzle":
                    selectedCountry.weather.icon = "https://api.met.no/images/weathericons/svg/lightrain.svg"
                  break;
                case "Light drizzle":
                    selectedCountry.weather.icon = "https://api.met.no/images/weathericons/svg/lightrain.svg"
                  break;
                case "Freezing drizzle":
                    selectedCountry.weather.icon = "https://api.met.no/images/weathericons/svg/lightsnow.svg"
                  break;
                case "Heavy freezing drizzle":
                    selectedCountry.weather.icon = "https://api.met.no/images/weathericons/svg/lightsnow.svg"
                  break;
                case "Patchy light rain":
                    selectedCountry.weather.icon = "https://api.met.no/images/weathericons/svg/lightrain.svg"
                  break;
                case "Light Rain":
                    selectedCountry.weather.icon = "https://api.met.no/images/weathericons/svg/lightrain.svg"
                  break;
                case "Moderate rain at times":
                    selectedCountry.weather.icon = "https://api.met.no/images/weathericons/svg/rain.svg"
                  break;
                case "Moderate rain":
                    selectedCountry.weather.icon = "https://api.met.no/images/weathericons/svg/rain.svg"
                  break;
                case "Heavy rain at times":
                    selectedCountry.weather.icon = "https://api.met.no/images/weathericons/svg/rain.svg"
                  break;
                case "Heavy rain":
                    selectedCountry.weather.icon = "https://api.met.no/images/weathericons/svg/rain.svg"
                  break;
                case "Light freezing rain":
                    selectedCountry.weather.icon = "https://api.met.no/images/weathericons/svg/sleet.svg"
                  break;
                case "Moderate or heavy freezing rain":
                    selectedCountry.weather.icon = "https://api.met.no/images/weathericons/svg/sleet.svg"
                  break;
                case "Light sleet":
                    selectedCountry.weather.icon = "https://api.met.no/images/weathericons/svg/lightsnow.svg"
                  break;
                case "Moderate or heavy sleet":
                    selectedCountry.weather.icon = "https://api.met.no/images/weathericons/svg/sleet.svg"
                  break;
                case "Patchy light snow":
                    selectedCountry.weather.icon = "https://api.met.no/images/weathericons/svg/lightsnow.svg"
                  break;
                case "Light snow":
                    selectedCountry.weather.icon = "https://api.met.no/images/weathericons/svg/lightsnow.svg"
                  break;
                case "Patchy moderate snow":
                    selectedCountry.weather.icon = "https://api.met.no/images/weathericons/svg/snow.svg"
                  break;
                case "Moderate snow":
                    selectedCountry.weather.icon = "https://api.met.no/images/weathericons/svg/snow.svg"
                  break;
                case "Patchy heavy snow":
                    selectedCountry.weather.icon = "https://api.met.no/images/weathericons/svg/snow.svg"
                  break;
                case "Heavy snow":
                    selectedCountry.weather.icon = "https://api.met.no/images/weathericons/svg/snow.svg"
                  break;
                case "Ice pellets":
                    selectedCountry.weather.icon = "https://api.met.no/images/weathericons/svg/snow.svg"
                  break;
                case "Light rain shower":
                    selectedCountry.weather.icon = "https://api.met.no/images/weathericons/svg/lightrain.svg"
                  break;
                case "Moderate or heavy rain shower":
                    selectedCountry.weather.icon = "https://api.met.no/images/weathericons/svg/rain.svg"
                  break;
                case "Torrential rain shower":
                    selectedCountry.weather.icon = "https://api.met.no/images/weathericons/svg/heavyrain.svg"
                  break;
                case "Light sleet showers":
                    selectedCountry.weather.icon = "https://api.met.no/images/weathericons/svg/sleet.svg"
                  break;
                case "Moderate or heavy sleet showers":
                    selectedCountry.weather.icon = "https://api.met.no/images/weathericons/svg/sleet.svg"
                  break;
                case "Light snow showers":
                    selectedCountry.weather.icon = "https://api.met.no/images/weathericons/svg/lightsnow.svg"
                  break;
                case "Moderate or heavy snow showers":
                    selectedCountry.weather.icon = "https://api.met.no/images/weathericons/svg/snowshowers_day.svg"
                  break;
                case "Light showers of ice pellets":
                    selectedCountry.weather.icon = "https://api.met.no/images/weathericons/svg/sleet.svg"
                  break;
                case "Moderate or heavy showers of ice pellets":
                    selectedCountry.weather.icon = "https://api.met.no/images/weathericons/svg/sleet.svg"
                  break;
                case "Patchy light rain with thunder":
                    selectedCountry.weather.icon = "https://api.met.no/images/weathericons/svg/rainandthunder.svg"
                  break;
                case "Moderate or heavy rain with thunder":
                    selectedCountry.weather.icon = "https://api.met.no/images/weathericons/svg/rainandthunder.svg"
                  break;
                case "Patchy light snow with thunder":
                    selectedCountry.weather.icon = "https://api.met.no/images/weathericons/svg/snowandthunder.svg"
                  break;
                case "Moderate or heavy snow with thunder":
                    selectedCountry.weather.icon = "https://api.met.no/images/weathericons/svg/snowandthunder.svg"
                  break;
                case "Clear":
                    selectedCountry.weather.icon = "https://api.met.no/images/weathericons/svg/clearsky_day.svg"
                  break;
                default:
                  selectedCountry.weather.icon = "https://api.met.no/images/weathericons/svg/clearsky_day.svg"

              }




        }
    
    },
    error: function(jqXHR, textStatus, errorThrown) {
        ajaxCount++;
        console.log("Weather API Failed")
    }
    
});

//WikiAPI
//https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&titles=Chile
//https://en.wikipedia.org/w/api.php?action=parse&page=Chile&prop=wikitext&formatversion=2&format=json

$.ajax({
    url: "php/general/dictionary.php",
    type: 'POST',
    dataType: 'json',
    data: {
        country: mycountryname,
    },
    success: function(result) {
ajaxCount++;
ajaxSuccess++
$('#intProgress').text((ajaxSuccess/62)*100);
percentLoaded = (ajaxSuccess/62)*100;


        if (result.status.name == "ok") {

            var rawWikiData = result['data'];
           
            selectedCountry.description = Object.entries(rawWikiData)[0][1]['extract'].split('.')[0] + ".";
            selectedCountry.descriptionfull = Object.entries(rawWikiData)[0][1]['extract'].split("\n");
     
            
            
            
    }
},
    error: function(jqXHR, textStatus, errorThrown) {
ajaxCount++;
        console.log("Dictionary API Failed")
    }
    
});

//POI
//https://maps.googleapis.com

$.ajax({
    url: "php/culture/poi_googlemaps.php",
    type: 'GET',
    dataType: 'json',
    data: {
        iso2: mycountry,
    },
    success: function(result) {
ajaxCount++;
ajaxSuccess++
$('#intProgress').text((ajaxSuccess/62)*100);
percentLoaded = (ajaxSuccess/62)*100;


        if (result.status.name == "ok") {

            selectedCountry.pois = result['data'];

 
            
    }
},
    error: function(jqXHR, textStatus, errorThrown) {
        ajaxCount++;
        console.log("Google Places API Failed")

    }
    
}); 





//Airports & Flights API

//Airport API

$.ajax({
    url: "php/flights/airports-fileget.php",
    type: 'POST',
    dataType: 'json',
    data: {
        country: selectedCountry.iso_a2,
    },
    success: function(result) {
ajaxCount++;
ajaxSuccess++
$('#intProgress').text((ajaxSuccess/62)*100);
percentLoaded = (ajaxSuccess/62)*100;
        selectedCountry.airports = [];
        selectedCountry.airport = [];

     

        if (result.status.name == "ok") {

            result['data'].forEach(element => {
                
            if(element.Country == selectedCountry.name){
                selectedCountry.airports.push(element);
                //console.log(element);

                
            }
            if(element.City == selectedCountry.capital){
            
                selectedCountry.airport.push(element);
                console.log(element);
            }
            });

            //Flights API
            //TODO: MAKE ORIGIN COUNTRY DYNAMIC

            $.ajax({

                url: "php/flights/flights.php",
                type: 'POST',
                dataType: 'json',
                data: {
                    origin: 'LON',
                    destination: selectedCountry.airport[0]['IATA/FAA'],
                    },
                success: function(result) {
                    ajaxCount++;
                    ajaxSuccess++
                    $('#intProgress').text((ajaxSuccess/62)*100);
                    percentLoaded = (ajaxSuccess/62)*100;
                    selectedCountry.flights = [];

                    if (result) {

                    var sortedResult = result.sort((a,b) => (a.depart_date > b.depart_date) ? 1 : ((b.depart_date > a.depart_date) ? -1 : 0))
                    selectedCountry.flights = sortedResult;
        
  
                    }
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        ajaxCount++;
                        console.log("Flights API Failed")
                    }

                    }); 
            
            
    }
},
    error: function(jqXHR, textStatus, errorThrown) {
        ajaxCount++;
        console.log("Airport API Failed")
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
            ajaxCount++;
            ajaxSuccess++
            $('#intProgress').text((ajaxSuccess/62)*100);
            percentLoaded = (ajaxSuccess/62)*100;

        

            if (result.status.name == "ok") {

                if(typeof selectedCountry.currencycode != 'undefined'){
                    selectedCountry.exchangerate = result['data']['rates'][selectedCountry.currencyabbrev];
                    
                }
                
                selectedCountry.othercurrencies = result['data']['rates'];

                for (const [key, value] of Object.entries(selectedCountry.othercurrencies)) {

                    selectedCountry.othercurrencies[key] = selectedCountry.exchangerate/value;
                    

                };
                //TODO: Is this needed?
                $('#currency').html(selectedCountry.currency);
                $('#exchangeratevalue').html(selectedCountry.exchangerate);
                
                
        }
    },
        error: function(jqXHR, textStatus, errorThrown) {
    ajaxCount++;
            console.log("Exchange Rate API Failed")

        }
        
    });



//Imports WTO
//https://apiportal.wto.org/query-builder
    
    var params = {
        
        "i": "ITS_MTV_AM",
        "r": selectedCountry.wtocode,
        "fmt": "json",
        "mode": "full",
        "lang": "1",
        "meta": "true",
    };
  
    $.ajax({
        url: "https://api.wto.org/timeseries/v1/data?" + $.param(params),
        beforeSend: function(xhrObj){
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key","71e13c8a8030440e814fe17043f74a47");
        },
        type: "GET",
        data: "{body}",
    })
    .done(function(data) {
        var parsedData = (JSON.parse(data))['Dataset'];
        var sortedResult = parsedData.sort((a,b) => (a.Year < b.Year) ? 1 : ((b.Year < a.Year) ? -1 : 0))
        selectedCountry.imports = sortedResult;
    })
    .fail(function() {
        console.log("Imports Data Error");
    });



//Exports WTO
//https://apiportal.wto.org/query-builder

    
    var params = {
        "i": "ITS_MTV_AX",
        "r": selectedCountry.wtocode,
        "fmt": "json",
        "mode": "full",
        "lang": "1",
        "meta": "true",
    };
  
    $.ajax({
        url: "https://api.wto.org/timeseries/v1/data?" + $.param(params),
        beforeSend: function(xhrObj){
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key","71e13c8a8030440e814fe17043f74a47");
        },
        type: "GET",
        data: "{body}",
    })
    .done(function(data) {
        var parsedData = (JSON.parse(data)['Dataset']);
        var sortedResult = parsedData.sort((a,b) => (a.Year < b.Year) ? 1 : ((b.Year < a.Year) ? -1 : 0))
        selectedCountry.exports = sortedResult;

    })
    .fail(function() {
        console.log("Exports Data Error");
    });



//NewsAPI
    $.ajax({
        url: "php/events/news.php",
        type: 'POST',
        dataType: 'json',
        data: {
            country: mycountryname,
        },
        success: function(result) {
            ajaxCount++;
            ajaxSuccess++
            $('#intProgress').text((ajaxSuccess/62)*100);
            percentLoaded = (ajaxSuccess/62)*100;


            if (result.status.name == "ok") {
                
                var thenews = result['data']['response']['results'];
                var sortedNews = {};
                thenews.forEach(article => {
                    sortedNews[article.webPublicationDate.split("T")[0]] = {};
                    sortedNews[article.webPublicationDate.split("T")[0]][article.webTitle] = article;
                    sortedNews[article.webPublicationDate.split("T")[0]][article.webTitle]['textBody'] = (article.blocks.body[0].bodyTextSummary).split(" ").slice(0, 65).join(" ") + "...";
                    sortedNews[article.webPublicationDate.split("T")[0]][article.webTitle]['shortDate'] = article.webPublicationDate.split("T")[0];
                    
                });
                sortedNews = Object.keys(sortedNews).sort((a,b) => (a < b) ? 1 : ((b < a) ? -1 : 0)).reduce(
                    (obj, key) => { 
                    obj[key] = sortedNews[key]; 
                    return obj;
                    }, 
                    {}
                );
            
                localStorage.setItem('sortedNews', JSON.stringify(sortedNews));
                selectedCountry.news = JSON.parse(localStorage.getItem('sortedNews'));

                }

                
    },
        error: function(jqXHR, textStatus, errorThrown) {
    ajaxCount++;

            console.log("News API Failed")

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
    ajaxCount++;
    ajaxSuccess++
    $('#intProgress').text((ajaxSuccess/62)*100);
    percentLoaded = (ajaxSuccess/62)*100;



    

    if (result.status.name == "ok") {
        try {
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
       
       
        
        


    } catch (error) {
            console.log('\n', "WorldBank (GDP) Data was returned, but subsequent data cleaning failed", '\n',"[PROPERTIES]", '\n',"mycountry: ", mycountry, '\n', '\n', "[RETURNED DATA] ", '\n', result['data']);
            console.log("\n");
            
        }
       
        
        


    }

},
error: function(jqXHR, textStatus, errorThrown) {
ajaxCount++;

    console.log("WorldBank (GDP) Request Failed")

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
ajaxCount++;
ajaxSuccess++
$('#intProgress').text((ajaxSuccess/62)*100);
percentLoaded = (ajaxSuccess/62)*100;

    //console.log("WorldBank INF Success")

    if (result.status.name == "ok") {
try {
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
        
        

    } catch (error) {
            console.log('\n', "WorldBank (GDP) Data was returned, but subsequent data cleaning failed", '\n',"[PROPERTIES]", '\n',"mycountry: ", mycountry, '\n', '\n', "[RETURNED DATA] ", '\n', result['data']);
            console.log("\n");
            
        }
       
        
        


    }

},
error: function(jqXHR, textStatus, errorThrown) {
ajaxCount++;

    console.log("WorldBank (Inflation) Request Failed")

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
ajaxCount++;
ajaxSuccess++
$('#intProgress').text((ajaxSuccess/62)*100);
percentLoaded = (ajaxSuccess/62)*100;

    //console.log("WorldBank BUD Success")

    if (result.status.name == "ok") {
try {
        selectedCountry.budget = {
            "value": result['data'][1][0]['value'],
            "description": result['data'][1][0]['indicator']['value']
            
        };
        
        
        //$("#bud_value").html(selectedCountry.budget['value']);

    } catch (error) {
            console.log('\n', "WorldBank (GDP) Data was returned, but subsequent data cleaning failed", '\n',"[PROPERTIES]", '\n',"mycountry: ", mycountry, '\n', '\n', "[RETURNED DATA] ", '\n', result['data']);
            console.log("\n");
            
        }
       
        
        


    }

},
error: function(jqXHR, textStatus, errorThrown) {
ajaxCount++;

    console.log("WorldBank (Gov Total Expense) Request Failed")

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
ajaxCount++;
ajaxSuccess++
$('#intProgress').text((ajaxSuccess/62)*100);
percentLoaded = (ajaxSuccess/62)*100;

    //console.log("WorldBank BUD% Success")

    if (result.status.name == "ok") {
try {
        if(result['data'][1][0]['value'] != 'null'){
            //selectedCountry.budget = {};
            selectedCountry.budget.percent = result['data'][1][0]['value']
        }
        
        selectedCountry.budget.total = ((selectedCountry.budget['value'])*100)/(result['data'][1][0]['value'])

        
        $("#bud_value").html(selectedCountry.budget['total']);

    } catch (error) {
            console.log('\n', "WorldBank (GDP) Data was returned, but subsequent data cleaning failed", '\n',"[PROPERTIES]", '\n',"mycountry: ", mycountry, '\n', '\n', "[RETURNED DATA] ", '\n', result['data']);
            console.log("\n");
            
        }
       
        
        


    }

},
error: function(jqXHR, textStatus, errorThrown) {
ajaxCount++;

    console.log("WorldBank (Budget) Request Failed")

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
ajaxCount++;
ajaxSuccess++
$('#intProgress').text((ajaxSuccess/62)*100);
percentLoaded = (ajaxSuccess/62)*100;

    ////console.log(result);

    if (result.status.name == "ok") {
try {

        selectedCountry.alcConsompution = {
            "value": result['data'][1][0]['value'],
            "description": result['data'][1][0]['indicator']['value']
        };
        
        

    } catch (error) {
            console.log('\n', "WorldBank (GDP) Data was returned, but subsequent data cleaning failed", '\n',"[PROPERTIES]", '\n',"mycountry: ", mycountry, '\n', '\n', "[RETURNED DATA] ", '\n', result['data']);
            console.log("\n");
            
        }
       
        
        


    }

},
error: function(jqXHR, textStatus, errorThrown) {
ajaxCount++;

    console.log("WorldBank (Alcohol) Request Failed")

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
ajaxCount++;
ajaxSuccess++
$('#intProgress').text((ajaxSuccess/62)*100);
percentLoaded = (ajaxSuccess/62)*100;

    ////console.log(result);

    if (result.status.name == "ok") {
try {

        selectedCountry.education = {
            "value": result['data'][1][0]['value'],
            "description": result['data'][1][0]['indicator']['value']
        };

        $("#education_ph").html(selectedCountry.education['value']);

        
        

    } catch (error) {
            console.log('\n', "WorldBank (GDP) Data was returned, but subsequent data cleaning failed", '\n',"[PROPERTIES]", '\n',"mycountry: ", mycountry, '\n', '\n', "[RETURNED DATA] ", '\n', result['data']);
            console.log("\n");
            
        }
       
        
        


    }

},
error: function(jqXHR, textStatus, errorThrown) {
ajaxCount++;
console.log("WorldBank (Education) Request Failed")

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
ajaxCount++;
ajaxSuccess++
$('#intProgress').text((ajaxSuccess/62)*100);
percentLoaded = (ajaxSuccess/62)*100;

    ////console.log(result);

    if (result.status.name == "ok") {
try {

        selectedCountry.electricity = {
            "value": result['data'][1][0]['value'],
            "description": result['data'][1][0]['indicator']['value']
        };
        

    } catch (error) {
            console.log('\n', "WorldBank (GDP) Data was returned, but subsequent data cleaning failed", '\n',"[PROPERTIES]", '\n',"mycountry: ", mycountry, '\n', '\n', "[RETURNED DATA] ", '\n', result['data']);
            console.log("\n");
            
        }
       
        
        


    }

},
error: function(jqXHR, textStatus, errorThrown) {
ajaxCount++;
console.log("WorldBank (Electricity) Request Failed")

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
ajaxCount++;
ajaxSuccess++
$('#intProgress').text((ajaxSuccess/62)*100);
percentLoaded = (ajaxSuccess/62)*100;

    ////console.log(result);

    if (result.status.name == "ok") {
try {

        selectedCountry.edExpense = {
            "value": result['data'][1][0]['value'],
            "description": result['data'][1][0]['indicator']['value']
        };

        $("#govedexpense_ph").html(selectedCountry.edExpense['value']);
        

    } catch (error) {
            console.log('\n', "WorldBank (GDP) Data was returned, but subsequent data cleaning failed", '\n',"[PROPERTIES]", '\n',"mycountry: ", mycountry, '\n', '\n', "[RETURNED DATA] ", '\n', result['data']);
            console.log("\n");
            
        }
       
        
        


    }

},
error: function(jqXHR, textStatus, errorThrown) {
ajaxCount++;

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
ajaxCount++;
ajaxSuccess++
$('#intProgress').text((ajaxSuccess/62)*100);
percentLoaded = (ajaxSuccess/62)*100;

    ////console.log(result);

    if (result.status.name == "ok") {
try {

        selectedCountry.infantMortality = {
            "value": result['data'][1][0]['value'],
            "description": result['data'][1][0]['indicator']['value']
        };
        $("#infantmortality_ph").html(selectedCountry.infantMortality['value']);

    } catch (error) {
            console.log('\n', "WorldBank (GDP) Data was returned, but subsequent data cleaning failed", '\n',"[PROPERTIES]", '\n',"mycountry: ", mycountry, '\n', '\n', "[RETURNED DATA] ", '\n', result['data']);
            console.log("\n");
            
        }
       
        
        


    }

},
error: function(jqXHR, textStatus, errorThrown) {
ajaxCount++;
console.log("WorldBank (Infant Mortality) Request Failed")

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
ajaxCount++;
ajaxSuccess++
$('#intProgress').text((ajaxSuccess/62)*100);
percentLoaded = (ajaxSuccess/62)*100;

    ////console.log(result);

    if (result.status.name == "ok") {
try {

        selectedCountry.literacy = {
            "value": result['data'][1][0]['value'],
            "description": result['data'][1][0]['indicator']['value']
        };

        $("#literacy_ph").html(selectedCountry.literacy['value']);
        

    } catch (error) {
            console.log('\n', "WorldBank (GDP) Data was returned, but subsequent data cleaning failed", '\n',"[PROPERTIES]", '\n',"mycountry: ", mycountry, '\n', '\n', "[RETURNED DATA] ", '\n', result['data']);
            console.log("\n");
            
        }
       
        
        


    }

},
error: function(jqXHR, textStatus, errorThrown) {
ajaxCount++;
console.log("WorldBank (Literacy) Request Failed")

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
ajaxCount++;
ajaxSuccess++
$('#intProgress').text((ajaxSuccess/62)*100);
percentLoaded = (ajaxSuccess/62)*100;

    ////console.log(result);

    if (result.status.name == "ok") {
try {

        selectedCountry.worldbanklow10dist = {
            "value": result['data'][1][0]['value'],
            "description": result['data'][1][0]['indicator']['value']
        };
        

    } catch (error) {
            console.log('\n', "WorldBank (GDP) Data was returned, but subsequent data cleaning failed", '\n',"[PROPERTIES]", '\n',"mycountry: ", mycountry, '\n', '\n', "[RETURNED DATA] ", '\n', result['data']);
            console.log("\n");
            
        }
       
        
        


    }

},
error: function(jqXHR, textStatus, errorThrown) {
ajaxCount++;
console.log("WorldBank (Low 10% Dist) Request Failed")

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
ajaxCount++;
ajaxSuccess++
$('#intProgress').text((ajaxSuccess/62)*100);
percentLoaded = (ajaxSuccess/62)*100;

    ////console.log(result);

    if (result.status.name == "ok") {
try {

        selectedCountry.sanitation = {
            "value": result['data'][1][0]['value'],
            "description": result['data'][1][0]['indicator']['value']
        };
        

    } catch (error) {
            console.log('\n', "WorldBank (GDP) Data was returned, but subsequent data cleaning failed", '\n',"[PROPERTIES]", '\n',"mycountry: ", mycountry, '\n', '\n', "[RETURNED DATA] ", '\n', result['data']);
            console.log("\n");
            
        }
       
        
        


    }

},
error: function(jqXHR, textStatus, errorThrown) {
ajaxCount++;
console.log("WorldBank (Sanitation) Request Failed")

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
ajaxCount++;
ajaxSuccess++
$('#intProgress').text((ajaxSuccess/62)*100);
percentLoaded = (ajaxSuccess/62)*100;

    ////console.log(result);

    if (result.status.name == "ok") {
try {

        selectedCountry.percentInSlums = {
            "value": result['data'][1][0]['value'],
            "description": result['data'][1][0]['indicator']['value']
        };
        

    } catch (error) {
            console.log('\n', "WorldBank (GDP) Data was returned, but subsequent data cleaning failed", '\n',"[PROPERTIES]", '\n',"mycountry: ", mycountry, '\n', '\n', "[RETURNED DATA] ", '\n', result['data']);
            console.log("\n");
            
        }
       
        
        


    }

},
error: function(jqXHR, textStatus, errorThrown) {
ajaxCount++;
console.log("WorldBank (Slums %) Request Failed")

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
ajaxCount++;
ajaxSuccess++
$('#intProgress').text((ajaxSuccess/62)*100);
percentLoaded = (ajaxSuccess/62)*100;

    ////console.log(result);

    if (result.status.name == "ok") {
try {

        selectedCountry.worldbanktop10dist = {
            "value": result['data'][1][0]['value'],
            "description": result['data'][1][0]['indicator']['value']
        };
        

    } catch (error) {
            console.log('\n', "WorldBank (GDP) Data was returned, but subsequent data cleaning failed", '\n',"[PROPERTIES]", '\n',"mycountry: ", mycountry, '\n', '\n', "[RETURNED DATA] ", '\n', result['data']);
            console.log("\n");
            
        }
       
        
        


    }

},
error: function(jqXHR, textStatus, errorThrown) {
ajaxCount++;
console.log("WorldBank (Top 10% Dist) Request Failed")

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
ajaxCount++;
ajaxSuccess++
$('#intProgress').text((ajaxSuccess/62)*100);
percentLoaded = (ajaxSuccess/62)*100;

    ////console.log(result);

    if (result.status.name == "ok") {
try {

        selectedCountry.unemployment = {
            "value": result['data'][1][0]['value'],
            "description": result['data'][1][0]['indicator']['value']
        };
        

    } catch (error) {
            console.log('\n', "WorldBank (GDP) Data was returned, but subsequent data cleaning failed", '\n',"[PROPERTIES]", '\n',"mycountry: ", mycountry, '\n', '\n', "[RETURNED DATA] ", '\n', result['data']);
            console.log("\n");
            
        }
       
        
        


    }

},
error: function(jqXHR, textStatus, errorThrown) {
ajaxCount++;
console.log("WorldBank (Unemployment) Request Failed")

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
ajaxCount++;
ajaxSuccess++
$('#intProgress').text((ajaxSuccess/62)*100);
percentLoaded = (ajaxSuccess/62)*100; 

    ////console.log(result);

    if (result.status.name == "ok") {
try {

        selectedCountry.water = {
            "value": result['data'][1][0]['value'],
            "description": result['data'][1][0]['indicator']['value']
        };
        

    } catch (error) {
            console.log('\n', "WorldBank (GDP) Data was returned, but subsequent data cleaning failed", '\n',"[PROPERTIES]", '\n',"mycountry: ", mycountry, '\n', '\n', "[RETURNED DATA] ", '\n', result['data']);
            console.log("\n");
            
        }
       
        
        


    }

},
error: function(jqXHR, textStatus, errorThrown) {
ajaxCount++;
console.log("WorldBank (Water) Request Failed")

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
ajaxCount++;
ajaxSuccess++
$('#intProgress').text((ajaxSuccess/62)*100);
percentLoaded = (ajaxSuccess/62)*100; 

    ////console.log(result);

    if (result.status.name == "ok") {
try {

        selectedCountry.logisticsperfindex = {
            "value": result['data'][1][0]['value'],
            "description": result['data'][1][0]['indicator']['value']
        };
        

    } catch (error) {
            console.log('\n', "WorldBank (GDP) Data was returned, but subsequent data cleaning failed", '\n',"[PROPERTIES]", '\n',"mycountry: ", mycountry, '\n', '\n', "[RETURNED DATA] ", '\n', result['data']);
            console.log("\n");
            
        }
       
        
        


    }

},
error: function(jqXHR, textStatus, errorThrown) {
ajaxCount++;
console.log("WorldBank (Logistics Performance Index) Request Failed")

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
ajaxCount++;
ajaxSuccess++
$('#intProgress').text((ajaxSuccess/62)*100);
percentLoaded = (ajaxSuccess/62)*100; 

    ////console.log(result);

    if (result.status.name == "ok") {
try {

        selectedCountry.lifeexpectancy = {
            "value": result['data'][1][0]['value'].toFixed(),
            "description": result['data'][1][0]['indicator']['value']
        };

        $("#lifeexpectancy_ph").html(selectedCountry.lifeexpectancy['value']);
        

    } catch (error) {
            console.log('\n', "WorldBank (GDP) Data was returned, but subsequent data cleaning failed", '\n',"[PROPERTIES]", '\n',"mycountry: ", mycountry, '\n', '\n', "[RETURNED DATA] ", '\n', result['data']);
            console.log("\n");
            
        }
       
        
        


    }

},
error: function(jqXHR, textStatus, errorThrown) {
ajaxCount++;
console.log("WorldBank (Life Expectancy) Request Failed")

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
ajaxCount++;
ajaxSuccess++
$('#intProgress').text((ajaxSuccess/62)*100);
percentLoaded = (ajaxSuccess/62)*100; 

    ////console.log(result);

    if (result.status.name == "ok") {
try {

        selectedCountry.hospitalbeds = {
            "value": result['data'][1][0]['value'],
            "description": result['data'][1][0]['indicator']['value']
        };
        $("#hospitalbeds_ph").html(selectedCountry.hospitalbeds['value']);

    } catch (error) {
            console.log('\n', "WorldBank (GDP) Data was returned, but subsequent data cleaning failed", '\n',"[PROPERTIES]", '\n',"mycountry: ", mycountry, '\n', '\n', "[RETURNED DATA] ", '\n', result['data']);
            console.log("\n");
            
        }
       
        
        


    }

},
error: function(jqXHR, textStatus, errorThrown) {
ajaxCount++;
console.log("WorldBank (Hospital Beds) Request Failed")

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
ajaxCount++;
ajaxSuccess++
$('#intProgress').text((ajaxSuccess/62)*100);
percentLoaded = (ajaxSuccess/62)*100; 

    ////console.log(result);

    if (result.status.name == "ok") {
try {

        selectedCountry.surgicalprocedures = {
            "value": result['data'][1][0]['value'],
            "description": result['data'][1][0]['indicator']['value']
        };
        

    } catch (error) {
            console.log('\n', "WorldBank (GDP) Data was returned, but subsequent data cleaning failed", '\n',"[PROPERTIES]", '\n',"mycountry: ", mycountry, '\n', '\n', "[RETURNED DATA] ", '\n', result['data']);
            console.log("\n");
            
        }
       
        
        


    }

},
error: function(jqXHR, textStatus, errorThrown) {
ajaxCount++;
console.log("WorldBank (Surgical Procedures) Request Failed")

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
ajaxCount++;
ajaxSuccess++
$('#intProgress').text((ajaxSuccess/62)*100);
percentLoaded = (ajaxSuccess/62)*100; 

    ////console.log(result);

    if (result.status.name == "ok") {
try {

        selectedCountry.commdeaths = {
            "value": result['data'][1][0]['value'],
            "description": result['data'][1][0]['indicator']['value']
        };
        

    } catch (error) {
            console.log('\n', "WorldBank (GDP) Data was returned, but subsequent data cleaning failed", '\n',"[PROPERTIES]", '\n',"mycountry: ", mycountry, '\n', '\n', "[RETURNED DATA] ", '\n', result['data']);
            console.log("\n");
            
        }
       
        
        


    }

},
error: function(jqXHR, textStatus, errorThrown) {
ajaxCount++;
console.log("WorldBank (Comm Deaths) Request Failed")

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
ajaxCount++;
ajaxSuccess++
$('#intProgress').text((ajaxSuccess/62)*100);
percentLoaded = (ajaxSuccess/62)*100; 

    ////console.log(result);

    if (result.status.name == "ok") {
try {

        selectedCountry.deathrate = {
            "value": result['data'][1][0]['value'],
            "description": result['data'][1][0]['indicator']['value']
        };
        

    } catch (error) {
            console.log('\n', "WorldBank (GDP) Data was returned, but subsequent data cleaning failed", '\n',"[PROPERTIES]", '\n',"mycountry: ", mycountry, '\n', '\n', "[RETURNED DATA] ", '\n', result['data']);
            console.log("\n");
            
        }
       
        
        


    }

},
error: function(jqXHR, textStatus, errorThrown) {
ajaxCount++;
console.log("WorldBank (Death Rate) Request Failed")

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
ajaxCount++;
ajaxSuccess++
$('#intProgress').text((ajaxSuccess/62)*100);
percentLoaded = (ajaxSuccess/62)*100; 

    ////console.log(result);

    if (result.status.name == "ok") {
try {

        selectedCountry.diabetes = {
            "value": result['data'][1][0]['value'],
            "description": result['data'][1][0]['indicator']['value']
        };
        

    } catch (error) {
            console.log('\n', "WorldBank (GDP) Data was returned, but subsequent data cleaning failed", '\n',"[PROPERTIES]", '\n',"mycountry: ", mycountry, '\n', '\n', "[RETURNED DATA] ", '\n', result['data']);
            console.log("\n");
            
        }
       
        
        


    }

},
error: function(jqXHR, textStatus, errorThrown) {
ajaxCount++;
console.log("WorldBank (Diabetes) Request Failed")

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
ajaxCount++;
ajaxSuccess++
$('#intProgress').text((ajaxSuccess/62)*100);
percentLoaded = (ajaxSuccess/62)*100; 

    ////console.log(result);

    if (result.status.name == "ok") {
try {

        selectedCountry.underweight = {
            "value": result['data'][1][0]['value'],
            "description": result['data'][1][0]['indicator']['value']
        };
        

    } catch (error) {
            console.log('\n', "WorldBank (GDP) Data was returned, but subsequent data cleaning failed", '\n',"[PROPERTIES]", '\n',"mycountry: ", mycountry, '\n', '\n', "[RETURNED DATA] ", '\n', result['data']);
            console.log("\n");
            
        }
       
        
        


    }

},
error: function(jqXHR, textStatus, errorThrown) {
ajaxCount++;
console.log("WorldBank (Underweight) Request Failed")

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
ajaxCount++;
ajaxSuccess++
$('#intProgress').text((ajaxSuccess/62)*100);
percentLoaded = (ajaxSuccess/62)*100; 

    ////console.log(result);

    if (result.status.name == "ok") {
try {

        selectedCountry.deathsroad = {
            "value": result['data'][1][0]['value'],
            "description": result['data'][1][0]['indicator']['value']
        };
        

    } catch (error) {
            console.log('\n', "WorldBank (GDP) Data was returned, but subsequent data cleaning failed", '\n',"[PROPERTIES]", '\n',"mycountry: ", mycountry, '\n', '\n', "[RETURNED DATA] ", '\n', result['data']);
            console.log("\n");
            
        }
       
        
        


    }

},
error: function(jqXHR, textStatus, errorThrown) {
ajaxCount++;
console.log("WorldBank (Road Deaths) Request Failed")

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
ajaxCount++;
ajaxSuccess++
$('#intProgress').text((ajaxSuccess/62)*100);
percentLoaded = (ajaxSuccess/62)*100; 

    ////console.log(result);

    if (result.status.name == "ok") {
try {

        selectedCountry.hiv = {
            "value": result['data'][1][0]['value'],
            "description": result['data'][1][0]['indicator']['value']
        };
        

    } catch (error) {
            console.log('\n', "WorldBank (GDP) Data was returned, but subsequent data cleaning failed", '\n',"[PROPERTIES]", '\n',"mycountry: ", mycountry, '\n', '\n', "[RETURNED DATA] ", '\n', result['data']);
            console.log("\n");
            
        }
       
        
        


    }

},
error: function(jqXHR, textStatus, errorThrown) {
ajaxCount++;
console.log("WorldBank (HIV) Request Failed")

}

});
/* $.ajax({
url: "php/worldbank/worldbankunderoverweight.php",
type: 'POST',
dataType: 'json',
data: {
    country: mycountry,
},
success: function(result) {
ajaxCount++;
ajaxSuccess++
$('#intProgress').text((ajaxSuccess/62)*100);
percentLoaded = (ajaxSuccess/62)*100; 

    ////console.log(result);

    if (result.status.name == "ok") {
try {

        selectedCountry.overweight = {
            "value": result['data'][1][0]['value'],
            "description": result['data'][1][0]['indicator']['value']
        };
        

    } catch (error) {
            console.log('\n', "WorldBank (GDP) Data was returned, but subsequent data cleaning failed", '\n',"[PROPERTIES]", '\n',"mycountry: ", mycountry, '\n', '\n', "[RETURNED DATA] ", '\n', result['data']);
            console.log("\n");
            
        }
       
        
        


    }

},
error: function(jqXHR, textStatus, errorThrown) {
ajaxCount++;
console.log("WorldBank (Overweight) Request Failed")

}

}); */
$.ajax({
url: "php/worldbank/worldbankundernourishment.php",
type: 'POST',
dataType: 'json',
data: {
    country: mycountry,
},
success: function(result) {
ajaxCount++;
ajaxSuccess++
$('#intProgress').text((ajaxSuccess/62)*100);
percentLoaded = (ajaxSuccess/62)*100; 

    ////console.log(result);

    if (result.status.name == "ok") {
try {

        selectedCountry.undernourishment = {
            "value": result['data'][1][0]['value'],
            "description": result['data'][1][0]['indicator']['value']
        };
        

    } catch (error) {
            console.log('\n', "WorldBank (GDP) Data was returned, but subsequent data cleaning failed", '\n',"[PROPERTIES]", '\n',"mycountry: ", mycountry, '\n', '\n', "[RETURNED DATA] ", '\n', result['data']);
            console.log("\n");
            
        }
       
        
        


    }

},
error: function(jqXHR, textStatus, errorThrown) {
ajaxCount++;
console.log("WorldBank (Undernourishment) Request Failed")

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
ajaxCount++;
ajaxSuccess++
$('#intProgress').text((ajaxSuccess/62)*100);
percentLoaded = (ajaxSuccess/62)*100; 

    ////console.log(result);

    if (result.status.name == "ok") {
try {

        selectedCountry.contraception = {
            "value": result['data'][1][0]['value'],
            "description": result['data'][1][0]['indicator']['value']
        };
        

    } catch (error) {
            console.log('\n', "WorldBank (GDP) Data was returned, but subsequent data cleaning failed", '\n',"[PROPERTIES]", '\n',"mycountry: ", mycountry, '\n', '\n', "[RETURNED DATA] ", '\n', result['data']);
            console.log("\n");
            
        }
       
        
        


    }

},
error: function(jqXHR, textStatus, errorThrown) {
ajaxCount++;
console.log("WorldBank (Contraception) Request Failed")

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
ajaxCount++;
ajaxSuccess++
$('#intProgress').text((ajaxSuccess/62)*100);
percentLoaded = (ajaxSuccess/62)*100; 

    ////console.log(result);

    if (result.status.name == "ok") {
try {

        selectedCountry.prenatal = {
            "value": result['data'][1][0]['value'],
            "description": result['data'][1][0]['indicator']['value']
        };
        

    } catch (error) {
            console.log('\n', "WorldBank (GDP) Data was returned, but subsequent data cleaning failed", '\n',"[PROPERTIES]", '\n',"mycountry: ", mycountry, '\n', '\n', "[RETURNED DATA] ", '\n', result['data']);
            console.log("\n");
            
        }
       
        
        


    }

},
error: function(jqXHR, textStatus, errorThrown) {
ajaxCount++;
console.log("WorldBank (Prenatal) Request Failed")

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
ajaxCount++;
ajaxSuccess++
$('#intProgress').text((ajaxSuccess/62)*100);
percentLoaded = (ajaxSuccess/62)*100; 

    ////console.log(result);

    if (result.status.name == "ok") {
try {

        selectedCountry.totalpowerconsumption = {
            "value": result['data'][1][0]['value'],
            "description": result['data'][1][0]['indicator']['value']
        };
        

    } catch (error) {
            console.log('\n', "WorldBank (GDP) Data was returned, but subsequent data cleaning failed", '\n',"[PROPERTIES]", '\n',"mycountry: ", mycountry, '\n', '\n', "[RETURNED DATA] ", '\n', result['data']);
            console.log("\n");
            
        }
       
        
        


    }

},
error: function(jqXHR, textStatus, errorThrown) {
ajaxCount++;
console.log("WorldBank (Power Consumption) Request Failed")

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
ajaxCount++;
ajaxSuccess++
$('#intProgress').text((ajaxSuccess/62)*100);
percentLoaded = (ajaxSuccess/62)*100; 

    ////console.log(result);

    if (result.status.name == "ok") {
try {

        selectedCountry.renewableelectricoutput = {
            "value": result['data'][1][0]['value'],
            "description": result['data'][1][0]['indicator']['value']
        };
        

    } catch (error) {
            console.log('\n', "WorldBank (GDP) Data was returned, but subsequent data cleaning failed", '\n',"[PROPERTIES]", '\n',"mycountry: ", mycountry, '\n', '\n', "[RETURNED DATA] ", '\n', result['data']);
            console.log("\n");
            
        }
       
        
        


    }

},
error: function(jqXHR, textStatus, errorThrown) {
ajaxCount++;
console.log("WorldBank (Renewables Output) Request Failed")

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
ajaxCount++;
ajaxSuccess++
$('#intProgress').text((ajaxSuccess/62)*100);
percentLoaded = (ajaxSuccess/62)*100; 

    ////console.log(result);

    if (result.status.name == "ok") {
try {

        selectedCountry.oilgascoal = {
            "value": result['data'][1][0]['value'],
            "description": result['data'][1][0]['indicator']['value']
        };
        

    } catch (error) {
            console.log('\n', "WorldBank (GDP) Data was returned, but subsequent data cleaning failed", '\n',"[PROPERTIES]", '\n',"mycountry: ", mycountry, '\n', '\n', "[RETURNED DATA] ", '\n', result['data']);
            console.log("\n");
            
        }
       
        
        


    }

},
error: function(jqXHR, textStatus, errorThrown) {
ajaxCount++;
console.log("WorldBank (Electric Coal Gas) Request Failed")

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
ajaxCount++;
ajaxSuccess++
$('#intProgress').text((ajaxSuccess/62)*100);
percentLoaded = (ajaxSuccess/62)*100; 

    ////console.log(result);

    if (result.status.name == "ok") {
try {

        selectedCountry.deathspollution = {
            "value": result['data'][1][0]['value'],
            "description": result['data'][1][0]['indicator']['value']
        };
        

    } catch (error) {
            console.log('\n', "WorldBank (GDP) Data was returned, but subsequent data cleaning failed", '\n',"[PROPERTIES]", '\n',"mycountry: ", mycountry, '\n', '\n', "[RETURNED DATA] ", '\n', result['data']);
            console.log("\n");
            
        }
       
        
        


    }

},
error: function(jqXHR, textStatus, errorThrown) {
ajaxCount++;
console.log("WorldBank (Deaths by Pollution) Request Failed")

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
ajaxCount++;
ajaxSuccess++
$('#intProgress').text((ajaxSuccess/62)*100);
percentLoaded = (ajaxSuccess/62)*100; 

    ////console.log(result);

    if (result.status.name == "ok") {
try {

        selectedCountry.endangeredbirds = {
            "value": result['data'][1][0]['value'],
            "description": result['data'][1][0]['indicator']['value']
        };
        

    } catch (error) {
            console.log('\n', "WorldBank (GDP) Data was returned, but subsequent data cleaning failed", '\n',"[PROPERTIES]", '\n',"mycountry: ", mycountry, '\n', '\n', "[RETURNED DATA] ", '\n', result['data']);
            console.log("\n");
            
        }
       
        
        


    }

},
error: function(jqXHR, textStatus, errorThrown) {
ajaxCount++;
console.log("WorldBank (Endangered Birds) Request Failed")

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
ajaxCount++;
ajaxSuccess++
$('#intProgress').text((ajaxSuccess/62)*100);
percentLoaded = (ajaxSuccess/62)*100; 

    ////console.log(result);

    if (result.status.name == "ok") {
try {

        selectedCountry.endangeredfish = {
            "value": result['data'][1][0]['value'],
            "description": result['data'][1][0]['indicator']['value']
        };
        

    } catch (error) {
            console.log('\n', "WorldBank (GDP) Data was returned, but subsequent data cleaning failed", '\n',"[PROPERTIES]", '\n',"mycountry: ", mycountry, '\n', '\n', "[RETURNED DATA] ", '\n', result['data']);
            console.log("\n");
            
        }
       
        
        


    }

},
error: function(jqXHR, textStatus, errorThrown) {
ajaxCount++;
console.log("WorldBank (Endangered Fish) Request Failed")

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
ajaxCount++;
ajaxSuccess++
$('#intProgress').text((ajaxSuccess/62)*100);
percentLoaded = (ajaxSuccess/62)*100; 

    ////console.log(result);

    if (result.status.name == "ok") {
try {

        selectedCountry.endangeredmammal = {
            "value": result['data'][1][0]['value'],
            "description": result['data'][1][0]['indicator']['value']
        };
        

    } catch (error) {
            console.log('\n', "WorldBank (GDP) Data was returned, but subsequent data cleaning failed", '\n',"[PROPERTIES]", '\n',"mycountry: ", mycountry, '\n', '\n', "[RETURNED DATA] ", '\n', result['data']);
            console.log("\n");
            
        }
       
        
        


    }

},
error: function(jqXHR, textStatus, errorThrown) {
ajaxCount++;
console.log("WorldBank (Endangered Mammal) Request Failed")

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
ajaxCount++;
ajaxSuccess++
$('#intProgress').text((ajaxSuccess/62)*100);
percentLoaded = (ajaxSuccess/62)*100; 

    ////console.log(result);

    if (result.status.name == "ok") {
try {

        selectedCountry.endangeredplant = {
            "value": result['data'][1][0]['value'],
            "description": result['data'][1][0]['indicator']['value']
        };
        

    } catch (error) {
            console.log('\n', "WorldBank (GDP) Data was returned, but subsequent data cleaning failed", '\n',"[PROPERTIES]", '\n',"mycountry: ", mycountry, '\n', '\n', "[RETURNED DATA] ", '\n', result['data']);
            console.log("\n");
            
        }
       
        
        


    }

},
error: function(jqXHR, textStatus, errorThrown) {
ajaxCount++;
console.log("WorldBank (Endangered Plants) Request Failed")

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
ajaxCount++;
ajaxSuccess++
$('#intProgress').text((ajaxSuccess/62)*100);
percentLoaded = (ajaxSuccess/62)*100; 

    //BUG: NOT RETURNING AS "OK"

    if (result.status.co2ouput == "ok") {
        try{
        //console.log("co2 worked!");

        selectedCountry.co2ouput = {
            "value": result['data'][1][0]['value'],
            "description": result['data'][1][0]['indicator']['value']
        };

        $("#co2output_ph").html(selectedCountry.co2ouput['value']);
        

    } catch (error) {
            console.log('\n', "WorldBank (GDP) Data was returned, but subsequent data cleaning failed", '\n',"[PROPERTIES]", '\n',"mycountry: ", mycountry, '\n', '\n', "[RETURNED DATA] ", '\n', result['data']);
            console.log("\n");
            
        }
       
        
        


    }

},
error: function(jqXHR, textStatus, errorThrown) {
ajaxCount++;
console.log("WorldBank (CO2 Output) Request Failed")

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
ajaxCount++;
ajaxSuccess++
$('#intProgress').text((ajaxSuccess/62)*100);
percentLoaded = (ajaxSuccess/62)*100; 

    ////console.log(result);

    if (result.status.name == "ok") {
try {

        selectedCountry.airpollution = {
            "value": result['data'][1][0]['value'],
            "description": result['data'][1][0]['indicator']['value']
        };

        $("#airpollution_ph").html(selectedCountry.airpollution['value']);
        

    } catch (error) {
            console.log('\n', "WorldBank (GDP) Data was returned, but subsequent data cleaning failed", '\n',"[PROPERTIES]", '\n',"mycountry: ", mycountry, '\n', '\n', "[RETURNED DATA] ", '\n', result['data']);
            console.log("\n");
            
        }
       
        
        


    }

},
error: function(jqXHR, textStatus, errorThrown) {
ajaxCount++;
console.log("WorldBank (Air Pollution) Request Failed")

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
ajaxCount++;
ajaxSuccess++
$('#intProgress').text((ajaxSuccess/62)*100);
percentLoaded = (ajaxSuccess/62)*100; 

    ////console.log(result);

    if (result.status.name == "ok") {
try {

        selectedCountry.electricityfromrenewables = {
            "value": result['data'][1][0]['value'],
            "description": result['data'][1][0]['indicator']['value']
        };

        $("#energyfromrenewables_ph").html(selectedCountry.electricityfromrenewables['value']);
        

    } catch (error) {
            console.log('\n', "WorldBank (GDP) Data was returned, but subsequent data cleaning failed", '\n',"[PROPERTIES]", '\n',"mycountry: ", mycountry, '\n', '\n', "[RETURNED DATA] ", '\n', result['data']);
            console.log("\n");
            
        }
       
        
        


    }

},
error: function(jqXHR, textStatus, errorThrown) {
ajaxCount++;
console.log("WorldBank (Renewables Electricity) Request Failed")

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
ajaxCount++;
ajaxSuccess++
$('#intProgress').text((ajaxSuccess/62)*100);
percentLoaded = (ajaxSuccess/62)*100; 

    ////console.log(result);

    if (result.status.name == "ok") {
try {

        selectedCountry.govedexpensesecondary = {
            "value": result['data'][1][0]['value'],
            "description": result['data'][1][0]['indicator']['value']
        };
        

    } catch (error) {
            console.log('\n', "WorldBank (GDP) Data was returned, but subsequent data cleaning failed", '\n',"[PROPERTIES]", '\n',"mycountry: ", mycountry, '\n', '\n', "[RETURNED DATA] ", '\n', result['data']);
            console.log("\n");
            
        }
       
        
        


    }

},
error: function(jqXHR, textStatus, errorThrown) {
ajaxCount++;
console.log("WorldBank (Expenses for Secondary) Request Failed")

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
ajaxCount++;
ajaxSuccess++
$('#intProgress').text((ajaxSuccess/62)*100);
percentLoaded = (ajaxSuccess/62)*100; 

    ////console.log(result);

    if (result.status.name == "ok") {
try {

        selectedCountry.govedexpensetertiary = {
            "value": result['data'][1][0]['value'],
            "description": result['data'][1][0]['indicator']['value']
        };
        

    } catch (error) {
            console.log('\n', "WorldBank (GDP) Data was returned, but subsequent data cleaning failed", '\n',"[PROPERTIES]", '\n',"mycountry: ", mycountry, '\n', '\n', "[RETURNED DATA] ", '\n', result['data']);
            console.log("\n");
            
        }
       
        
        


    }

},
error: function(jqXHR, textStatus, errorThrown) {
ajaxCount++;
console.log("WorldBank (Expenses for Tertiary) Request Failed")

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
ajaxCount++;
ajaxSuccess++
$('#intProgress').text((ajaxSuccess/62)*100);
percentLoaded = (ajaxSuccess/62)*100; 

    ////console.log(result);

    if (result.status.name == "ok") {
try {

        selectedCountry.primaryedcompletion = {
            "value": result['data'][1][0]['value'],
            "description": result['data'][1][0]['indicator']['value']
        };
        

    } catch (error) {
            console.log('\n', "WorldBank (GDP) Data was returned, but subsequent data cleaning failed", '\n',"[PROPERTIES]", '\n',"mycountry: ", mycountry, '\n', '\n', "[RETURNED DATA] ", '\n', result['data']);
            console.log("\n");
            
        }
       
        
        


    }

},
error: function(jqXHR, textStatus, errorThrown) {
ajaxCount++;
console.log("WorldBank (Primary Completion) Request Failed")

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
ajaxCount++;
ajaxSuccess++
$('#intProgress').text((ajaxSuccess/62)*100);
percentLoaded = (ajaxSuccess/62)*100; 

    ////console.log(result);

    if (result.status.name == "ok") {
try {

        selectedCountry.primaryteacherpupilratio = {
            "value": result['data'][1][0]['value'],
            "description": result['data'][1][0]['indicator']['value']
        };
        

    } catch (error) {
            console.log('\n', "WorldBank (GDP) Data was returned, but subsequent data cleaning failed", '\n',"[PROPERTIES]", '\n',"mycountry: ", mycountry, '\n', '\n', "[RETURNED DATA] ", '\n', result['data']);
            console.log("\n");
            
        }
       
        
        


    }

},
error: function(jqXHR, textStatus, errorThrown) {
ajaxCount++;
console.log("WorldBank (Teacher Pupil Ratio) Request Failed")

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
ajaxCount++;
ajaxSuccess++
$('#intProgress').text((ajaxSuccess/62)*100);
percentLoaded = (ajaxSuccess/62)*100; 

    ////console.log(result);

    if (result.status.name == "ok") {
try {

        selectedCountry.enrollmentpreprimary = {
            "value": result['data'][1][0]['value'],
            "description": result['data'][1][0]['indicator']['value']
        };
        

    } catch (error) {
            console.log('\n', "WorldBank (GDP) Data was returned, but subsequent data cleaning failed", '\n',"[PROPERTIES]", '\n',"mycountry: ", mycountry, '\n', '\n', "[RETURNED DATA] ", '\n', result['data']);
            console.log("\n");
            
        }
       
        
        


    }

},
error: function(jqXHR, textStatus, errorThrown) {
ajaxCount++;
console.log("WorldBank (Enrollment Preprimary) Request Failed")

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
ajaxCount++;
ajaxSuccess++
$('#intProgress').text((ajaxSuccess/62)*100);
percentLoaded = (ajaxSuccess/62)*100; 

    ////console.log(result);

    if (result.status.name == "ok") {
try {

        selectedCountry.enrollmentprimary = {
            "value": result['data'][1][0]['value'],
            "description": result['data'][1][0]['indicator']['value']
        };
        

    } catch (error) {
            console.log('\n', "WorldBank (GDP) Data was returned, but subsequent data cleaning failed", '\n',"[PROPERTIES]", '\n',"mycountry: ", mycountry, '\n', '\n', "[RETURNED DATA] ", '\n', result['data']);
            console.log("\n");
            
        }
       
        
        


    }

},
error: function(jqXHR, textStatus, errorThrown) {
ajaxCount++;
console.log("WorldBank (Enrollment Primary) Request Failed")

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
ajaxCount++;
ajaxSuccess++
$('#intProgress').text((ajaxSuccess/62)*100);
percentLoaded = (ajaxSuccess/62)*100; 

    ////console.log(result);

    if (result.status.name == "ok") {
try {

        selectedCountry.enrollmentsecondary = {
            "value": result['data'][1][0]['value'],
            "description": result['data'][1][0]['indicator']['value']
        };
        

    } catch (error) {
            console.log('\n', "WorldBank (GDP) Data was returned, but subsequent data cleaning failed", '\n',"[PROPERTIES]", '\n',"mycountry: ", mycountry, '\n', '\n', "[RETURNED DATA] ", '\n', result['data']);
            console.log("\n");
            
        }
       
        
        


    }

},
error: function(jqXHR, textStatus, errorThrown) {
ajaxCount++;
console.log("WorldBank (Enrollment Secondary) Request Failed")

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
ajaxCount++;
ajaxSuccess++
$('#intProgress').text((ajaxSuccess/62)*100);
percentLoaded = (ajaxSuccess/62)*100; 

    ////console.log(result);

    if (result.status.name == "ok") {
try {

        selectedCountry.enrollmenttertiary = {
            "value": result['data'][1][0]['value'],
            "description": result['data'][1][0]['indicator']['value']
        };
        

    } catch (error) {
            console.log('\n', "WorldBank (GDP) Data was returned, but subsequent data cleaning failed", '\n',"[PROPERTIES]", '\n',"mycountry: ", mycountry, '\n', '\n', "[RETURNED DATA] ", '\n', result['data']);
            console.log("\n");
            
        }
       
        
        


    }

},
error: function(jqXHR, textStatus, errorThrown) {
ajaxCount++;
console.log("WorldBank (Enrollment Tertiary) Request Failed")

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
ajaxCount++;
ajaxSuccess++
$('#intProgress').text((ajaxSuccess/62)*100);
percentLoaded = (ajaxSuccess/62)*100; 

    ////console.log(result);

    if (result.status.name == "ok") {
try {

        selectedCountry.trainedteachersprimary = {
            "value": result['data'][1][0]['value'],
            "description": result['data'][1][0]['indicator']['value']
        };
        

    } catch (error) {
            console.log('\n', "WorldBank (GDP) Data was returned, but subsequent data cleaning failed", '\n',"[PROPERTIES]", '\n',"mycountry: ", mycountry, '\n', '\n', "[RETURNED DATA] ", '\n', result['data']);
            console.log("\n");
            
        }
       
        
        


    }

},
error: function(jqXHR, textStatus, errorThrown) {
ajaxCount++;
console.log("WorldBank (Trained Teachers Primary) Request Failed")

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
ajaxCount++;
ajaxSuccess++
$('#intProgress').text((ajaxSuccess/62)*100);
percentLoaded = (ajaxSuccess/62)*100; 

    ////console.log(result);

    if (result.status.name == "ok") {
try {

        selectedCountry.arrivals = {
            "value": result['data'][1][0]['value'],
            "description": result['data'][1][0]['indicator']['value']
        };
        $("#arrivals_ph").html(selectedCountry.arrivals['value']);

    } catch (error) {
            console.log('\n', "WorldBank (GDP) Data was returned, but subsequent data cleaning failed", '\n',"[PROPERTIES]", '\n',"mycountry: ", mycountry, '\n', '\n', "[RETURNED DATA] ", '\n', result['data']);
            console.log("\n");
            
        }
       
        
        


    }

},
error: function(jqXHR, textStatus, errorThrown) {
ajaxCount++;
console.log("WorldBank (Flight Tourist Arrivals) Request Failed")

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
ajaxCount++;
ajaxSuccess++
$('#intProgress').text((ajaxSuccess/62)*100);
percentLoaded = (ajaxSuccess/62)*100; 

    ////console.log(result);

    if (result.status.name == "ok") {
try {

        selectedCountry.departures = {
            "value": result['data'][1][0]['value'],
            "description": result['data'][1][0]['indicator']['value']
        };

        $("#departures_ph").html(selectedCountry.departures['value']);
        

    } catch (error) {
            console.log('\n', "WorldBank (GDP) Data was returned, but subsequent data cleaning failed", '\n',"[PROPERTIES]", '\n',"mycountry: ", mycountry, '\n', '\n', "[RETURNED DATA] ", '\n', result['data']);
            console.log("\n");
            
        }
       
        
        


    }

},
error: function(jqXHR, textStatus, errorThrown) {
ajaxCount++;
console.log("WorldBank (Flight Tourist Departures) Request Failed")

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
ajaxCount++;
ajaxSuccess++
$('#intProgress').text((ajaxSuccess/62)*100);
percentLoaded = (ajaxSuccess/62)*100; 

    ////console.log(result);

    if (result.status.name == "ok") {
try {

        selectedCountry.tourismincome = {
            "value": result['data'][1][0]['value'],
            "description": result['data'][1][0]['indicator']['value']
        };

        $("#tourismincome_ph").html(selectedCountry.tourismincome['value']);
        

    } catch (error) {
            console.log('\n', "WorldBank (GDP) Data was returned, but subsequent data cleaning failed", '\n',"[PROPERTIES]", '\n',"mycountry: ", mycountry, '\n', '\n', "[RETURNED DATA] ", '\n', result['data']);
            console.log("\n");
            
        }
       
        
        


    }

},
error: function(jqXHR, textStatus, errorThrown) {
ajaxCount++;
console.log("WorldBank (Tourism Income) Request Failed")

}

});