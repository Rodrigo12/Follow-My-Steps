module.exports = {
  produceDataForClient:produceDataForClient,
  getImagesUpdateResults:getImagesUpdateResults
}

var MINBARSYEARS  = 6;
var MINBARSMONTHS = 12;
var MINBARSDAYS   = 28;

var conversion = require('../general/conversion.js');
    object     = require('../general/object.js');
    getHandler = require('./getHandler.js');

function produceDataForClient(data, dates, dataType, dataAgglomeration, timePeriod){

  var dataForClient = data;
  if (dataType == 'barChart' || dataType == 'pieChart')
    dataForClient = getArrangedData(dataForClient, dataType);
  else if (dataType == 'areaChart' || dataType == 'lineChart')
    dataForClient = getValuesForClient(dataForClient, dataType);
  else if (dataType == 'mobileMap')
    dataForClient = getValuesForMobileClient(dataForClient);

  if (dataType == 'calendarHeatmap')
    dataForClient = insertEmptyResultsCalendar(dataForClient);

  if (dataAgglomeration == 'All' && dataForClient.length != 0 && dataForClient[0].length != 0) {
    if(dataType == 'barChart')
      dataForClient = insertEmptyResultsBarCharts(dataForClient);
    else if(dataType == 'areaChart' || dataType == 'lineChart')
      dataForClient = insertEmptyResultsCharts(dataForClient, dataType);
  }else if (dataAgglomeration == 'All') {
    if(dataType == 'barChart')
      dataForClient = handleBarChartEmptyResult(dates, timePeriod);
    else if(dataType == 'areaChart' || dataType == 'lineChart')
      dataForClient = handleChartEmptyResult(dates, timePeriod, dataType);
  }

  //  console.log('Final dataForClient:');
  //  console.log(dataForClient);

  return dataForClient;
}


///////////////////ARRANGE DATA FOR CLIENT///////////////////
//arrange data for bar charts and pie charts
function getArrangedData(data, dataType){
    var variablesArray = (dataType == 'barChart') ? ['x', 'xvalues'] : ['label', 'xvalues'];
    var insertData = [];
    for (var lastObj, lastObjIndex, currentObj, index = 0; index < data.length; index++) {
        currentObj = data[index];
        if(!detectSameDay(lastObj, currentObj, variablesArray[0])){ //if not in the same day, insert on the array
          insertData.push(data[index]);
          lastObj      = currentObj;
          lastObjIndex = insertData.length-1;
        }else if(!detectOutliers(lastObj, currentObj, variablesArray[0], variablesArray[1]))  //if the same day but different values, add info to xvalues
          insertData[lastObjIndex].xvalues += ' </br> ' + currentObj.xvalues;
      }
      return insertData;
}

function getValuesForMobileClient(data){
  var dataForClient = [];
  for (var index = 0; index < data.length; index++) {
    if (data[index].hasOwnProperty('activity'))//don't loop through obj with activity property because we're going to joint information below
      continue;

    var obj = object.getObjWithValueInArray(data, 'activity', data[index].location);
    if (obj == null) {
      data[index]['hours']      = 0;
      data[index]['minutes']    = 0;
      data[index]['timesthere'] = 0;
      data[index]['startdate']  = 'No records';
      data[index]['enddate']    = 'No records';
    }else{
      data[index]['hours']      = obj['hours'];
      data[index]['minutes']    = obj['minutes'];
      data[index]['timesthere'] = obj['timesthere'];
      data[index]['startdate']  = conversion.convertDate(obj['startdate']);
      data[index]['enddate']    = conversion.convertDate(obj['enddate']);
    }

    dataForClient.push(data[index]);
  }
  return dataForClient;
}

//arrange data for area charts and line charts
function getValuesForClient(data, type){
  var dataForClient = [], timestamp = [], dataContent = [], description = [], lastInsertedIndex = 0, lastTimestamp = '', lastValue =  '', numberElementsInserted = 0;
  for (var dataArray, index = 0; index < data.length; index++) {
    dataArray = (type=='areaChart') ? [numberElementsInserted, data[index].y] : {x:numberElementsInserted, y:data[index].y};
    if (lastTimestamp != data[index].x ) { //dont insert repeated data
      dataContent.push(dataArray);
      timestamp.push(data[index].x);
      description.push(data[index].xvalues);
      lastTimestamp = data[index].x;
      lastValue     = data[index].y;
      lastInsertedIndex = description.length-1;
      numberElementsInserted++;
    }else {
      description[lastInsertedIndex] += ' </br> ' + data[index].xvalues;
      lastValue = data[index].y;
    }
  }
  dataForClient.push(timestamp);
  dataForClient.push(dataContent);
  dataForClient.push(description);
  return dataForClient;
}

function detectSameDay(obj1, obj2, property){
  if (obj1 == null || obj2 == null)
    return false;

  if (obj1[property] == obj2[property])
    return true;
  return false;
}

function detectOutliers(obj1, obj2, property1, property2){
  if (obj1 == null || obj2 == null)
    return false;

  if (obj1[property1] == obj2[property1] && obj1[property2] == obj2[property2])
    return true;
  return false;
}

//when the users trigger a time event this function return the images for the visualization image according with time and the number of images in the visualization
function getImagesUpdateResults(requestedParams, results){
  var numberOfImages = requestedParams.params.split(',')[1];
  var finalResults   = [];
  for (var index = 0; index < parseInt(numberOfImages); index++) {
    if (results[index] != null)
      finalResults.push(results[index]);
  }
  return finalResults;
}


///////////////////INSERT EMPTY RESULTS ON DATA FOR CLIENT///////////////////
//return all data with empty values for area chart and line chart
function insertEmptyResultsCharts(data, dataType){
  var mintimestamp = data[0][0];
  var maxtimestamp = data[0][data[0].length-1];
  var timestampType;

  if (mintimestamp.length == 4)
    timestampType = 'years';
  else if (mintimestamp.length == 7)
    timestampType = 'months';
  else{
    timestampType = 'days';
    mintimestamp = conversion.convertToDefault(mintimestamp);
    maxtimestamp = conversion.convertToDefault(maxtimestamp);
  }

  var insertedData = [[], [], []];
  insertedData[0].push(data[0][0]);
  insertedData[1].push(data[1][0]);
  insertedData[2].push(data[2][0]);
  for(var currentDate = mintimestamp, nextDate = mintimestamp, index = 0; currentDate.toString() != maxtimestamp.toString(); currentDate = nextDate) {
    if (timestampType == 'years' || timestampType == 'months') {
      nextDate = (timestampType == 'years') ? parseInt(currentDate) + 1 : conversion.getNextMonthDate(currentDate);
      // if the next day of the current date is equal to the next date on the array
      if (nextDate.toString() == data[0][index+1]){
        insertedData[0].push(data[0][index+1]);
        insertedData[1].push(data[1][index+1]);
        insertedData[2].push(data[2][index+1]);
        index++;
      }else {
        insertedData[0].push(nextDate);
        insertedData[2].push('');
        if (dataType == 'areaChart')
          insertedData[1].push([0, 0]);
        else if (dataType == 'lineChart')
          insertedData[1].push({x:0, y:0});
      }
    }else if (timestampType == 'days') {
      nextDate.setDate(currentDate.getDate() + 1);
      if (nextDate.toString() == conversion.convertToDefault(data[0][index+1]).toString()){
        insertedData[0].push(data[0][index+1]);
        insertedData[1].push(data[1][index+1]);
        insertedData[2].push(data[2][index+1]);
        index++;
      }else {
        insertedData[0].push(conversion.getDateHandler(currentDate+1));
        insertedData[2].push('');
        if (dataType == 'areaChart')
          insertedData[1].push([0, 0]);
        else if (dataType == 'lineChart')
          insertedData[1].push({x:0, y:0});
      }
    }
  }
  for (var index = 0; index < insertedData[1].length; index++) {
    if (dataType == 'areaChart')
      insertedData[1][index][0] = index;
    else if (dataType == 'lineChart')
      insertedData[1][index].x = index;
  }

  return insertedData;
}


//return all data with empty values for bar chart
function insertEmptyResultsBarCharts(data){
  var mintimestamp = data[0].x;
  var maxtimestamp = data[data.length-1].x;
  var timestampType, minBars;

  if (mintimestamp.length == 4){
    timestampType = 'years';
    minBars = MINBARSYEARS;
  }else if (mintimestamp.length == 7){
    timestampType = 'months';
    minBars = MINBARSMONTHS;
  }else{
    timestampType = 'days';
    mintimestamp = conversion.convertToDefault(mintimestamp);
    maxtimestamp = conversion.convertToDefault(maxtimestamp);
    minBars = MINBARSDAYS;
  }

  var insertedData = [];
  insertedData.push(data[0]);
  for(var currentDate = mintimestamp, nextDate = mintimestamp, index = 0; currentDate.toString() != maxtimestamp.toString(); currentDate = nextDate) {
    if (timestampType == 'years' || timestampType == 'months') {
      nextDate = (timestampType == 'years') ? parseInt(currentDate) + 1 : conversion.getNextMonthDate(currentDate);
      if (nextDate.toString() == data[index+1].x){
        insertedData.push({'x':data[index+1].x, 'xvalues':data[index+1].xvalues, 'y':data[index+1].y});
        index++;
      }else
        insertedData.push({'x':nextDate, 'xvalues':parseInt(currentDate) + 1, 'y':0});
    }else if (timestampType == 'days') {
      nextDate.setDate(currentDate.getDate() + 1);
      if (nextDate.toString() == conversion.convertToDefault(data[index+1].x).toString()){
        insertedData.push({'x':data[index+1].x, 'xvalues':data[index+1].xvalues, 'y':data[index+1].y});
        index++;
      }else {
        insertedData.push({'x':conversion.getDateHandler(currentDate+1), 'xvalues':conversion.getDateHandler(currentDate+1), 'y':0});
      }
    }
  }

  //add minimal bar number
  if (data.length < minBars) { //minBars = MINBARSDAYS || minBars = MINBARSMONTHS || minBars = MINBARSYEARS
    for (var index = 0, valueIndex = 0, halfSize = Math.round((minBars-data.length)/2); index < minBars - data.length; index++) {
      if (timestampType == 'years'){
        if (halfSize > index && index!=0) {//insert years before data
          insertedData.unshift({'x':parseInt(data[0].x)-index, 'xvalues':parseInt(data[0].x)-index, 'y':0});
        }else if(halfSize <= index){//insert years after data
          insertedData.push({'x':parseInt(data[data.length-1].x)+((index+1)-halfSize), 'xvalues':parseInt(data[data.length-1].x)+((index+1)-halfSize), 'y':0});
        }
      }else if (timestampType == 'months'){
        if (halfSize > index) {//insert months before data
          insertedData.unshift({'x':conversion.getPreviousMonthDate(data[0].x, index+1), 'xvalues':conversion.getPreviousMonthDate(data[0].x, index+1), 'y':0});
        }else if(halfSize <= index){//insert months after data
          insertedData.push({'x':conversion.getPreviousMonthDate(data[data.length-1].x, -((index+1)-halfSize)), 'xvalues':conversion.getPreviousMonthDate(data[data.length-1].x, -((index+1)-halfSize)), 'y':0});
        }
      }else if (timestampType == 'days'){
        if (halfSize > index) {//insert months before data
          insertedData.unshift({'x':conversion.getDefinedDayDate(data[0].x, -index), 'xvalues':conversion.getDefinedDayDate(data[0].x, -index), 'y':0});
        }else if(halfSize <= index){//insert months after data
          insertedData.push({'x':conversion.getDefinedDayDate(data[data.length-1].x, ((index+1)-halfSize)), 'xvalues':conversion.getDefinedDayDate(data[data.length-1].x, ((index+1)-halfSize)), 'y':0});
        }
      }
    }
  }
  return insertedData;
}


function handleBarChartEmptyResult(dates, timePeriod){
  var firstDateArray = conversion.getDateHandler(dates[0]);
  var endDateArray   = conversion.getDateHandler(dates[1]);

  if (timePeriod=='months') {
    firstDateArray = firstDateArray.substring(0, 7);
    endDateArray   = endDateArray.substring(0, 7);
  }

  return [{'x':firstDateArray, 'xvalues':firstDateArray, 'y':0}, {'x':endDateArray, 'xvalues':endDateArray, 'y':0}];
}

function handleChartEmptyResult(dates, timePeriod, dataType){
  var firstDateArray = conversion.getDateHandler(dates[0]);
  var endDateArray   = conversion.getDateHandler(dates[1]);

  if (timePeriod=='months') {
    firstDateArray = firstDateArray.substring(0, 7);
    endDateArray   = endDateArray.substring(0, 7);
  }

  if(dataType=="areaChart") return [[firstDateArray, endDateArray], [[0, 0], [1, 0]], ['', '']];
  if(dataType=="lineChart") return [[firstDateArray, endDateArray], [{x:0, y:0}, {x:1, y:0}], ['', '']];

  return [[], [], []];
}


//return all data with empty values for calendar heatmap
function insertEmptyResultsCalendar(data){
  var mintimestamp = conversion.convertToDefault(data[data.length-1].mintimestamp);
  var maxtimestamp = conversion.convertToDefault(data[data.length-1].maxtimestamp);

  var insertedData = [];
  insertedData.push(data[0]);
  for(var currentDate = mintimestamp, nextDate = mintimestamp, index = 0; currentDate.toString() != maxtimestamp.toString(); currentDate = nextDate) {
    nextDate.setDate(currentDate.getDate() + 1);

    // if the current date next day is equal to the next date on the array
    if (nextDate.toString() == conversion.convertToDefault(data[index+1].date).toString()){
      insertedData.push({'date':data[index+1].date, 'value':data[index+1].value});
      index++;
    }else {
      insertedData.push({'date':conversion.getDateHandler(currentDate+1), 'value':NaN});
    }
  }

  //Also insert the month agglomeration data for calendar
  var monthHighestValue = 0;
  for (var index = data.length - 2; index > 0; index--) {
    if (data[index].hasOwnProperty('month')){
      insertedData.push({'month': data[index].month + ':01', 'value': data[index].value});
      if(data[index].value > monthHighestValue)
        monthHighestValue = data[index].value;
    }else break;
  }

  //add month Highest Value to the last object
  data[data.length-1]['monthHighestValue'] = monthHighestValue;
  insertedData.push(data[data.length-1]);
  return insertedData;
}
