
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
                console.log(result);
                console.log(result[0].name)
                
    
                if (result.status.name == "ok") {
                    console.log("OK");
                    result['data'].forEach(element => {
    
                    var option = document.createElement("option");
                    option.text = element.name;
                    option.value = element.iso2;
                    dropdown.add(option);
                    console.log(element.properties.name);
                    });
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log("ERROR: geojson-fileget.php")
            }
        })


//GET VALUE FROM DROPDOWN
    dropdown.addEventListener("change", function() {
        var selectedCountry = {"name": dropdown.value};
    
        localStorage.setItem('selectedCountry', JSON.stringify(selectedCountry));
        console.log(localStorage.getItem("selectedCountry"));
        window.location.replace("loading.html");
    });

//LOAD DATA FROM APIS



