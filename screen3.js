
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

//Economy
$('#ph_currencyvalue').html(JSON.parse(localStorage.selectedCountry).exchangerate);
$('#ph_currencycode').html(JSON.parse(localStorage.selectedCountry).currencycode);
$('#ph_gdp').html(JSON.parse(localStorage.selectedCountry).gdp.value);
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

//POIs
var poiIndex = 0;
var poiArray = JSON.parse(localStorage.selectedCountry).pois;
setTimeout(function () {
  if(poiArray != null){
    poiArray.forEach(element => {
        $('#pois').append("<a href='s3news.html' style='text-decoration: none; color: black !important;'> <div class='greyblock' style='margin-top: 1rem; padding: 0px;'> <div class='row' style='text-align: left; padding-left: 1rem; padding-top: 1rem; padding-bottom: .5rem; padding-right: 2rem;'> <div class='col-4' style='margin-top: auto; margin-bottom: auto;'> <img src='placeholder.png' class='placecard' alt='' style='width:100%'> </div> <div class='col-8' style='vertical-align: middle; margin-top: 2rem; margin-bottom: 2rem;'> <h4 id='ph_placetitle'>" + element.poi.name + "</h4><h6 id='ph_placedescription'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla suscipit sit amet justo nec vestibulum. Donec commodo mi iaculis ornare feugiat.</h6> </div> </div> </div> </a>");
      poiIndex++;
    });
  }

}, 1000);

//News
var news = JSON.parse(localStorage.selectedCountry).news;
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
  console.log("Today Removed");
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

    $('#forecast').append('<div class="row" style="margin-top: 2rem;"> <h3 style = "margin-bottom: 1rem;">This Week</h3> </div> <canvas id=' + string + ' width="0" style="padding-bottom:1rem"></canvas><div class="row "> <div class="col greyblock" style = "margin:1rem; margin-top:.5rem; margin-right:.5rem; text-align: center;"> <h2>83</h2> <h6>Temperature</h6> </div> <div class="col greyblock" style = "margin:1rem; margin-top:.5rem; margin-left:.5rem; text-align: center;"> <h2>0</h2> <h6>Humidity</h6> </div> <div class="col greyblock" style = "margin:1rem; margin-top:.5rem; margin-left:.5rem; text-align: center;"> <h2>WSW</h2> <h6>Wind Speed</h6> </div> <div class="col greyblock" style = "margin:1rem; margin-top:.5rem; margin-left:.5rem; text-align: center;"> <h2>5.6</h2> <h6>Precipitation</h6> </div> </div>');

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
//$('#ph_tourisminvestment').html(JSON.parse(localStorage.selectedCountry).departures.value); //NOPE

