
//VARIABLES


//URL Rewrite
window.history.replaceState('','','/');

//POPULATE PAGE WITH DATA



//General
$('#ph_name').html(JSON.parse(localStorage.selectedCountry).name);
$('#ph_capital').html(JSON.parse(localStorage.selectedCountry).capital);
$('#ph_description').html(JSON.parse(localStorage.selectedCountry).description);

//Economy
//TODO: MAKE ORIGIN COUNTRY DYNAMIC
$('#ph_currencycode').html("GBP");
$('#ph_origincurrencyvalue').html("1");
$('#ph_currencyvalue').html(parseFloat(JSON.parse(localStorage.selectedCountry).othercurrencies['GBP']).toFixed(2));
$('#ph_currencycode').html(JSON.parse(localStorage.selectedCountry).currencyabbrev + " (" + JSON.parse(localStorage.selectedCountry).currencycode + ")");


//Weather
$('#ph_temperature').html(JSON.parse(localStorage.selectedCountry).weather.temperature + "&deg");
$('#ph_feelslike').html("Feels like "+ JSON.parse(localStorage.selectedCountry).weather.feelslike + "&deg");
$('#ph_weathericon').attr("src", JSON.parse(localStorage.selectedCountry).weather.icon);
$('#ph_weathertitle').html("Today (" + JSON.parse(localStorage.selectedCountry).capital + ")")

//POIs
var poiIndex = 0;
var poiArray = JSON.parse(localStorage.selectedCountry).pois;
setTimeout(function () {
  if(poiArray != null){
    poiArray.forEach(element => {
      if(poiIndex <= 5){
        $('#pois').append("<div class='col-6 col-md-4'><div class='thumbnail'><a href='s3places.html'><img src='https://maps.googleapis.com/maps/api/place/photo?maxwidth=1200&photo_reference=" + element['photos'][0]["photo_reference"] +"&key=AIzaSyBueIu23lPtas0qJpu5hjdpe4nkYE_nnoo' class='placecard' alt='' style='width:100%; max-height: 10rem; min-height: 10rem; object-fit: cover;'></a></div></div>");
      }
      poiIndex++;
    });
  }

}, 1000);




//Tourism 

$('#ph_tourismincome').html(JSON.parse(localStorage.selectedCountry).tourismincome.value);
$('#ph_flights').html(JSON.parse(localStorage.selectedCountry).arrivals.value);
$('#ph_departfrom').html(JSON.parse(localStorage.selectedCountry).flights[0]['origin']);
$('#ph_departtime').html(JSON.parse(localStorage.selectedCountry).flights[0]['depart_date']);
$('#ph_arrivalto').html(JSON.parse(localStorage.selectedCountry).flights[0]['destination']);
if (JSON.parse(localStorage.selectedCountry).flights[0]['duration'] < 1440) {
  $('#ph_arrivaltime').html(JSON.parse(localStorage.selectedCountry).flights[0]['depart_date']);
} else {
  var splitArray= JSON.parse(localStorage.selectedCountry).flights[0]['depart_date'].split("-");
  $('#ph_arrivaltime').html(splitArray[0] + "-" + splitArray[1] + "-" + (parseInt(splitArray[2])+1).toString());
}

//News

var news = JSON.parse(localStorage.selectedCountry).news;
var sortedNews = JSON.parse(localStorage.sortedNews);
var top3newsitems = [];

//Date folder
Object.keys(news).forEach(key => {
  var thisDateFolder = news[key];
  var thisDateFolderName = key;
  

  
  //Articles in date folders
  Object.keys(thisDateFolder).forEach(key => {
    var article = thisDateFolder[key];
    var articleDate = article.webPublicationDate.split("T")[0];
    var shortArticleDate = articleDate.split("-")[1] + "/" + articleDate.split("-")[2];
    var day = article.webPublicationDate.split("T")[0].split("-")[2];
    var thisDay = localStorage.todaysDateMinus.split("-")[2];
    var formattedTime = (article.webPublicationDate.split("T")[1]).slice(0, -4);

    
    
    
    /* if(articleDate == localStorage.todaysDateMinus){
      //Today's News
        top3newsitems.push([article.webTitle, formattedTime]);
    }else{
      if(thisDay > 7 && day > (thisDay-7) && day < thisDay){
        //This Weeks
        if(top3newsitems.length < 3){
            top3newsitems.push([article.webTitle, shortArticleDate]);
        }
      }else{
            //Otherss
            if(top3newsitems.length < 3){
                top3newsitems.push([article.webTitle, shortArticleDate]);
            }
        }
      };1 */
      

      
  })

});

top3newsitems[0]= Object.values(sortedNews)[(Object.keys(sortedNews).length)-1];
top3newsitems[1]= Object.values(sortedNews)[(Object.keys(sortedNews).length)-2];
top3newsitems[2]= Object.values(sortedNews)[(Object.keys(sortedNews).length)-3];


for (const [key, value] of Object.entries(top3newsitems[0])) {
  var newobject =  value;

  for (const [key, value] of Object.entries(newobject)) {
    if(key == "webTitle"){
      $('#art1description').text(value)
    }
    if(key == "shortDate"){
      $('#art1date').text((value.substring(5)).replace("-", "/"));
    }  
  }
}
for (const [key, value] of Object.entries(top3newsitems[1])) {
  var newobject =  value;

  for (const [key, value] of Object.entries(newobject)) {
    if(key == "webTitle"){
      $('#art2description').text(value)
    }
    if(key == "shortDate"){
      $('#art2date').text((value.substring(5)).replace("-", "/"));
    }  
  }
}
for (const [key, value] of Object.entries(top3newsitems[2])) {
  var newobject =  value;

  for (const [key, value] of Object.entries(newobject)) {
    if(key == "webTitle"){
      $('#art3description').text(value)
    }
    if(key == "shortDate"){
      $('#art3date').text((value.substring(5)).replace("-", "/"));
    }  
  }
}

var map = L.map('map').fitWorld();

      const fontAwesomeIcon = L.divIcon({
        html: '<p style="font-size: 60px; z-index: 999"> &#9733;</p>',
      });
    
      L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
      maxZoom: 6,
      minZoom: 5,
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1
    }).addTo(map);

    L.marker([JSON.parse(localStorage.getItem('capitalLocationLat')), JSON.parse(localStorage.getItem('capitalLocationLong'))],{ icon:  fontAwesomeIcon}).addTo(map);

    L.geoJSON().addTo(map).addData(JSON.parse(localStorage.getItem('selectedCountry'))['geometry']);
    
    map.setView([JSON.parse(localStorage.getItem('capitalLocationLat')), JSON.parse(localStorage.getItem('capitalLocationLong'))], 5);

