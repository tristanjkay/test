selectedCountry = {"name": JSON.parse(localStorage.selectedCountry).name, "iso_a2": JSON.parse(localStorage.selectedCountry).iso_a2, "iso_a3": JSON.parse(localStorage.selectedCountry).iso_a3, "geometry": JSON.parse(localStorage.selectedCountry).geometry};
var mycountry = JSON.parse(localStorage.selectedCountry).iso_a2;
var mycountryname = JSON.parse(localStorage.selectedCountry).name;
localStorage.setItem('selectedCountry', JSON.stringify(selectedCountry));

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
            //selectedCountry.continent = result['data']['subregion'];
            selectedCountry.population = result['data']['population'];
            selectedCountry.currency = result['data']['currencies'][0]['name'];
            selectedCountry.currencycode = result['data']['currencies'][0]['code'];
            selectedCountry.currencysymbol = result['data']['currencies'][0]['symbol'];
            selectedCountry.currencies = result['data']['currencies'];
            selectedCountry.language = result['data']['languages'][0]['name'];
            selectedCountry.flag = result['data']['flag'];
            //selectedCountry.area = result['data']['area'];
            selectedCountry.timezones = result['data']['timezones'];
            


            
            

        }
    
    },
    error: function(jqXHR, textStatus, errorThrown) {
        //console.log("RESTCountries Fail")

    }
    
});
