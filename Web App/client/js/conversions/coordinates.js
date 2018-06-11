function ParseDMS(input) {
    var latLngInfo = input.split('/|/');

    var latInfo        = latLngInfo[0].split('|');
    var latCoordinates = latInfo[1].split(',');

    var lngInfo        = latLngInfo[1].split('|');
    var lngCoordinates = lngInfo[1].split(',');

    var lat = ConvertDMSToDD(latCoordinates[0], latCoordinates[1], latCoordinates[2], latInfo[0]);
    var lng = ConvertDMSToDD(lngCoordinates[0], lngCoordinates[1], lngCoordinates[2], lngInfo[0]);
    return [lat, lng];
}

function ConvertDMSToDD(degrees, minutes, seconds, direction) {
    var dd = parseFloat(degrees) + parseFloat(minutes)/60 + parseFloat(seconds)/(60*60);

    if (direction == "S" || direction == "W") {
        dd = dd * -1;
    } // Don't do anything for N or E
    return dd;
}

//convert latitude and longitude to kilometers
function convertLatLonToKm(lat1,lon1,lat2,lon2) {
  lat1 = parseFloat(lat1), lon1 = parseFloat(lon1), lat2 = parseFloat(lat2), lon2 = parseFloat(lon2);
  var earthRadious = 6371; // Radius of the earth in km
  var dLat = convertDegToRad(lat2-lat1);
  var dLon = convertDegToRad(lon2-lon1);
  var a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(convertDegToRad(lat1)) * Math.cos(convertDegToRad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var distance = earthRadious * c; // Distance in km
  return distance;
}

// convert degrees to radians
function convertDegToRad(deg) {
  return deg * (Math.PI/180)
}
