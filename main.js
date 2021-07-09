
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
                    });
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log("ERROR: geojson-fileget.php")
            }
        });
        
        

//GET VALUE AND DATA FROM DROPDOWN/GEOJSON
    dropdown.addEventListener("change", function() {

        var name = dropdown.options[dropdown.selectedIndex].text;;
        var iso_a2 = dropdown.options[dropdown.selectedIndex].value;
        geojsonResult.forEach(element => {
            if(element.properties.name == name){
                return selectedElement = element;
            }
        });
        var iso_a3 = selectedElement.properties.iso_a3;
        var geometry = selectedElement.geometry;
        var capital;
        var capitalLocation;

        $.ajax({
            url: "capital-fileget.php",
            type: 'POST',  
            dataType: 'json',
            data: {
            },
            success: function(result) {
                localStorage.setItem("capitalfileget", result.status.name);
                if (result.status.name == "ok") {
                    localStorage.setItem("capitalfileget", "success");
                    result['data'].forEach(element => {
                        
                        if(element.name == name){
                            capital = element.capital;
                            capitalLocation = element.latlng;
                        }
                    });
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log("ERROR: geojson-fileget.php")
                localStorage.setItem("capitalfileget", errorThrown);
            }
        });
    
        selectedCountry = {"name": name, "iso_a2": iso_a2, "iso_a3": iso_a3, "geometry": geometry, "capitalLatLng": capitalLocation};
        localStorage.setItem('selectedCountry', JSON.stringify(selectedCountry));
        localStorage.setItem('latlng', JSON.stringify(capitalLocation));
        $(document).ajaxStop(function() {
        window.location.replace("loading.html");
        });
    });








