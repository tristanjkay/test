//VARIABLES
    var dropdown = document.getElementById("countriesDropdown");
    var geojsonResult = [];
    var selectedCountry;

    //ORIGIN
    var origin = "England";

//URL Rewrite
window.history.replaceState('','','/');

//POPULATE DROPDOWN
        /* $.ajax({
            url: "geojson-fileget.php",
            type: 'GET',  
            dataType: 'json',
            data: {
            },
            success: function(result) {
                
                if (result.status.name == "ok") {
                    
                    
                    result['data'].sort((a,b) => (a.properties.name > b.properties.name) ? 1 : ((b.properties.name > a.properties.name) ? -1 : 0))
                    result['data'].forEach(element => {
                        var option = document.createElement("option");
                        option.text = element.properties.name;
                        option.value = element.properties.iso_a2;
                        dropdown.add(option);
                        geojsonResult[result['data'].indexOf(element)] = element;
                    });
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log("ERROR: geojson-fileget.php")
            }
        }); */

        fetch('https://raw.githubusercontent.com/tristanjkay/assets/main/countryBorders.geo.json')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            data['features'].sort((a,b) => (a.properties.name > b.properties.name) ? 1 : ((b.properties.name > a.properties.name) ? -1 : 0))
            data['features'].forEach(element => {
                var option = document.createElement("option");
                option.text = element.properties.name;
                option.value = element.properties.iso_a2;
                dropdown.add(option);
                geojsonResult[data['features'].indexOf(element)] = element;
            });
            });
        
        

//GET VALUE AND DATA FROM DROPDOWN/GEOJSON
    dropdown.addEventListener("change", function() {

        var name = dropdown.options[dropdown.selectedIndex].text;;
        var iso_a2 = dropdown.options[dropdown.selectedIndex].value;
        geojsonResult.forEach(element => {
            if(element.properties.name == name){
                return selectedElement = element;
            }
        });
        var iso_a3 = selectedElement.properties.iso_a3;
        var geometry = selectedElement.geometry;
        var capital;
        var capitalLocation;
        
      /*   $.ajax({
            url: "capital-fileget.php",
            type: 'POST',  
            dataType: 'json',
            data: {
            },
            success: function(result) {

                if (result.status.name == "ok") {
                    
                    result['data'].forEach(element => {
                        
                        if(element.name == name){

                            capital = element.capital;
                            localStorage.setItem("capitalLocation", element.latlng);
                        }
                    });
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log("ERROR: geojson-fileget.php")
                
            }
        }); */
        

        fetch('https://raw.githubusercontent.com/tristanjkay/assets/main/countryInfoRaw.json')
        .then(response => response.json())
        .then(data => {
            console.log(data['features']);
            data['features'].forEach(element => {
                        
                if(element.name == name){

                    capital = element.capital;
                    localStorage.setItem("capitalLocation", element.latlng);
                }
            });
            
            });
    
        selectedCountry = {"name": name, "iso_a2": iso_a2, "iso_a3": iso_a3, "codewto": "test", "geometry": geometry};
        
        //Imports WTO
var params = {
    // Request parameters
    "ig": "all",
    "name": "all",
    "reg": "all",
    "gp": "all",
    "lang": "1",
};

$.ajax({
    url: "https://api.wto.org/timeseries/v1/partners?" + $.param(params),
    beforeSend: function(xhrObj){
        // Request headers
        xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key","71e13c8a8030440e814fe17043f74a47");
    },
    type: "GET",
    // Request body
    data: "{body}",
})
.done(function(data) {
    var parsedData = data;
    parsedData.forEach(element => {
        if (element.iso3A == selectedCountry.iso_a3) {
            console.log("WTO CODE = ", element.code);
            selectedCountry.codewto = element.code;
            localStorage.setItem("wtocode", element.code);
        }
    });
    //  selectedCountry.codewto = parsedData[0].code;
    //localStorage.setItem("wtocode", parsedData[0].code);
    //console.log("[0]:" + parsedData[0].code);



 
})
.fail(function() {
    console.log("Imports Data Error");
});
        
        //RESTCountries
$.ajax({
    url: "php/general/restcountries.php",
    type: 'POST',
    dataType: 'json',
    data: {
        country: selectedCountry.iso_a2,
    },
    success: function(result) {




        //console.log("RESTCountries Success");

        if (result.status.name == "ok") {
            
           

            //Set Data to Country Object
            selectedCountry.capital = result['data'][0]['capital'][0];
            selectedCountry.region = result['data'][0]['region'];
            selectedCountry.population = result['data'][0]['population'];
            selectedCountry.currency = result['data'][0]['currencies'];
            //selectedCountry.currency = result['data'][0]['currencies'][mycountry3]['name'];
            selectedCountry.currencycode = result['data'][0]['currencies'];
            
            selectedCountry.currencycode = [[selectedCountry.currencycode].flat()][0][0];
            localStorage.setItem("capitalLocationLat", result['data'][0]['capitalInfo']['latlng'][0]);
            localStorage.setItem("capitalLocationLong", result['data'][0]['capitalInfo']['latlng'][1]);

for (const [key, value] of Object.entries(selectedCountry.currency)) {
    
    return [selectedCountry.currencyabbrev = Object.getOwnPropertyNames(result['data'][0]['currencies'])[0], selectedCountry.currencycode = value['symbol'] , selectedCountry.currencyname = value['name']]
    //console.log("This is the value: ",value['name']);

  };
    
            //selectedCountry.currencycode = result['data'][0]['currencies'][mycountry3]['code'];
            //selectedCountry.currencysymbol = result['data'][0]['currencies'];
            //selectedCountry.currencysymbol = result['data'][0]['currencies'][mycountry3]['symbol'];
            selectedCountry.currencies = result['data'][0]['currencies'];
            selectedCountry.language = result['data'][0]['languages'];
            selectedCountry.flag = result['data'][0]['flags']['png'];
            selectedCountry.timezones = result['data'][0]['timezones'];
            selectedCountry.location = result['data'][0]['latlng'];
            
           
            


            
            

        }
    
    },
    error: function(jqXHR, textStatus, errorThrown) {
ajaxCount++;
        //console.log("RESTCountries Fail")

    }
    
});


        
        $(document).ajaxStop(function() {
            localStorage.setItem('selectedCountry', JSON.stringify(selectedCountry));
            setTimeout(function () {
        window.location.replace("loading.html");
    }, 5000);
        });
    });








