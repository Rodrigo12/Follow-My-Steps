module.exports = {
  getHandlerMobile:getHandlerMobile,
  generateCode:generateCode,
  validateCode:validateCode,
  getCardsHandlerMobile:getCardsHandlerMobile,
  getCardsHandlerMobileLife:getCardsHandlerMobileLife,
  getCardsHandlerMobilePhotos:getCardsHandlerMobilePhotos,
  userConnected:userConnected,
  canConnect:canConnect,
  addConnectedMobile:addConnectedMobile
}

var db = require('../dbCalls.js'),
    dbQueries = require('../dbQueries.js'),
    dbInfo = require('../dbInfo.js'),
    dbAux = require('../dbCallsAux.js'),
    conversion = require('../general/conversion.js'),
    fileHandler = require('../file/fileHandler.js'),
    geocoding = new require('reverse-geocoding'),
    application = require('../../app.js'),
    pg = require('pg');

var currentCode = '', mobilesConnected = [], MAXMOBILESCONNECTED = 5;;

function getHandlerMobile(res, params){
  var dataType = params.dataType;
  if (dataType == 'map') {//return locations, routes,
    getMobileMapInfo(res, params);
  }else if(dataType == 'popup'){
    handlePopupInfo(res, params.params);
  }
  return;
}

function userConnected(mobileUniqueID){
  for (var index = 0; index < mobilesConnected.length; index++) {
    if(mobilesConnected[index] == mobileUniqueID)
      return true;
  }
  return false;
}

function canConnect(){
  return ( MAXMOBILESCONNECTED > mobilesConnected.length) ?  true : false;
}

function addConnectedMobile(mobileUniqueID){
  if(mobileUniqueID != null && mobileUniqueID != 'null')
    mobilesConnected.push(mobileUniqueID);//add to array
}

function generateCode(res, sendToBrowser){
  currentCode = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 6; i++)
    currentCode += possible.charAt(Math.floor(Math.random() * possible.length));

  if (sendToBrowser)
    application.sendSocketMessage('mobileCodeFeedback', {name: 'Mobile Code', code: currentCode, extension: 'mobile'});

  res.send('Insert Code');
}

function validateCode(params){
  if (currentCode == params.code)
    return true;
  else
    return false;
 }

function getMobileMapInfo(res, myLocation){
  pg.connect(dbInfo.connect, function(err, client, done){
    var dbGetQuery =  getMobileMapLocationsQuery('street', myLocation);
    db.getData(res, client, 'mobileMap', dbGetQuery, "", done);
  });
}

function getMobileMapLocationsQuery(parameters, myLocation){
  var locationQuery, params = parameters.split(','), myLocation = myLocation.params.split(',');
  var maxDistance = myLocation[2];
  if (params[0] == 'photo' || params[0] == 'location' || params[0] == 'route' || params[0] == 'street'){
    locationQuery = "SELECT lifeTable.tags AS location, lifeTable.descriptions,  lat AS latAVG, lng AS lngAVG, ST_Distance(ST_MakePoint("+myLocation[0] +",  "+ myLocation[1]+"), ST_MakePoint(CAST(lat AS FLOAT), CAST(lng AS FLOAT)), false) AS distanceToMyLocation FROM life lifeTable WHERE type = 'Canonical Locations' AND ST_Distance(ST_MakePoint("+myLocation[0] +",  "+ myLocation[1]+"), ST_MakePoint(CAST(lat AS FLOAT), CAST(lng AS FLOAT)), false) < "+maxDistance+";";
    locationQuery +="SELECT lifeTable1.activity AS activity, sum(lifeTable1.hour) AS hours, sum(lifeTable1.minutes) AS minutes, COUNT(lifeTable1.activity) AS timesThere, MIN(lifeTable1.timestamp) AS StartDate, MAX(lifeTable1.timestamp) AS EndDate FROM life lifeTable1, life lifeTable2 WHERE lifeTable1.activity = lifeTable2.tags AND lifeTable2.type = 'Canonical Locations' AND ST_Distance(ST_MakePoint("+myLocation[0] +",  "+ myLocation[1]+"), ST_MakePoint(CAST(lifeTable2.lat AS FLOAT), CAST(lifeTable2.lng AS FLOAT)), false) < "+maxDistance+" GROUP BY lifeTable1.activity;";//
  }
  //console.log(locationQuery);
  return locationQuery;
}

function getMyLocationPopupInfo(res, params){
  var config = {
    'latitude':  params[1],
    'longitude': params[2]
  };

  geocoding.location(config, function (err, data){
    var myLocation = 'Unknown';
    if (err) { console.log('Error: '+ err);}
    else{ myLocation = data; }
    pg.connect(dbInfo.connect, function(err, client, done){
      var myAddress  = (myLocation.results) ? myLocation.results[0].formatted_address : 'Unknown';
      var dbGetQuery = "SELECT '"+myAddress+"' AS myLocation, '"+params[1]+"' AS lat, '"+params[2]+"' AS lng, tags, street, city, country, ST_Distance(ST_MakePoint("+params[1] +",  "+ params[2]+"), ST_MakePoint(CAST(lat AS FLOAT), CAST(lng AS FLOAT)), false) FROM life WHERE type='Canonical Locations' ORDER BY ST_Distance(ST_MakePoint("+params[1] + ", " + params[2]+"), ST_MakePoint(CAST(lat AS FLOAT), CAST(lng AS FLOAT)), false) LIMIT 4 OFFSET 0;";
      db.getData(res, client, 'mobileMapPopup', dbGetQuery, "", done);
    });
  });
}

function handlePopupInfo(res, params){
  params = params.split(',');
  if (params[0] == 'myLocation')
    getMyLocationPopupInfo(res, params);
}

//get data for cards
function getCardsHandlerMobile(res, params){
  var tag      = params.tag;
  var distance = params.distance;

  var config = {
    'latitude':  params.lat,
    'longitude': params.lng
  };

  geocoding.location(config, function (err, data){
    var myLocation = 'Unknown';
    if (err) { console.log('Error: '+ err);}
    else{ myLocation = data; }
    pg.connect(dbInfo.connect, function(err, client, done){
      var myAddress  = (myLocation.results) ? myLocation.results[0].formatted_address : 'Unknown';
      var dbGetQuery =  "SELECT '"+myAddress+"' AS myLocation, '"+params.lat+"' AS lat, '"+params.lng+"' AS lng, lat AS placeLat, lng AS placeLng, tags, street, city, country, ST_Distance(ST_MakePoint("+params.lat +",  "+ params.lng+"), ST_MakePoint(CAST(lat AS FLOAT), CAST(lng AS FLOAT)), false) FROM life WHERE type='Canonical Locations' AND ST_Distance(ST_MakePoint("+params.lat +",  "+ params.lng+"), ST_MakePoint(CAST(lat AS FLOAT), CAST(lng AS FLOAT)), false) < "+distance+"  ORDER BY ST_Distance(ST_MakePoint("+params.lat + ", " + params.lng+"), ST_MakePoint(CAST(lat AS FLOAT), CAST(lng AS FLOAT)), false) LIMIT 15;";
      if (tag!='-')
        dbGetQuery     += "SELECT sum(hour) AS hours, sum(minutes) AS minutes, COUNT(activity) AS timesThere, MIN(timestamp) AS StartDate, MAX(timestamp) AS EndDate FROM life WHERE activity='"+tag+"';";//
      db.getData(res, client, 'mobileMapCards', dbGetQuery, "", done);
    });
  });
}

function getCardsHandlerMobileLife(res, params){
  timestamp = params.timestamp;
  pg.connect(dbInfo.connect, function(err, client, done){
    var dbGetQuery =  "SELECT timestamp, initialhour, finalhour, hour, minutes, activity, tags, descriptions, type FROM life WHERE timestamp='"+timestamp+"' ORDER BY initialhour;";
    db.getData(res, client, 'mobileMapCards', dbGetQuery, "", done);
  });
}

function getCardsHandlerMobilePhotos(res, params){
  timestamp = params.timestamp;
  var numberOfImages = (params.params==0) ? 10 : 1;
  pg.connect(dbInfo.connect, function(err, client, done){
    var dbGetQuery = "SELECT * FROM photos WHERE timestamp='"+params.timestamp+"' ORDER BY RANDOM() LIMIT "+numberOfImages+" OFFSET " + params.params + ";";
    console.log(dbGetQuery);
    db.getData(res, client, 'photos', dbGetQuery, "", done);
  });
}
