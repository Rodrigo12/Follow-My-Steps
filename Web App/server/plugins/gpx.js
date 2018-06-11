module.exports = {
  formatDecoder: gpxFormatDecoder
}

var gpxParse   = require("gpx-parse"),
    conversion = require("../general/conversion.js"),
    simplify   = require('simplify-path');

//Return the gpx data ready to insert on the database
function gpxFormatDecoder(content){
  var messageArray =  content.split('|:|');
  var xmlContent = JSON.parse(messageArray[0]);
  var fileName = messageArray[1];
  var dataArray = [];
  gpxParse.parseGpx(xmlContent, function(error, data) {                         //parse data into an gpx object (ex: GpxResult {metadata: [Getter],waypoints: [Getter],routes: [Getter],tracks: [Getter] })
    if (error)   console.log("Error parsing GPX: " + error);                    //check for errors
    dataArray = sortData(data, fileName);                                       //sort the data that resulted from the parsing of xmlContent
  });
  return dataArray;
}


function sortData(data, fileName){
  var newPoints = [];

  for (var currentTrack, index = 0; index < data.tracks.length; index++) {                                                    //read all tracks
    currentTrack = data.tracks[index];
    console.log(currentTrack.name);
    for (var currentLocation, dataArray = [], latLng = [], index2 = 0; index2 < currentTrack.segments[0].length; index2++) {                   //read all segments
      currentLocation = currentTrack.segments[0][index2];
      //dataArray.push(currentLocation);
      //dataArray.push(["ADD SOURCE", fileName, conversion.getDateHandler(currentLocation.time + ""), conversion.getTimeHandler(currentLocation.time + ""), currentTrack.name, currentLocation.lat, currentLocation.lon]);     //create an array with [time, name, location]
      console.log(["ADD SOURCE", fileName, conversion.getDateHandler(currentLocation.time + ""), conversion.getTimeHandler(currentLocation.time + ""), currentTrack.name, currentLocation.lat, currentLocation.lon]);
      dataArray.push(["ADD SOURCE", fileName, conversion.getDateHandler(currentLocation.time + ""), conversion.getTimeHandler(currentLocation.time + ""), currentTrack.name, currentLocation.lat, currentLocation.lon]);     //create an array with [time, name, location]
      latLng.push([currentLocation.lat, currentLocation.lon]); //create lat long array [[38, -9], [38.1, -9,1]]
    }
//     console.log('dataArray.length == latLng.length');
//     console.log(dataArray.length +' == '+latLng.length);
//     console.log('________________________');
//     console.log('________________________');
//     console.log('dataArray');
//     console.log('________________________');
//     console.log('________________________');
//     console.log(dataArray);
//     console.log('________________________');
//     console.log('________________________');
//     console.log('points');
//     console.log('________________________');
//     console.log('________________________');
// console.log(points);
    var points = ramerDouglasPeucker(latLng);
    for (var indexPoints = 0, indexData = 0; indexPoints < points.length; indexData++) {
      if (latLng[indexData] == null) {
        indexPoints += 1;
        continue;
      }

      if (parseFloat(points[indexPoints][0]) == parseFloat(latLng[indexData][0]) && parseFloat(points[indexPoints][1]) == parseFloat(latLng[indexData][1])) {
      //  console.log('!!!!!!!!!!!insert!!!!!!!!!!!!!');
      //  console.log(latLng[indexData]);
      //  console.log(dataArray[indexData]);
        newPoints.push(dataArray[indexData]);
        indexPoints += 1;
      }
    }

    latLng = [];
  }
  //console.log(newPoints);
  console.log('done');


  return newPoints;
}

//path ex: [ [250, 150], [250, 150], [25, 25], [24, 25], [10, 10] ]
function ramerDouglasPeucker(path){
  // console.log('path');
  // console.log(path);
  var newPath = simplify.douglasPeucker(path, 0.0001);
  // console.log('newPath');
  // console.log(newPath);
  return newPath;
}
