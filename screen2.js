
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


//Tourism

$('#ph_tourismincome').html(JSON.parse(localStorage.selectedCountry).tourismincome.value);


