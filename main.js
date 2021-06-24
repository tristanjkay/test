
//VARIABLES
var dropdown = document.getElementById("countriesDropdown");
var geojsonResult;

//POPULATE DROPDOWN
        $.ajax({
            url: "geojson-fileget.php",
            type: 'POST',  
            dataType: 'json',
            data: {
    
            },
            success: function(result) {
                
                if (result.status.name == "ok") {
                    
                    result['data'].forEach(element => {
                        console.log(element);
    
                        var option = document.createElement("option");
                        option.text = element.properties.name;
                        option.value = element.properties.iso_a2;
                        dropdown.add(option);
                    
                    });
                    return geojsonResult = result;
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



