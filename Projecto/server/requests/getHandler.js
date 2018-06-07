module.exports = {
  getHandler:getHandler,
  getMapHandler:getMapHandler
}

var startDate;
var endDate;

var db = require('../dbCalls.js'),
    dbQueries = require('../dbQueries.js'),
    dbInfo = require('../dbInfo.js'),
    dbAux = require('../dbCallsAux.js'),
    conversion = require('../general/conversion.js'),
    fileHandler = require('../file/fileHandler.js'),
    pg = require('pg');

//function called when open popups from maps
function getMapHandler(params, res){
  console.log('getMapHandler');
  var dates = params.dates.split(',');
  startDate = conversion.getDateHandler(dates[0]);
  endDate   = conversion.getDateHandler(dates[1]);

  var parameters     = params.params.split(','); //ex: Marys Home,LatLng(38.72485, -9.15329),photos
  var description    = parameters[0];
  var lat            = parameters[1].replace('LatLng(', "");  //ex: 38.7189
  var lng            = parameters[2].replace(')', "");        //ex: -9.16484
  var type           = parameters[3];                         //photos or location
  var zoomType       = parameters[4];
  var zone           = parameters[5]; //street, city or country
  var startingIndex  = parameters[6]; //starting index to select photos

  var photosDistance = 100;//0.1km
  var photosQuery, infoQuery;

  var numberOfPhotos = (description == 'loadMoreFotos') ? 1 : 3;

  if(params.dataType == "popup"){
    if (zoomType == 'street') {
      infoQuery   = "SELECT filename, sum(hour) AS hours, sum(minutes) AS minutes, COUNT(activity) AS timesThere, MIN(timestamp) AS StartDate, MAX(timestamp) AS EndDate FROM life WHERE activity='"+description+"' AND timestamp >= '"+ startDate +"' AND timestamp <= '"+endDate+"' GROUP BY filename;";//
      photosQuery = "SELECT DISTINCT p.* FROM photos p WHERE ST_Distance(ST_MakePoint("+lat + ", " + lng+"), ST_MakePoint(CAST(p.latitude AS FLOAT), CAST(p.longitude AS FLOAT)), false) <= "+photosDistance+" AND p.latitude != '-' AND p.longitude != '-' AND p.timestamp >= '"+ startDate +"' AND p.timestamp <= '"+endDate+"' LIMIT "+numberOfPhotos+" OFFSET "+startingIndex+" ;"; //100 are 0.1 km
    }else if (zoomType == 'city') {
      infoQuery   = "SELECT lifeTable.filename, sum(lifeTable2.hour) AS hours, sum(lifeTable2.minutes) AS minutes, COUNT(lifeTable2.activity) AS timesThere, MIN(lifeTable2.timestamp) AS StartDate, MAX(lifeTable2.timestamp) AS EndDate FROM life lifeTable, life lifeTable2 WHERE lifeTable.city='"+description+"' AND lifeTable.tags = lifeTable2.activity AND lifeTable2.type='Span' AND lifeTable2.timestamp >= '"+ startDate +"' AND lifeTable2.timestamp <= '"+endDate+"' GROUP BY lifeTable.filename";//AND timestamp >= '"+ startDate +"' AND timestamp <= '"+endDate+"'
      photosQuery = "SELECT p.* FROM photos p WHERE p.city='"+zone+"' AND p.latitude != '-' AND p.longitude != '-' AND p.timestamp >= '"+ startDate +"' AND p.timestamp <= '"+endDate+"'  LIMIT "+numberOfPhotos+" OFFSET "+startingIndex+" ;"; //100 are 0.1 km
    }else if (zoomType == 'country') {
      infoQuery   = "SELECT lifeTable.filename, sum(lifeTable2.hour) AS hours, sum(lifeTable2.minutes) AS minutes, COUNT(lifeTable2.activity) AS timesThere, MIN(lifeTable2.timestamp) AS StartDate, MAX(lifeTable2.timestamp) AS EndDate FROM life lifeTable, life lifeTable2 WHERE lifeTable.country='"+description+"' AND lifeTable.tags = lifeTable2.activity AND lifeTable2.type='Span' AND lifeTable2.timestamp >= '"+ startDate +"' AND lifeTable2.timestamp <= '"+endDate+"' GROUP BY lifeTable.filename;";//AND timestamp >= '"+ startDate +"' AND timestamp <= '"+endDate+"'
      photosQuery = "SELECT p.* FROM photos p WHERE p.country='"+zone+"' AND p.latitude != '-' AND p.longitude != '-' AND p.timestamp >= '"+ startDate +"' AND p.timestamp <= '"+endDate+"' LIMIT "+numberOfPhotos+" OFFSET "+startingIndex+";"; //100 are 0.1 km
    }

    if (type == 'photos' && description == 'loadMoreFotos') //if is to update more photos
      infoQuery = '';
    else if (type == 'myLocation'){ //if is my location popup
      infoQuery = "SELECT tags, street, city, country, ST_Distance(ST_MakePoint("+lat +",  "+ lng+"), ST_MakePoint(CAST(lat AS FLOAT), CAST(lng AS FLOAT)), false) FROM life WHERE type='Canonical Locations' ORDER BY ST_Distance(ST_MakePoint("+lat + ", " + lng+"), ST_MakePoint(CAST(lat AS FLOAT), CAST(lng AS FLOAT)), false) LIMIT 4 OFFSET 0;";
      photosQuery = '';
    }else if (type == 'routes'){ //if is routes popup
      infoQuery = "SELECT tags FROM life WHERE activity='"+description+"' AND timestamp='"+parameters[4]+"';"; //in case of routes parameters[4] represents the timestamp
      photosQuery = '';
    }

    dbGetQuery      = photosQuery + infoQuery;
    console.log(dbGetQuery);
    getFromMultipleQueries(res, 'multiple', params, dbGetQuery);
  }
}

//Function that handles get requests
//params = {dates:"",dataType:"", numberInfoLoadedDB:""}
function getHandler(params, res){
  console.log('getHandler');
  var dates = params.dates.split(',');
  startDate = conversion.getDateHandler(dates[0]);
  endDate   = conversion.getDateHandler(dates[1]);

  var multiParams = params.params.split(',');

  if (params.dataType == "definitions"){
    getDefinitions(res, params);
    return;
  }
//console.log(params);
  var dbGetQuery, tableColumn, parameters = params.params.split(",");
  if(params.params == "types"){
    dbGetQuery = "SELECT * FROM types WHERE type='number' OR type='string'";
    getFromQuery(res, params, dbGetQuery);
  }else if(params.params == "files"){ //for visualizations preview
    dbGetQuery = getNonImageAndGPSFilesQuery();
    getFromQuery(res, params, dbGetQuery);
  }else if (multiParams[0] == "variables"){
    dbGetQuery = getVariablesQuery(params, multiParams);
    getFromQuery(res, params, dbGetQuery);
  }else if(params.dataType == "remove"){ //for remove files
    dbGetQuery = getAllFiles(params.params);
    getFromQuery(res, params, dbGetQuery);
  }else if (params.dataType == "image" || params.dataType == "background"){
    getImages(res, "photos", params.params, params.dates);
    return;
  }else if (params.dataType == "barChart"|| params.dataType == "areaChart"|| params.dataType == "lineChart"){
    getQuery(res, params, ['x', 'xValues', 'y'], parameters);
  }else if (params.dataType == "pieChart" || params.dataType == "donutChart"){
    getQuery(res, params, ['label', 'xValues', 'value'], parameters);
  }else if (params.dataType == "map"){
    if (multiParams[0] == "calendarUpdate")
      getMapUpdateCalendarQuery(res, multiParams);
    else
      getMapQuery(res, params.params);
  }else if (params.dataType == "calendarHeatmap"){
    console.log('calendarHeatmap');
    getCalendarHeatmapVarType(res, params.params);
  }else {
    console.log('handler not detected');
    res.redirect('/static');
    return;
  }
}

function getQuery(res, params, asArray, parameters){
  console.log('getQuery');
  console.log(parameters[3]);
  var aggregationType = parameters[2];
  var startIndexString, stringLength;
  if (parameters[3] == "years") {
    startIndexString = 0; stringLength = 5;
  }else if (parameters[3] == "months") {
    startIndexString = 0; stringLength = 8;
  }else {
    startIndexString = 0; stringLength = 11;
  }

  pg.connect(dbInfo.connect, function(err, client, done){
    if(err){  return console.error('Error fetching client from pool', err);  }

    if ((parameters[6]).includes('.life')) {
      var dbGetQuery = "SELECT DISTINCT COUNT(activity) AS "+asArray[2]+", SUBSTRING ( timestamp ,"+startIndexString+" , "+stringLength+" ) AS "+asArray[0]+", SUBSTRING ( timestamp ,"+startIndexString+" , "+stringLength+" ) AS "+asArray[1]+" FROM life WHERE activity = '"+parameters[1]+"' AND SUBSTRING( timestamp ,"+startIndexString+" , "+stringLength+" ) >=  SUBSTRING ('"+ startDate +"',"+startIndexString+" , "+stringLength+" ) AND  SUBSTRING ( timestamp ,"+startIndexString+" , "+stringLength+" ) <= SUBSTRING ('"+endDate+"',"+startIndexString+" , "+stringLength+" ) GROUP BY SUBSTRING (timestamp,"+startIndexString+" , "+stringLength+" ) ORDER BY SUBSTRING ( timestamp ,"+startIndexString+" , "+stringLength+" );";
    //  console.log(dbGetQuery);
      db.getData(res, client, params.params, dbGetQuery, params.dataType, done);
    }else{
      dbAux.isTimestamp(client, parameters[0], function(bool){
        var dbGetQuery;
        if(bool){
          dbGetQuery = dbQueries.formulateTableQuery("general", ['timestamp', 'value'], asArray, "key='"+parameters[1]+"' AND value!='-' AND SUBSTRING ( timestamp ,"+startIndexString+" , "+stringLength+" )!='-' AND value ~ '[0-9]+' AND  SUBSTRING( timestamp ,"+startIndexString+" , "+stringLength+" ) >=  SUBSTRING ('"+ startDate +"',"+startIndexString+" , "+stringLength+" ) AND  SUBSTRING ( timestamp ,"+startIndexString+" , "+stringLength+" ) <= SUBSTRING ('"+endDate+"',"+startIndexString+" , "+stringLength+" ) ", startIndexString , stringLength, aggregationType);
        }else{
          if (parameters[3] == "days") {
            dbGetQuery = dbQueries.formulateTablesQuery(["general", "general"], ['value', 'value'], ["", "SUM(CAST( CHANGETOVALUE AS FLOAT))"], asArray, "table0.key='"+parameters[0]+"' AND table1.key='"+parameters[1]+"' AND table0.source=table1.source AND table0.timestamp=table1.timestamp AND table0.value!='-' AND table1.value!='-' AND table1.value ~ '[0-9]+' AND table0.timestamp >= '"+ startDate +"' AND table0.timestamp <= '"+endDate+"' AND table1.timestamp >= '"+ startDate +"' AND table1.timestamp <= '"+endDate+"'");
          }else {
            dbGetQuery = dbQueries.formulateTableQuery("general", ['timestamp', 'value'], asArray, "key='"+parameters[1]+"' AND value!='-' AND SUBSTRING ( timestamp ,"+startIndexString+" , "+stringLength+" )!='-' AND value ~ '[0-9]+' AND  SUBSTRING( timestamp ,"+startIndexString+" , "+stringLength+" ) >=  SUBSTRING ('"+ startDate +"',"+startIndexString+" , "+stringLength+" ) AND  SUBSTRING ( timestamp ,"+startIndexString+" , "+stringLength+" ) <= SUBSTRING ('"+endDate+"',"+startIndexString+" , "+stringLength+" ) ", startIndexString , stringLength, aggregationType);
          }
        }
        //console.log(dbGetQuery);
        db.getData(res, client, params.params, dbGetQuery, params.dataType, done);
      });
    }



  });
}

function getDefinitions(res, params){
  // pg.connect(dbInfo.connect, function(err, client, done){
  //   if(err){  return console.error('Error fetching client from pool', err);  }
  //   db.checkIfRecordExist(client, 'id', 'definitions', 'definitions.id=1', function(bool){
  //       if(bool != 'undefined' && bool!='' && bool!=null ){
  //         var dbGetQuery = "SELECT htmlcontent FROM definitions WHERE id=1";
  //         db.getData(res, client, params.params, dbGetQuery, params.dataType, done);
  //       }else
  //         res.send('DEFINITIONS EMPTY');
  //     });
  // });
}

function getAllFiles(parameters){
  var paramsArray = parameters.split(',');
  var extensions  = fileHandler.getExtensionsByType(paramsArray[1]);
  var dbGetQuery = "SELECT * FROM files WHERE filename LIKE '%" + paramsArray[2] + "%' AND (";
  for (var index = 0; index < extensions.length; index++) {
    dbGetQuery += "filename LIKE '%" + extensions[index] + "' ";
    if (index < extensions.length - 1)
      dbGetQuery += ' OR ';
    else
      dbGetQuery += ' ); ';
  }
  //console.log(dbGetQuery);
  return dbGetQuery;
}



function getNonImageAndGPSFilesQuery(){
  var imageListArray = ['jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'gif', 'GIF', 'gpx', 'GPX'];
  var dbGetQuery = "SELECT filename FROM files WHERE filename NOT LIKE '%jpg'";
  for (var index = 0; index < imageListArray.length; index++) {
    dbGetQuery += "AND filename NOT LIKE '%" + imageListArray[index] + "' ";
  }
  return dbGetQuery;
}

function getVariablesQuery(params, multiParams){
  var fileNameArray = multiParams[1].split('.');
  var fileExtension = fileNameArray[fileNameArray.length - 1];
  if (params.dataType == "calendarHeatmap") {
    if (fileExtension == 'life') {
      return "SELECT DISTINCT 'Timestamp' AS activity; SELECT DISTINCT activity AS variable FROM life WHERE type = 'Span' AND filename = '"+multiParams[1]+"' AND activity != '' AND activity != '-' ORDER BY activity; ";
    }else if (fileExtension == 'xlsx' || fileExtension == 'csv') {
      return "SELECT DISTINCT key AS activity FROM types WHERE  filename = '"+multiParams[1]+"' AND key != '' AND key != '-' AND istimestamp = 'true' ORDER BY key; SELECT DISTINCT key AS variable FROM types WHERE filename = '"+multiParams[1]+"' AND key != '' AND key != '-' AND istimestamp = 'false' AND type = 'number' ORDER BY key;";
    }
  }else /*if (params.dataType == "barChart")*/ {
    if (fileExtension == 'life') {
      return "SELECT DISTINCT 'Timestamp' AS x; SELECT DISTINCT activity AS y FROM life WHERE type = 'Span' AND filename = '"+multiParams[1]+"' AND activity != '' AND activity != '-' ORDER BY activity; ";
    }else if (fileExtension == 'xlsx' || fileExtension == 'csv') {
      return "SELECT key AS x FROM types WHERE type = 'string' AND filename = '"+multiParams[1]+"' ORDER BY key; SELECT key AS y FROM types WHERE type = 'number' AND filename = '"+multiParams[1]+"' ORDER BY key; ";
    }
  }
}

function getFromQuery(res, params, dbGetQuery){
  pg.connect(dbInfo.connect, function(err, client, done){
    if(err){  return console.error('Error fetching client from pool', err);  }
    db.getData(res, client, params.params, dbGetQuery, params.dataType, done);
  });
}

function getFromMultipleQueries(res, table, params, dbGetQuery){
  pg.connect(dbInfo.connect, function(err, client, done){
    if(err){  return console.error('Error fetching client from pool', err);  }
    db.getData(res, client, table, dbGetQuery, params.dataType, done);
  });
}

function getImages(res, table, imageParams, dates){
  var datesArray       = dates.split(',');
  startDate            = conversion.getDateHandler(datesArray[0]);
  endDate              = conversion.getDateHandler(datesArray[1]);
  var imageParamsArray = imageParams.split(',');
  pg.connect(dbInfo.connect, function(err, client, done){
    if(err){  return console.error('Error fetching client from pool', err);  }
    var dbGetQuery;
    if (imageParamsArray.length == 1)//get images for background and visualization images
      dbGetQuery = "SELECT * FROM " + table + " WHERE id <= " + (parseInt(imageParamsArray[0])+9) + " AND id > " + parseInt(imageParamsArray[0]);
    else if (imageParamsArray.length == 2)//get images for map
      dbGetQuery = "SELECT * FROM " + table + " WHERE timestamp >= '"+startDate+"' AND timestamp <= '"+endDate+"';";
    else if (imageParamsArray.length > 2 && imageParamsArray[2] == '')//get images in search
      dbGetQuery = "SELECT * FROM " + table + " WHERE id <= " + (parseInt(imageParamsArray[0])+9) + " AND id > " + parseInt(imageParamsArray[0]);
    else if (imageParamsArray.length > 2 && imageParamsArray[2] != ''){//get images in search
      var searchName = imageParamsArray[2].toLowerCase();
      dbGetQuery = "SELECT searchedPhotos.* FROM (SELECT * FROM photos WHERE LOWER(filename) LIKE '%"+searchName+"%') AS searchedPhotos ORDER BY id DESC LIMIT 9 OFFSET "+imageParamsArray[0]+" ;"
    }
    console.log(dbGetQuery);
    db.getData(res, client, table, dbGetQuery, "", done);
  });
}

function getMapQuery(res, parameters){
  console.log('getMapQuery');
  pg.connect(dbInfo.connect, function(err, client, done){
    console.log('!!!!!!!!!!!!!parameters');
    console.log(parameters);
    if(err){  return console.error('Error fetching client from pool on map query', err);  }
    var dbGetQuery = '';
    if (/photo/i.test(parameters))
      dbGetQuery += getMapPhotosQuery(parameters);
    if(/location/i.test(parameters))
      dbGetQuery += getMapLocationsQuery(parameters);
    if(/route/i.test(parameters))
      dbGetQuery += "SELECT gpxTable.*, res.routesNumber FROM gpx gpxTable, (SELECT COUNT(*) routesNumber FROM gpx gpxTable2 WHERE gpxTable2.timestamp >= '"+ startDate +"' AND gpxTable2.timestamp <= '"+endDate+"') res WHERE gpxTable.timestamp >= '"+ startDate +"' AND gpxTable.timestamp <= '"+endDate+"' ORDER BY gpxTable.id;";

    db.getData(res, client, 'multiple', dbGetQuery, "", done);
  });
}

function getMapLocationsQuery(parameters){
  console.log('getMapLocationsQuery');
  var locationQuery, params = parameters.split(',');

  if (params[0] == 'photo' || params[0] == 'location' || params[0] == 'route' || params[0] == 'street') {
    locationQuery = "SELECT lifeTable.tags AS location, lifeTable.descriptions,  lat AS latAVG, lng AS lngAVG , res.locationNumber FROM life lifeTable, (SELECT COUNT(*) locationNumber FROM life lifeTable2 WHERE lifeTable2.type = 'Canonical Locations' AND (SELECT COUNT(*) FROM life lifeTable3 WHERE lifeTable3.timestamp >= '"+ startDate +"' AND lifeTable3.timestamp <= '"+endDate+"' AND lifeTable2.tags = lifeTable3.activity) > 0) res WHERE type = 'Canonical Locations' AND (SELECT COUNT(*) FROM life lifeTable4 WHERE lifeTable4.timestamp >= '"+ startDate +"' AND lifeTable4.timestamp <= '"+endDate+"' AND lifeTable.tags = lifeTable4.activity) > 0;"
  }else if (params[0] == 'city') {
    locationQuery = "SELECT lifeTable.city AS location,  AVG(lifeTable.lat) AS latAVG, AVG(lifeTable.lng) AS lngAVG , res.locationNumber FROM life lifeTable, life lifeTable5, (SELECT COUNT(*) locationNumber FROM life lifeTable2, life lifeTable3  WHERE lifeTable2.type = 'Canonical Locations' AND lifeTable3.type = 'Canonical Locations'  AND lifeTable2.city = lifeTable3.city AND (SELECT COUNT(*) FROM life lifeTable4 WHERE lifeTable4.timestamp >= '"+ startDate +"' AND lifeTable4.timestamp <= '"+endDate+"'  AND lifeTable4.activity = lifeTable2.tags AND lifeTable4.type = 'Span') > 0) res WHERE lifeTable.type = 'Canonical Locations' AND lifeTable5.type = 'Canonical Locations'  AND lifeTable.city = lifeTable5.city AND (SELECT COUNT(*) FROM life lifeTable6 WHERE lifeTable6.timestamp >= '"+ startDate +"' AND lifeTable6.timestamp <= '"+endDate+"'  AND lifeTable6.activity = lifeTable.tags AND lifeTable6.type = 'Span') > 0 GROUP BY lifeTable.city, res.locationNumber;";
  }else if (params[0] == 'country') {
    locationQuery = "SELECT lifeTable.country AS location,  AVG(lifeTable.lat) AS latAVG, AVG(lifeTable.lng) AS lngAVG , res.locationNumber FROM life lifeTable, life lifeTable5, (SELECT COUNT(*) locationNumber FROM life lifeTable2, life lifeTable3  WHERE lifeTable2.type = 'Canonical Locations' AND lifeTable3.type = 'Canonical Locations'  AND lifeTable2.country = lifeTable3.country AND (SELECT COUNT(*) FROM life lifeTable4 WHERE lifeTable4.timestamp >= '"+ startDate +"' AND lifeTable4.timestamp <= '"+endDate+"'  AND lifeTable4.activity = lifeTable2.tags AND lifeTable4.type = 'Span') > 0) res WHERE lifeTable.type = 'Canonical Locations' AND lifeTable5.type = 'Canonical Locations'  AND lifeTable.country = lifeTable5.country AND (SELECT COUNT(*) FROM life lifeTable6 WHERE lifeTable6.timestamp >= '"+ startDate +"' AND lifeTable6.timestamp <= '"+endDate+"'  AND lifeTable6.activity = lifeTable.tags AND lifeTable6.type = 'Span') > 0 GROUP BY lifeTable.country, res.locationNumber;";
  }

  return locationQuery;
}

function getMapPhotosQuery(parameters){
  console.log('getMapPhotosQuery');
  var photosQuery, params = parameters.split(',');
  //console.log('params[0]');
//console.log(params[0]);
  if (params[0] == 'photo' || params[0] == 'location' || params[0] == 'route' || params[0] == 'street') {
    photosQuery = "SELECT 'photos' AS photos, 'street' AS type, photosTable.street AS location, CAST(photosTable.latitude AS FLOAT) AS latAvg, CAST(photosTable.longitude AS FLOAT) AS lngAvg, res.photosNumber FROM photos photosTable, (SELECT COUNT(*) photosNumber FROM photos WHERE latitude != '-' AND longitude != '-' AND timestamp >= '"+ startDate +"' AND timestamp <= '"+endDate+"') res WHERE latitude != '-' AND longitude != '-' AND timestamp >= '"+ startDate +"' AND timestamp <= '"+endDate+"';";
  }else if (params[0] == 'city') {
    photosQuery = "SELECT 'photos' AS photos, 'city' AS type, photosTable.city AS location, AVG(CAST(photosTable.latitude AS FLOAT)) AS latAvg, AVG(CAST(photosTable.longitude AS FLOAT)) AS lngAvg, (SELECT COUNT(*) FROM photos WHERE latitude != '-' AND longitude != '-' AND timestamp >= '"+ startDate +"' AND timestamp <= '"+endDate+" AND city = photosTable.city') AS photosNumber FROM photos photosTable WHERE photosTable.latitude != '-' AND photosTable.longitude != '-' AND photosTable.timestamp >= '"+ startDate +"' AND photosTable.timestamp <= '"+endDate+"' GROUP BY photosTable.city;";

    //"SELECT lifeTable.city AS location,  AVG(lifeTable.lat) AS latAVG, AVG(lifeTable.lng) AS lngAVG , res.locationNumber FROM life lifeTable, life lifeTable5, (SELECT COUNT(*) locationNumber FROM life lifeTable2, life lifeTable3  WHERE lifeTable2.type = 'Canonical Locations' AND lifeTable3.type = 'Canonical Locations'  AND lifeTable2.city = lifeTable3.city AND (SELECT COUNT(*) FROM life lifeTable4 WHERE lifeTable4.timestamp >= '"+ startDate +"' AND lifeTable4.timestamp <= '"+endDate+"'  AND lifeTable4.activity = lifeTable2.tags AND lifeTable4.type = 'Span') > 0) res WHERE lifeTable.type = 'Canonical Locations' AND lifeTable5.type = 'Canonical Locations'  AND lifeTable.city = lifeTable5.city AND (SELECT COUNT(*) FROM life lifeTable6 WHERE lifeTable6.timestamp >= '"+ startDate +"' AND lifeTable6.timestamp <= '"+endDate+"'  AND lifeTable6.activity = lifeTable.tags AND lifeTable6.type = 'Span') > 0 GROUP BY lifeTable.city, res.locationNumber;";
  }else if (params[0] == 'country') {
    photosQuery = "SELECT 'photos' AS photos, 'country' AS type, photosTable.country AS location, AVG(CAST(photosTable.latitude AS FLOAT)) AS latAvg, AVG(CAST(photosTable.longitude AS FLOAT)) AS lngAvg, (SELECT COUNT(*) FROM photos WHERE latitude != '-' AND longitude != '-' AND timestamp >= '"+ startDate +"' AND timestamp <= '"+endDate+" AND country = photosTable.country') AS photosNumber FROM photos photosTable WHERE photosTable.latitude != '-' AND photosTable.longitude != '-' AND photosTable.timestamp >= '"+ startDate +"' AND photosTable.timestamp <= '"+endDate+"' GROUP BY photosTable.country;";
    //"SELECT lifeTable.country AS location,  AVG(lat) AS latAVG, AVG(lng) AS lngAVG FROM life lifeTable GROUP BY lifeTable.country;";
  }

  return photosQuery;
  //return "SELECT photosTable.*, res.photosNumber FROM photos photosTable, (SELECT COUNT(*) photosNumber FROM photos WHERE latitude != '-' AND longitude != '-' AND timestamp >= '"+ startDate +"' AND timestamp <= '"+endDate+"') res WHERE latitude != '-' AND longitude != '-' AND timestamp >= '"+ startDate +"' AND timestamp <= '"+endDate+"';";
}

function getMapUpdateCalendarQuery(res, params){
  pg.connect(dbInfo.connect, function(err, client, done){
    var activity = params[1];
    var dbGetQuery = "SELECT * FROM life WHERE activity = '"+ activity +"'; ";
    //console.log(dbGetQuery);
    console.log('getMapUpdateCalendarQuery');
    db.getData(res, client, 'life', dbGetQuery, '', done);
  });
}

function getCalendarHeatmapVarType(res, parameters){
  var paramsArray = parameters.split(','), filename = paramsArray[6].split('.'), extension = filename[filename.length - 1];
  var table = getTableByFileExtension(extension);
  pg.connect(dbInfo.connect, function(err, client, done){
    if(err){  return console.error('Error fetching client from pool on calendar heatmap query', err);  }
      if(table == 'general')//get from general
        dbAux.varIsNumber(client, res, done, parameters, getCalendarHeatmapQuery);
      else if(table == 'life')
        getCalendarHeatmapQuery(client, res, done, parameters, false);
  });
}

function getCalendarHeatmapQuery(client, res, done, parameters, varIsNumber){
  console.log('getCalendarHeatmapQuery');
  //console.log('parameters: ' + parameters);

  var paramsArray = parameters.split(','), filename = paramsArray[6].split('.'), extension = filename[filename.length - 1];
  var table = getTableByFileExtension(extension);
  var activityColumn = getActivityColumnNameByTable(table);

  var type = (paramsArray[8] != null) ? paramsArray[8] : null; //city or country

  var dbGetQuery;

  if (type != null && type != 'street') { //calendar for map popups
    dbGetQuery = "SELECT DISTINCT table1.timestamp AS date, (SELECT COUNT(table2.activity) FROM "+table+" table2 INNER JOIN "+table+" table3 ON table3.tags=table2.activity WHERE table3."+paramsArray[8]+" = '"+paramsArray[1]+"' AND table2.timestamp = table1.timestamp) AS value FROM "+table+" table1, "+table+" table4 WHERE  table1.filename = '"+paramsArray[6]+"' AND table1.activity = table4.tags AND table4."+paramsArray[8]+" = '"+paramsArray[1]+"' GROUP BY table1.timestamp ORDER BY table1.timestamp;"
    dbGetQuery += "SELECT DISTINCT SUBSTRING(table1.timestamp ,0 , 8 ) AS month,  COUNT(table1.activity) AS value FROM "+table+" table1 INNER JOIN "+table+" table2 ON table2.tags=table1.activity WHERE table1.filename = '"+paramsArray[6]+"' AND table2."+paramsArray[8]+" = '"+ paramsArray[1] +"' AND SUBSTRING(table1.timestamp ,0 , 8 ) >= SUBSTRING('"+startDate+"' ,0 , 8 ) AND SUBSTRING(table1.timestamp ,0 , 8 ) <= SUBSTRING('"+endDate+"' ,0 , 8 ) GROUP BY SUBSTRING(table1.timestamp ,0 , 8 );";
    dbGetQuery += "SELECT MIN(table1.timestamp) AS mintimestamp, MAX(table1.timestamp) AS maxtimestamp, MAX((SELECT COUNT(table2.activity) FROM "+table+" table2 INNER JOIN "+table+" table3 ON table3.tags=table2.activity WHERE table3."+paramsArray[8]+" = '"+paramsArray[1]+"')) AS maxvalue FROM "+table+" table1, "+table+" table4 WHERE  table1.filename = '"+paramsArray[6]+"' AND table1.activity = table4.tags AND table4."+paramsArray[8]+" = '"+paramsArray[1]+"';"
  }else { //calendar for calendar visualizations
    if(varIsNumber){
      dbGetQuery = "SELECT DISTINCT timestamp AS date, "+paramsArray[2]+"(CAST("+activityColumn+" AS FLOAT)) AS value FROM "+table+" WHERE  filename = '"+paramsArray[6]+"' AND key = '"+ paramsArray[1] +"' AND timestamp >= '"+startDate+"' AND timestamp <= '"+endDate+"' GROUP BY timestamp ORDER BY timestamp;"
      dbGetQuery += "SELECT DISTINCT SUBSTRING(timestamp ,0 , 8 ) AS month, "+paramsArray[2]+"(CAST("+activityColumn+" AS FLOAT)) AS value FROM "+table+" WHERE  filename = '"+paramsArray[6]+"' AND key = '"+ paramsArray[1] +"' AND "+activityColumn+" != '-' AND "+activityColumn+" ~ '[0-9]+' AND SUBSTRING(timestamp ,0 , 8 ) >= SUBSTRING('"+startDate+"' ,0 , 8 ) AND SUBSTRING(timestamp ,0 , 8 ) <= SUBSTRING('"+endDate+"' ,0 , 8 ) GROUP BY SUBSTRING(timestamp ,0 , 8 );";
      dbGetQuery += "SELECT MIN(timestamp) AS mintimestamp, MAX(timestamp) AS maxtimestamp, MAX(CAST("+activityColumn+" AS FLOAT)) AS maxvalue FROM "+table+" WHERE filename = '"+paramsArray[6]+"' AND key = '"+ paramsArray[1] +"' AND timestamp >= '"+startDate+"' AND timestamp <= '"+endDate+"';";
    }else{
      dbGetQuery = "SELECT DISTINCT timestamp AS date, (SELECT COUNT("+activityColumn+") FROM "+table+" table2 WHERE table1.timestamp = table2.timestamp AND table2."+activityColumn+" = '"+paramsArray[1]+"') AS value FROM "+table+" table1 WHERE  table1.filename = '"+paramsArray[6]+"' AND table1."+activityColumn+" = '"+ paramsArray[1] +"' GROUP BY timestamp ORDER BY timestamp;"
      dbGetQuery += "SELECT DISTINCT SUBSTRING(timestamp ,0 , 8 ) AS month, COUNT("+activityColumn+") AS value FROM "+table+" WHERE  filename = '"+paramsArray[6]+"' AND "+activityColumn+" = '"+ paramsArray[1] +"' AND SUBSTRING(timestamp ,0 , 8 ) >= SUBSTRING('"+startDate+"' ,0 , 8 ) AND SUBSTRING(timestamp ,0 , 8 ) <= SUBSTRING('"+endDate+"' ,0 , 8 ) GROUP BY SUBSTRING(timestamp ,0 , 8 );";
      dbGetQuery += "SELECT MIN(timestamp) AS mintimestamp, MAX(timestamp) AS maxtimestamp, MAX((SELECT COUNT("+activityColumn+") FROM "+table+" table2 WHERE table1.timestamp = table2.timestamp AND table2."+activityColumn+" = '"+paramsArray[1]+"')) AS maxvalue FROM "+table+" table1 WHERE table1.filename = '"+paramsArray[6]+"' AND table1."+activityColumn+" = '"+ paramsArray[1] +"';";
    }
  }

//console.log(dbGetQuery);
  db.getData(res, client, table, dbGetQuery, 'calendarHeatmap:'+paramsArray[7], done);
}

function getTableByFileExtension(fileExtension){
  if (fileExtension == 'life') {
    return "life";
  }else if (fileExtension == 'xlsx' || fileExtension == 'csv') {
    return "general";
  }
}

function getActivityColumnNameByTable(table){
  if (table == 'life') {
    return "activity";
  }else if (table == 'general') {
    return "value";
  }
}
