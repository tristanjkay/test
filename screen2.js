
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
$('#ph_weathertitle').html("Today (" + JSON.parse(localStorage.selectedCountry).capital + ")")

//POIs
$('#art1description').html(top3newsitems[0][0]);
$('#art2description').html(top3newsitems[1][0]);
$('#art3description').html(top3newsitems[2][0]);
$('#art1date').html(top3newsitems[0][1]);
$('#art2date').html(top3newsitems[1][1]);
$('#art3date').html(top3newsitems[2][1]);


//Tourism 

$('#ph_tourismincome').html(JSON.parse(localStorage.selectedCountry).tourismincome.value);
$('#ph_flights').html(JSON.parse(localStorage.selectedCountry).arrivals.value);

//News

var news = JSON.parse(localStorage.selectedCountry).news;
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

    
    
    
    if(articleDate == localStorage.todaysDateMinus){
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
      };
      

      
  })

});

$('#art1description').html(top3newsitems[0][0]);
$('#art2description').html(top3newsitems[1][0]);
$('#art3description').html(top3newsitems[2][0]);
$('#art1date').html(top3newsitems[0][1]);
$('#art2date').html(top3newsitems[1][1]);
$('#art3date').html(top3newsitems[2][1]);
