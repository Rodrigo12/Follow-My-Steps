module.exports = {
  sortData: sortData,
  updateResults:updateResults,
  sendDataToClient:sendDataToClient,
  isTimestamp:isTimestamp,
  varIsNumber:varIsNumber,
  getTimestamp:getTimestamp
}

var resultsHandler = require('./requests/resultsHandler.js'),
    object = require('./general/object.js');
    imageFile = require('./general/image.js');

//Function that calls the correct methods according with the data requested by the client
function sortData(res, result, client, params, dataType){
  if (params == 'multiple') {                                                                    //If the client make requests to several tables, including photos, then get image data and then send data to client
    if(imageFile.numberOfImages(result.rows)){
      //console.log('imageFile.numberOfImages(result.rows)');
      //console.log(imageFile.numberOfImages(result.rows));
      imageFile.getBase64Image(res, result, 0, imageFile.numberOfImages(result.rows), "", "", "",
         function(parameters){
           sendDataToClient(res, result, params, dataType, parameters);
         }
      );
    }else{
      sendDataToClient(res, result, params, dataType, "");
    }
    return;
  }else if(params == "photos"){                            //if client requested photos
    var imagesData = "", imagesName = "", imagesPath = "";
    if(result == null)                                   //if the result is null then send the message that there are no photos in the database
      res.send('NO PHOTOS');
    else                                                 //else get image data and send it to client
      imageFile.getBase64Image(res, result, 0, result.rows.length, imagesData, imagesName, imagesPath, null);

  }else if(params == "definitions"){
    if(result == null) sendDataToClient(res, result, params, dataType, "");//if definitions results are null return

    var objBkgIndex     = object.objectArrayIndexValueInProperty(result.rows, 'type', 'background');
    var objImageIndexes = object.objectArrayIndexesValuesInProperty(result.rows, 'visualizationid', 'imageVisualization');
    if(objBkgIndex == -1 && objImageIndexes.length == 0){//if definitions results doesn't have background data return
      sendDataToClient(res, result, params, dataType, "");
      return;
    }else if(objBkgIndex > -1 && objImageIndexes.length > 0){
      base64ImagesDefinitions(res, result, 0, objImageIndexes, dataType, params, true, objBkgIndex);
    }else if(objImageIndexes.length > 0){ //if has image visualization content
      base64ImagesDefinitions(res, result, 0, objImageIndexes, dataType, params, false, -1);
    }else if(objBkgIndex > -1){//otherwise get bkg image content
      base64BkgDefinitions(res, result, objBkgIndex, dataType, params);
    }
  }else{                                                  //if the client requested for something different then photos
    sendDataToClient(res, result, params, dataType, "");
  }
}

function base64ImagesDefinitions(res, result, index, objImageIndexes, dataType, params, hasBkg, objBkgIndex){
  if (index == objImageIndexes.length) {
    if (!hasBkg)
      sendDataToClient(res, result, params, dataType, '');
    else
      base64BkgDefinitions(res, result, objBkgIndex, dataType, params);
    return;
  }

  var filesSource = JSON.parse(result.rows[objImageIndexes[index]].data);
  imageFile.simpleGetBase64Image(res, filesSource, 0, filesSource.length, '',
    function(parameters){
      result.rows[objImageIndexes[index]].data = JSON.stringify(parameters);
      base64ImagesDefinitions(res, result, index+1, objImageIndexes, dataType, params, hasBkg, objBkgIndex);
    });

  return result;
}

function base64BkgDefinitions(res, result, objBkgIndex, dataType, params){
  var objBkg           = result.rows[objBkgIndex];
  var objBkgProperties = JSON.parse(objBkg.properties);
  if (objBkgProperties.imageContent.match(/^(https:\/\/)/) || objBkgProperties.imageContent.match(/^(http:\/\/)/)) { // if is an image form the internet
    sendDataToClient(res, result, params, dataType, '');
  }else{
    imageFile.simpleGetBase64Image(res, [objBkgProperties.imageContent], 0, 1, '',
      function(parameters){
        objBkgProperties['imageBase64'] = parameters;
        result.rows[objBkgIndex].properties = JSON.stringify(objBkgProperties);
        sendDataToClient(res, result, params, dataType, parameters);
      });
  }

  return result;
}

//Function that returns whether or not the results from the database need to be updated before sending them to the client
function updateResults(params, dataType){
  if (params=='types' || params=='files' || params.split(',')[0] == 'variables')                                           //If the client requests for the types then they doesn't need to be updated regardless the visualization
    return false;
  else if (dataType == 'barChart' || dataType == 'pieChart' || dataType == 'areaChart' || dataType == 'lineChart' || dataType == 'calendarHeatmap' || params == 'mobileMap')  //If the visualization is an area chart or a line chart, update results
    return true;
  return false;
}

//Function that sends the data to client
function sendDataToClient(res, result, params, dataType, photoData){
  var results           = result.rows;
  var dataAgglomeration = params.split(",")[7];
  var paramsDates       = [params.split(",")[4], params.split(",")[5]];
  var timePeriod        = params.split(",")[3]//days, months or years

  if (dataAgglomeration == null){
    dataType          = dataType.split(':')[0];
    dataAgglomeration = dataType.split(':')[1];
  }

  if (params == 'mobileMap')
    dataType = params;

  if (updateResults(params, dataType))                                   //Update, if necessary, the data accroding with the visualization type (ex:area and line chart)
    results = resultsHandler.produceDataForClient(results, paramsDates, dataType, dataAgglomeration, timePeriod);
  if (photoData != "" && dataType == 'popup')                                                  //Check if there are image data to send and send it
    res.send(JSON.stringify([photoData, results]));
  else
    res.send(JSON.stringify(results));
}


//Function that returns if a specific key or value is timestamp
function isTimestamp(client, inputKey, callback){
  var istimestamp, dbGetQuery = "SELECT * FROM types WHERE key='"+ inputKey +"';"
  client.query(dbGetQuery, function(err, result) {
    if (err){ console.log("Is timestamp Error: " + err);  }
    istimestamp = (result.rows[0]) ? result.rows[0].istimestamp : false;
    callback(istimestamp);
  });
}

//Function that returns if a specific key or value is timestamp
function getTimestamp(client, params, callback){
  var dbGetQuery = "SELECT * FROM types WHERE source='"+ params[0] +"';"
  client.query(dbGetQuery, function(err, result) {
    if (err){ console.log("Get timestamp Error: " + err);  }
      for (var index = 0; index < result.rows.length; index++) {
        if(result.rows[index].istimestamp){
          callback(params, result.rows[index].key);
          return;
        }
      }
      console.log('Timestamp not founded');
  });
}

function varIsNumber(client, res, done, params, callback){
  var parameters = params.split(',');
  var dbGetQuery = "SELECT * FROM types WHERE filename='"+ parameters[6] +"' AND key='"+parameters[1]+"';";
  client.query(dbGetQuery, function(err, result) {
    if (err){ console.log("Get timestamp Error: " + err);  }
      if(result.rows[0].type == 'number')
        callback(client, res, done, params, true);
      else
        callback(client, res, done, params, false);
  });
}
