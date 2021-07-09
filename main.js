
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
        })

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
        var coordinates = geometry.coordinates;
        console.log(coordinates);
        var lat = [];
        var long = [];

        coordinates.forEach(element => {
            lat.push(element[0]);
            long.push(element[1]);
        });

        var latTotal = 0;
        for(var i = 0; i < lat.length; i++) {
        latTotal += lat[i];
        }
        var latAvg = latTotal / lat.length;

        var longTotal = 0;
        for(var i = 0; i < long.length; i++) {
        longTotal += long[i];
        }
        var longAvg = longTotal / long.length;
        finalCoords = longTotal;


        localStorage.setItem('coordinates', finalCoords);
    
        selectedCountry = {"name": name, "iso_a2": iso_a2, "iso_a3": iso_a3, "geometry": geometry, "centralPoint": coordinates};
        localStorage.setItem('selectedCountry', JSON.stringify(selectedCountry));
        window.location.replace("loading.html");
    });








