module.exports = {
  convertDMS:convertDMS,
  convertDMSToDD:convertDMSToDD,
  getDateHandler:getDateHandler,
  getNextMonthDate:getNextMonthDate,
  getPreviousMonthDate:getPreviousMonthDate,
  getDefinedDayDate:getDefinedDayDate,
  convertToMilliseconds:convertToMilliseconds,
  convertToCSV:convertToCSV,
  getTimeHandler:getTimeHandler,
  convertDate:convertDate,
  convertToDefault:convertToDefault,
  convertToFormat:convertToFormat,
  convertImageToBase64:convertImageToBase64
}

var XLSX = require('xlsx'),
    base64Img = require('base64-img');

//////////CONVER COORDINATES//////////
function toDegreesMinutesAndSeconds(coordinate) {
    var absolute = Math.abs(coordinate);
    var degrees  = Math.floor(absolute);
    var minutesNotTruncated = (absolute - degrees) * 60;
    var minutes  = Math.floor(minutesNotTruncated);
    var seconds  = Math.floor((minutesNotTruncated - minutes) * 60);

    return degrees + "," + minutes + "," + seconds;
}

function convertDMS(lat, lng) {
    var latitude = toDegreesMinutesAndSeconds(lat);
    var latitudeCardinal = Math.sign(lat) >= 0 ? "N" : "S";

    var longitude = toDegreesMinutesAndSeconds(lng);
    var longitudeCardinal = Math.sign(lng) >= 0 ? "E" : "W";

    return [latitudeCardinal + "|" +latitude, longitudeCardinal + "|" + longitude];
}

//36,9.43543,45.54 -> 54.453
function convertDMSToDD(degrees, minutes, seconds, direction) {
    var dd = degrees + minutes/60 + seconds/(60*60);

    if (direction == "S" || direction == "W") {
        dd = dd * -1;
    } // Don't do anything for N or E
    return dd;
}

//////////CONVERT DATES//////////
var monthAbrevNames = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

//Tue Feb 01 2000 00:00:00 GMT+0000 (WET) -> 2000:02:01
function getDateHandler(date){
  var dateArray = date.split(' ');
  var year      = dateArray[3];
  var month     = getIndexByMonthName(dateArray[1]);
  var day       = dateArray[2];

  if (month < 10)
    month = '0' + month;

  return year + ":" + month + ":" + day;
}

//ex: 2017:01:31 -> 31 Jan 2017
function convertDate(date){
  var dateArray  = date.split(':');
  var year  = dateArray[0];
  var month = dateArray[1];
  var day   = dateArray[2];

  return day + " " + monthAbrevNames[parseInt(month) - 1] + " " + year;
}

//Tue Feb 01 2000 00:00:00 GMT+0000 (WET) -> 00:00:00
function getTimeHandler(date){
  var dateArray = date.split(' ');

  return dateArray[4];
}

function getIndexByMonthName(monthName){
  var monthNames = ["Jan", "Feb", "Mar","Apr", "May", "Jun", "Jul","Aug", "Sep", "Oct","Nov", "Dec"];
  for (var index = 0; index < monthNames.length; index++) {
    if(monthNames[index] == monthName)
      return index+1;
  }
}

function convertToMilliseconds(hours, minutes){
  return hours * 3600000 + minutes * 60000;
}

//2017:02:02 -> 2017-02-02T00:00:00.000Z
function convertToDefault(date){
  return new Date(date.replace(/:/g, ',')); //2000:01:01 -> 2000,01,01 -> 2000-01-01T00:00:00.000Z
}

//2017-02-02T00:00:00.000Z -> 2017:02:02
function convertToFormat(date){
  date = date.split('T')[0];
  return date.replace(/,/g, ':');
}

function getNextMonthDate(date){
  var year  = date.split(':')[0];
  var month = date.split(':')[1];

  if (parseInt(month) == 12){
    month = '01';
    year  = parseInt(month)+1;
  }else if(parseInt(month) < 9)
    month = '0' + (parseInt(month)+1);
  else
    month = (parseInt(month)+1);

  return year + ':' + month;
}

function getPreviousMonthDate(date, decreaseNumber){
  var year  = date.split(':')[0];
  var month = date.split(':')[1];

  if (parseInt(month) - decreaseNumber < 1){
    month = 12 + (parseInt(month) - decreaseNumber);
    year  = parseInt(year) - 1;
  }else if(parseInt(month) - decreaseNumber < 10)
    month = '0' + (parseInt(month) - decreaseNumber);
  else
    month = (parseInt(month) - decreaseNumber);

  return year + ':' + month;
}

function getDefinedDayDate(date, number){
  var year        = date.split(':')[0];
  var month       = date.split(':')[1];
  var day         = date.split(':')[2];
  var currentDate = new Date(year, month, day);

  currentDate.setDate(currentDate.getDate()+number);
  currentDate = (currentDate + '').split(' ');

  month       = getIndexByMonthName(currentDate[1])-1;
  day         = currentDate[2];
  year        = currentDate[3];

  if (month < 10)
    month = '0' + month
  return year + ':' + month + ':' + day ;
}

//////////CONVERT FILES//////////
function convertToCSV(file){
  var workbook = XLSX.readFile(file);
  var first_sheet_name = workbook.SheetNames[0];
  var worksheet = workbook.Sheets[first_sheet_name];
  var csv = XLSX.utils.sheet_to_csv(worksheet);

  csv = csv.replace(/(,,,,+\n)|(\')/gm, "\n");                 //Remove empty lines
  csv = csv.replace(/(^,)/gm, "-,");                           //After the removal of empty lines insert - between comas (error avoidance)
  csv = csv.replace(/(,,)/gm, ",-,");
  csv = csv.replace(/(,\n+)/gm, ",-\n");
  csv = csv.replace(/(^\n$)/gm, "");

  return csv;
}

//////////CONVERT IMAGES//////////
function convertImageToBase64(imgsSource, index, imgsContent, callback){
  console.log(index);
console.log(imgsSource[0]);
  if (index == imgsSource.length) {
    callback(imgsContent);
    return;
  }

  base64Img.base64(imgsSource[index], function(err, data) {                             //encode image by image path
    if(err) console.log("Error in base 64 encoder: "+err);                      //report if error
    imgsContent.push(data);
    convertImageToBase64(imgsSource, index+1, imgsContent, callback);
  });
}
