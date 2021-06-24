
//VARIABLES
var dropdown = document.getElementById("countriesDropdown");
var geojsonResult = [];
var selectedCountry;

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
                        
    
                        var option = document.createElement("option");
                        option.text = element.properties.name;
                        option.value = element.properties.iso_a2;
                        dropdown.add(option);
                       
                    
                    });
                    return geojsonResult = result['data'];
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log("ERROR: geojson-fileget.php")
            }
        })


//GET VALUE AND DATA FROM DROPDOWN/GEOJSON
    dropdown.addEventListener("change", function() {
        var number = 0;
        
        for(item in geojsonResult) {
            console.log(item);
            /* console.log(geojsonResult[number]);
            if(dropdown.iso_a2 == item.properties.iso_a2){
                
            };
            return number++ */
    
        
        };




        
        selectedCountry = {"name": dropdown.text, "iso_a2": dropdown.value};
        localStorage.setItem('selectedCountry', JSON.stringify(selectedCountry));
        console.log(localStorage.getItem("selectedCountry"));
        window.location.replace("loading.html");
        
    });

//LOAD DATA FROM APIS



