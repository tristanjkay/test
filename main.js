
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
        localStorage.setItem('coordinates', geometry.coordinates);
        var countryCentralPoint = getCenter(geometry.coordinates);
        selectedCountry = {"name": name, "iso_a2": iso_a2, "iso_a3": iso_a3, "geometry": geometry, "centralPoint": countryCentralPoint};
        localStorage.setItem('selectedCountry', JSON.stringify(selectedCountry));
        window.location.replace("loading.html");
    });

//GET CENTRAL POINT OF GEOMETRY

var getCenter = function (arr) {
    var minX, maxX, minY, maxY;
    for (var i = 0; i < arr.length; i++)
    {
        var x = arr[i][0], y = arr[i][1];
        minX = (x < minX || minX == null) ? x : minX;
        maxX = (x > maxX || maxX == null) ? x : maxX;
        minY = (y < minY || minY == null) ? y : minY;
        maxY = (y > maxY || maxY == null) ? y : maxY;
    }
    return [(minX + maxX) / 2, (minY + maxY) / 2];
};







