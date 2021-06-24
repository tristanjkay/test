
//VARIABLES
var dropdown = document.getElementById("countriesDropdown");

//POPULATE DROPDOWN
        $.ajax({
            url: "geojson-fileget.php",
            type: 'POST',  
            dataType: 'json',
            data: {
    
            },
            success: function(result) {
                
                if (result.status.name == "ok") {
                    console.log("OK");
                    result['data'].forEach(element => {
    
                    var option = document.createElement("option");
                    option.text = element.properties.name;
                    option.value = element.properties.iso2;
                    dropdown.add(option);
                    
                    });
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log("ERROR: geojson-fileget.php")
            }
        })


//GET VALUE FROM DROPDOWN
    dropdown.addEventListener("change", function() {
        var selectedCountry = {"name": dropdown.text};
    
        localStorage.setItem('selectedCountry', JSON.stringify(selectedCountry));
        console.log(localStorage.getItem("selectedCountry"));
        window.location.replace("loading.html");
    });

//LOAD DATA FROM APIS



