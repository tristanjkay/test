
//VARIABLES


//URL Rewrite
window.history.replaceState('','','/');


//POPULATE PAGE WITH DATA


//General
$('#ph_name').html(JSON.parse(localStorage.selectedCountry).name);
$('#ph_capital').html(JSON.parse(localStorage.selectedCountry).capital);
$('#ph_description').html(JSON.parse(localStorage.selectedCountry).description);
$('#ph_descriptionfull').html(JSON.parse(localStorage.selectedCountry).descriptionfull.join('<br><br>'));
$('#ph_flag').attr("src", JSON.parse(localStorage.selectedCountry).flag);
$('#ph_continent').html(JSON.parse(localStorage.selectedCountry).continent);
$('#ph_size').html(JSON.parse(localStorage.selectedCountry).area); // sq km
$('#ph_population').html(JSON.parse(localStorage.selectedCountry).population);
//$('#ph_region').html(JSON.parse(localStorage.selectedCountry).region);


//Economy
$('#ph_currencyvalue').html(parseFloat(JSON.parse(localStorage.selectedCountry).exchangerate).toFixed(2));
$("[id=ph_currencycode]").html(JSON.parse(localStorage.selectedCountry).currencyabbrev);
/* $('#ph_currencycode').each(function(){
  $(this).html(JSON.parse(localStorage.selectedCountry).currencyabbrev);    
}); */
$('#ph_currencyname').html(JSON.parse(localStorage.selectedCountry).currencyname);
$('#ph_currencyvalue_gbp').html(parseFloat(JSON.parse(localStorage.selectedCountry).othercurrencies['GBP']).toFixed(2));
$('#ph_currencyvalue_usd').html(parseFloat(JSON.parse(localStorage.selectedCountry).othercurrencies['USD']).toFixed(2));
$('#ph_currencyvalue_jpy').html(parseFloat(JSON.parse(localStorage.selectedCountry).othercurrencies['JPY']).toFixed(2));
$('#ph_currencyvalue_cny').html(parseFloat(JSON.parse(localStorage.selectedCountry).othercurrencies['CNY']).toFixed(2));

//Calculate how much
var gdpvalue = JSON.parse(localStorage.selectedCountry).gdp.value;
var gdpvalueabbrev;
var gdpstringlength = ((JSON.parse(localStorage.selectedCountry).gdp.value).toString().split('.')[0]).length;
    if (gdpstringlength < 4) {
      //Less than 1000
      gdpvalueabbrev = gdpvalue;
    } else if(gdpstringlength < 7) {
      //Thousands
      gdpvalueabbrev = gdpvalue.toString().charAt(0) + "." + gdpvalue.toString().charAt(1) + gdpvalue.toString().charAt(2) + "K";
    } else if(gdpstringlength < 10) {
      //Millions
      gdpvalueabbrev = gdpvalue.toString().charAt(0) + "." + gdpvalue.toString().charAt(1) + gdpvalue.toString().charAt(2) + "M";
    }  else if(gdpstringlength < 13) {
      //Billions
      gdpvalueabbrev = gdpvalue.toString().charAt(0) + "." + gdpvalue.toString().charAt(1) + gdpvalue.toString().charAt(2) + "B";
    } else if(gdpstringlength < 16) {
      //Trillions
      gdpvalueabbrev = gdpvalue.toString().charAt(0) + "." + gdpvalue.toString().charAt(1) + gdpvalue.toString().charAt(2) + "T";
    }
$('#ph_gdp').html(gdpvalueabbrev);
$('#ph_inflationrate').html(Math.round((JSON.parse(localStorage.selectedCountry).inflation.value) * 100) / 100 + "%");
$('#ph_annualbudget').html(JSON.parse(localStorage.selectedCountry).budget.total);
$('#ph_low10').html(JSON.parse(localStorage.selectedCountry).worldbanklow10dist.value + "%");
$('#ph_top10').html(JSON.parse(localStorage.selectedCountry).worldbanktop10dist.value + "%");

//Weather
$('#ph_temperature').html(JSON.parse(localStorage.selectedCountry).weather.temperature + "&deg");
$('#ph_feelslike').html("Feels like "+ JSON.parse(localStorage.selectedCountry).weather.feelslike + "&deg");
$('#ph_weathericon').attr("src", JSON.parse(localStorage.selectedCountry).weather.icon);
$('#ph_humidity').html(JSON.parse(localStorage.selectedCountry).weather.humidity);
$('#ph_precipitation').html(JSON.parse(localStorage.selectedCountry).weather.precipitation);
$('#ph_windspeed').html(JSON.parse(localStorage.selectedCountry).weather.windSpeed);
$('#ph_winddirection').html(JSON.parse(localStorage.selectedCountry).weather.windDirection);
$('#ph_uvindex').html(JSON.parse(localStorage.selectedCountry).weather.uvIndex);



//News
var news = (JSON.parse(localStorage.selectedCountry).news);
var articleCount = [0,0,0];

//Date folder
Object.keys(news).forEach(key => {
  var thisDateFolder = news[key];
  var thisDateFolderName = key;
  

  
  //Articles in date folders
  Object.keys(thisDateFolder).forEach(key => {
    var article = thisDateFolder[key];
    var articleDate = article.webPublicationDate.split("T")[0];
    var day = article.webPublicationDate.split("T")[0].split("-")[2];
    var thisDay = localStorage.todaysDateMinus.split("-")[2];
    var formattedTime = (article.webPublicationDate.split("T")[1]).slice(0, -4);

    
    
    if(articleDate == localStorage.todaysDateMinus){
      //Today's News
      $('#articles_today').append("<div class='col greyblock' id='" + article.webPublicationDate + "' style = 'margin:1rem; margin-top:.5rem; margin-left:.5rem; text-align: left; min-width: 330px;'><h2 style='padding-left: 1rem; padding-bottom: 2rem; min-height:12rem'>"+ article.webTitle +"</h2><p style='padding-left: 1rem; padding-bottom: 1rem; min-height:17rem;'>"+ article.textBody +"</p><b style='margin-left: 1rem;'>"+ formattedTime +"</b></div>");
      articleCount[0]++;
    }else{
      if(thisDay > 7 && day > (thisDay-7) && day < thisDay){
        //This Weeks
        $('#articles_thisweek').append("<div class='col greyblock' id='" + article.webPublicationDate + "' style = 'margin:1rem; margin-top:.5rem; margin-left:.5rem; text-align: left; min-width: 330px;'><h2 style='padding-left: 1rem; padding-bottom: 2rem; min-height:12rem'>"+ article.webTitle +"</h2><p style='padding-left: 1rem; padding-bottom: 1rem; min-height:17rem;'>"+ article.textBody +"</p><b style='margin-left: 1rem;'>"+ articleDate +"</b></div>");
        articleCount[1]++;
      }else{
            //Others
            $('#articles_other').append("<div class='col greyblock' id='" + article.webPublicationDate + "' style = 'margin:1rem; margin-top:.5rem; margin-left:.5rem; text-align: left; min-width: 330px;'><h2 style='padding-left: 1rem; padding-bottom: 2rem; min-height:12rem'>"+ article.webTitle +"</h2><p style='padding-left: 1rem; padding-bottom: 1rem; min-height:17rem;'>"+ article.textBody +"</p><b style='margin-left: 1rem;'>"+ articleDate +"</b></div>");
            articleCount[2]++;
        }
      };
  })

});


if(articleCount[0] == 0){
 
  $('#articles_today').remove();
  $('#articles_today_title').remove();
}
if(articleCount[1] == 0){
  console.log("This Week Removed");
  $('#articles_thisweek').remove();
  $('#articles_thisweek_title').remove();
}

if(articleCount[2] == 0){
  console.log("Other Removed");
  $('#articles_other').remove();
  $('#articles_other_title').remove();
}
// ----------- News END--------------------//

var index = 0;

// chart colors
var colors = ['#007bff','#28a745','#333333','#c3e6cb','#dc3545','#6c757d'];
//Forecast
JSON.parse(localStorage.selectedCountry).weather.forecast.forEach(element => {
    
    
    var string = "day[" +index+"]";
    var daytemps = [];
    daytemps.push(element.hour[0].temp_c, element.hour[2].temp_c, element.hour[5].temp_c, element.hour[8].temp_c, element.hour[11].temp_c, element.hour[14].temp_c, element.hour[17].temp_c, element.hour[20].temp_c, element.hour[23].temp_c);
    index++;

    $('#forecast').append('<div class="row" style="margin-top: 2rem;"> <h3 style = "margin-bottom: 1rem;">'+ element.date +'</h3> </div> <canvas id=' + string + ' width="0" style="padding-bottom:1rem; max-height: 400px;"></canvas><div class="row "> <div class="col greyblock" style = "margin:1rem; margin-top:.5rem; margin-right:.5rem; text-align: center;"> <h2>'+ element.day['avgtemp_c'] + '</h2> <h6>Temperature</h6> </div> <div class="col greyblock" style = "margin:1rem; margin-top:.5rem; margin-left:.5rem; text-align: center;"> <h2>'+ element.day['avghumidity'] + '</h2> <h6>Humidity</h6> </div> <div class="col greyblock" style = "margin:1rem; margin-top:.5rem; margin-left:.5rem; text-align: center;"> <h2>'+ element.day['maxwind_kph'] + '</h2> <h6>Wind Speed</h6> </div> <div class="col greyblock" style = "margin:1rem; margin-top:.5rem; margin-left:.5rem; text-align: center;"> <h2>'+ element.day['daily_chance_of_rain'] + '</h2> <h6>Precipitation</h6> </div> </div>');

    /* large line chart */
    var chLine = document.getElementById(string);
    var chartData = {
    labels: ["0:00", "02:00", "05:00", "08:00", "11:00", "14:00", "17:00", "20:00", "23:00"],
    datasets: [{
    label: "Temperature",
    data: [daytemps[0], daytemps[1], daytemps[2], daytemps[3], daytemps[4], daytemps[5], daytemps[6], daytemps[7], daytemps[8]],
    backgroundColor: 'transparent',
    borderColor: colors[0],
    borderWidth: 4,
    pointBackgroundColor: colors[0]
  }

  ]
};
if (chLine) {
  new Chart(chLine, {
  type: 'line',
  data: chartData,
  options: {
    scales: {
      xAxes: [{ 
                gridLines: {
                    display: false,
                    drawBorder: false,
                },
                drawBorder: false,
                ticks: {
                  fontColor: "#fff", // this here
                  display:false
                },
            }],
            yAxes: [{
                display: false,
                gridLines: {
                    display: false,
                },
            }],
    },
    legend: {
      display: false
    },
    responsive: true
  }
  });
}
    //console.log(index);
    
    
});

//Weather Chart









//Tourism

$('#ph_tourismincome').html(JSON.parse(localStorage.selectedCountry).tourismincome.value);
$('#ph_flightarrivals').html(JSON.parse(localStorage.selectedCountry).arrivals.value);
$('#ph_flightdepartures').html(JSON.parse(localStorage.selectedCountry).departures.value);


//Flights
var flightsIndex = 0;
var flightsArray = JSON.parse(localStorage.selectedCountry).flights;
setTimeout(function () {
  if(flightsArray != null){
    flightsArray.forEach(element => {

      var days = parseInt(element["duration"]) > 1439 ? (parseInt(element["duration"])/1440).toFixed(0) : 0;
      var daysSansZero = parseInt(days);
     
      var hours = (parseInt(element["duration"]) - (days*1440)) < 1439 ? ((parseInt(element["duration"])-(days*1440))/60).toFixed(0) : 0;
      var minutes = (parseInt(element["duration"]) - (hours*60)) < 1439 ? ((parseInt(element["duration"])-(hours*60))/60).toFixed(0) : 0;

      var originDate = element['depart_date'].split("-");
      var returnDay = parseInt(originDate[2])+ daysSansZero;
      var arrivalDate = originDate[0].toString() + "-" + originDate[1].toString()  + "-" + (returnDay.toString().split("").length > 1? returnDay.toString(): ("0" + returnDay.toString()));

      var duration = (days > 0 ? (days > 1 ? days + " days " : days + " day "): "")  + (hours > 0 ? (hours > 1 ? hours + " hours " : hours + " hour "): "") + (minutes > 0 ? (minutes > 1 ? minutes + " mins " : minutes + " min "): "");

        $('#flightslist').append('<div class = "greyblock"  style="margin-top: 2rem; padding: 1rem;"><div class = "row" style = "text-align: center;"><div class= "col align-middle" style="margin-top: auto; margin-bottom: auto;"><h4 id= "ph_departfrom">' + element['origin'] + '</h4><h6 id= "ph_departtime">' + element['depart_date'] + '</h6></div><div class= "col align-middle" style="margin-top: auto; margin-bottom: auto;"><i class="fas fa-plane" style="font-size: x-large; color: #E1E1E1;"></i><p style="font-size: 14px">' + duration + '</p><p style="font-size: 14px">' + element['distance'] + ' km</p><p style="font-size: 14px">' + element['number_of_changes'] + (element['number_of_changes'] > 1 ? " changes" : " change") + '</p></div><div class= "col align-middle" style="margin-top: auto; margin-bottom: auto;"><h4 id= "ph_arrivalto">' + element['destination'] + '</h4><h6 id= "ph_arrivaltime">' + arrivalDate + '</h6></div></div></div>');
      flightsIndex++;
    });
  }

}, 1000);

      //MAP SETUP

      var map = L.map('map').fitWorld();

      const placeIcon = L.divIcon({
        html: '<p style="font-size: 80px; z-index: 999; color: #dc3545; opacity: 0.5"> &#8226; </p>',
        iconSize: [80,80],
        iconAnchor: [40,40],
     
      
      });

      const selectedPlaceIcon = L.divIcon({
        html: '<p style="font-size: 90px; color: #dc3545; z-index: 999; opacity: 1"> &#8226;</p>',
      });

      const capitalIcon = L.divIcon({
        html: '<p style="font-size: 60px; z-index: 999"> &#9733;</p>',
      });
    
      L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
  
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
        'Imagery ?? <a href="https://www.mapbox.com/">Mapbox</a>',
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1
    }).addTo(map);

    

    var countryBounds = L.geoJSON().addTo(map).addData(JSON.parse(localStorage.getItem('selectedCountry'))['geometry']);
    
    


  



    var page = document.body.id;


    switch(page) {
      
      case "general" :
        
        map.setView([JSON.parse(localStorage.getItem('capitalLocationLat')), JSON.parse(localStorage.getItem('capitalLocationLong'))], 5);
       

        break;

      case "economy" :

        map.setView([JSON.parse(localStorage.getItem('capitalLocationLat')), JSON.parse(localStorage.getItem('capitalLocationLong'))], 5);

        //Imports
        JSON.parse(localStorage.getItem('selectedCountry'))['imports'].forEach(element => {

          if(element.Year >= 2019){
            $('#import_categorycol').append("<h3 style='font-weight: 400; margin-left: 2rem; margin-bottom: 1rem'>" + element.ProductOrSector + "</h3>");
            $('#import_amountcol').append("<h3 style='font-weight: 400; margin-bottom: 1rem'>" + element.Value + "</h3>");
            $('#import_yearcol').append("<h3 style='font-weight: 400; margin-bottom: 1rem'>" + element.Year + "</h3>");
          }
            

          });

          //Imports
        JSON.parse(localStorage.getItem('selectedCountry'))['exports'].forEach(element => {

          if(element.Year >= 2019){
          $('#export_categorycol').append("<h3 style='font-weight: 400; margin-left: 2rem; margin-bottom: 1rem'>" + element.ProductOrSector + "</h3>");
          $('#export_amountcol').append("<h3 style='font-weight: 400; margin-bottom: 1rem'>" + element.Value + "</h3>");
          $('#export_yearcol').append("<h3 style='font-weight: 400; margin-bottom: 1rem'>" + element.Year + "</h3>");

        }

        });
      

        break;

      case "places" :
        map.setView([JSON.parse(localStorage.getItem('capitalLocationLat')), JSON.parse(localStorage.getItem('capitalLocationLong'))], 5);
        
        //POIs
        var poiIndex = 0;
        var poiArray = JSON.parse(localStorage.selectedCountry).pois;

        var markers = {};
        var lastMarkerSelected=null;
        var lastPanelSelectedImg=null;

        function clickPoi(id){
          var imgdivString = '#' + id + 'img';
          console.log(imgdivString);
          if(lastMarkerSelected != null){
            lastMarkerSelected.setIcon(placeIcon);

            var panelDiv = "#" + lastPanelSelected;
            console.log(panelDiv);
            $(lastPanelSelectedImg).css('filter','grayscale(100%)');
            $(panelDiv).css('background','#F4F4F4');
          }
          map.setView([markers[id]['_latlng']['lat'],markers[id]['_latlng']['lng']], 16);

          markers[id].setIcon(selectedPlaceIcon);
          $(imgdivString).css('filter','none');
          var panelDiv = "#" + id;
          $(panelDiv).css('background','lightgrey');

          return ([lastMarkerSelected = markers[id], lastPanelSelectedImg = imgdivString, lastPanelSelected = id]);
        }


        setTimeout(function () {
          
          if(poiArray != null){
            
            poiArray.forEach(element => {
                var allPoisAdded = document.getElementById('pois').childNodes;
                console.log(allPoisAdded);
                var poiElement = element;
                allPoisAdded.forEach(element => {
                  if(element.id == (poiElement['name']).toLowerCase().split("'").join("").split(" ").join("").replaceAll(".", "")){
                    poiArray.splice((poiArray.indexOf(element)), 1);
                  }
                });

                var id = (element['name']).toLowerCase().split("'").join("").split(" ").join("").replaceAll(".", "").replaceAll("&", "");

                var lon = element['geometry']['location']['lng'];
                var lat = element['geometry']['location']['lat'];
                var popupText = "test";
                
                var markerLocation = new L.LatLng(lat, lon);
                var marker = new L.Marker(markerLocation,{ icon:  placeIcon});
                marker.featureId = id;
                markers[marker.featureId] = marker;
                map.addLayer(marker);

             
            
                marker.bindPopup(popupText);
                
                try {
                  $('#pois').append("<div class='greyblock' id = '" + (element['name']).toLowerCase().split("'").join("").split(" ").join("").replaceAll(".", "").replaceAll("&", "") + "' style='margin-top: 1rem; padding: 0px;'> <div class='row' style='text-align: left; padding-right: 2rem;'> <div class='col-4 placecard' style='margin-top: auto; margin-bottom: auto;'> <img id = '" + (element['name']).toLowerCase().split("'").join("").split(" ").join("").replaceAll(".", "") + "img' src='https://maps.googleapis.com/maps/api/place/photo?maxwidth=1200&photo_reference=" + element['photos'][0]["photo_reference"] +"&key=AIzaSyBueIu23lPtas0qJpu5hjdpe4nkYE_nnoo' alt='' style='border-top-left-radius: 20px; border-bottom-left-radius: 20px; border-top-right-radius: 0px; border-bottom-right-radius: 0px; min-height: 12rem;  width: 100%; max-height: 12rem; object-fit: cover; filter: grayscale(100%);'> </div> <div class='col-8' style='vertical-align: middle; margin-top: 1.3rem; margin-bottom: 2rem;'> <h4 id='ph_placetitle'>" + element.name + "</h4><div id='ph_placedescription' class='row' style='margin-left: 0px !important;'>" + (element["types"].filter(item => item !== "establishment").filter(item => item !== "tourist_attraction").filter(item => item !== "point_of_interest").map((i) => '<p style = "background-color: #EAEAEA; font-weight: normal; padding: 4px; padding-left: 6px; padding-right: 6px; border-radius: 10px; margin-right: 1rem; width: auto;">' + i.replaceAll('_',' ') + '</p>').join("")) +  "</div> </div> </div> </div>");
                document.getElementById(id).addEventListener("click", ()=> {clickPoi(id)}, true);
                poiIndex++;
                } catch (error) {
                  
                }
                
            });
          }

        }, 1000);



        break;

      case "weather" :
        map.fitBounds(countryBounds.getBounds());
        break;

      case "news" :
        map.setView([JSON.parse(localStorage.getItem('capitalLocationLat')), JSON.parse(localStorage.getItem('capitalLocationLong'))], 5);
        break;

      case "flights" :
        console.log("flights")
        map.locate({setView: true, maxZoom: 16});
        map.on('locationfound', (e) => {
          console.log(e.latlng['lat']);


          var latlngs = [];

          var latlng1 = [e.latlng['lat'], e.latlng['lng']],
            latlng2 = [localStorage.getItem('capitalLocationLat'), localStorage.getItem('capitalLocationLong')];

          var offsetX = latlng2[1] - latlng1[1],
            offsetY = latlng2[0] - latlng1[0];

          var r = Math.sqrt(Math.pow(offsetX, 2) + Math.pow(offsetY, 2)),
            theta = Math.atan2(offsetY, offsetX);

          var thetaOffset = (3.14 / 10);

          var r2 = (r / 2) / (Math.cos(thetaOffset)),
            theta2 = theta + thetaOffset;

          var midpointX = (r2 * Math.cos(theta2)) + latlng1[1],
            midpointY = (r2 * Math.sin(theta2)) + latlng1[0];

          var midpointLatLng = [midpointY, midpointX];

          latlngs.push(latlng1, midpointLatLng, latlng2);

          var pathOptions = {
            color: 'red',
            weight: 8
          }

          var curvedPath = L.curve(
            [
              'M', latlng1,
              'Q', midpointLatLng,
              latlng2
            ], pathOptions).addTo(map);

          map.fitBounds(curvedPath.getBounds());
        });
       
      
        break;
}

