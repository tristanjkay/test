
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
                        geojsonResult[result['data'].indexOf(element)] = element;
                        console.log(element);
                       
                    
                    });
                    localStorage.setItem('test', JSON.stringify(result['data']));
                    
                     
                }
                 
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log("ERROR: geojson-fileget.php")
            }
        })


//GET VALUE AND DATA FROM DROPDOWN/GEOJSON
    dropdown.addEventListener("change", function() {
        geojsonResult.forEach(element => {
            if(element.properties.name != name){
                var name = element.properties.name;
                var iso_a2 = element.properties.iso_a2;
                console.log(element.properties.name);
                selectedCountry = {"name": name, "iso_a2": iso_a2};
                localStorage.setItem('selectedCountry', JSON.stringify(selectedCountry));

            }
        });

     
        //window.location.replace("loading.html");
        
    });

//LOAD DATA FROM APIS



