
//VARIABLES


//POPULATE PAGE WITH DATA


//General
$('#ph_name').html(JSON.parse(localStorage.selectedCountry).name);
$('#ph_capital').html(JSON.parse(localStorage.selectedCountry).capital);
$('#ph_description').html(JSON.parse(localStorage.selectedCountry).description);

//Economy
$('#ph_currencyvalue').html(JSON.parse(localStorage.selectedCountry).currencycode);
$('#ph_currencycode').html(JSON.parse(localStorage.selectedCountry).currencycode);


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

JSON.parse(localStorage.selectedCountry).news.forEach(article => {
  console.log(article);
$('#articles_today').append("<div class='col greyblock' id='" + article.publishedAt + "' style = 'margin:1rem; margin-top:.5rem; margin-left:.5rem; text-align: left; min-width: 330px;'><h2 style='padding-left: 1rem; padding-bottom: 2rem;'>"+ article.title +"</h2><p style='padding-left: 1rem; padding-bottom: 1rem;'>"+ article.description +"</p><cite style='margin-left: 1rem;'>"+ article.publishedAt +"</cite></div>");
}
)

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

