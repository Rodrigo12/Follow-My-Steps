module.exports = {
  formatDecoder: csvFormatDecoder
}

//Return the csv data ready to insert on the database
function csvFormatDecoder(content){
  var body = (content).split('/|/');
  var messageArray = body[0].split('|:|');
  var message = JSON.parse(messageArray[0]);
  var fileName = messageArray[1];
  var timestampText = body[1];

  var databaseData = sortData(message, fileName, timestampText);
  return databaseData;
}

//Returns the an array with the data to insert in the database
function sortData(message, fileName, timestampText){
  var data = [], sentences = message.split("\n");                                       //split csv file by line "\n"
  var columnData = getColumnsIndex(sentences[0], timestampText);                        //function that get an object with the columns and their indexes and the index of the timestamp column
  var columnIndexedObj = columnData[0], timestampIndex = columnData[1];                 //insert the object in columnIndexedObj and the index of the timestamp in the timestampIndex
  for (var timestampValue, columns, index = 1; index < sentences.length-1; index++) {   //ignore the first row "title of each row" and atom inserts an empty line, so ends in sentences.length-1
    columns = sentences[index].split(",");                                              //each line values ex: ["Restaurante Marco Santos", "25/11/2014", "20:34", ...]
    timestampValue = columns[timestampIndex].trim();                                    //get the timestamp value ex: if timestamp = "Day" then columns[timestampIndex] = "25-11-2014"
    for (var index2 = 0; index2 < columns.length; index2++) {
      if(index2 != timestampIndex){                                                     //if index2 is equal to the timestampIndex then don't save it
        if(columns[index2] == "") columns[index2] = "-";                                //can't store null values
        else if(!isNaN(columns[index2].replace(/\$|£|€/gi, "")))
          columns[index2]=columns[index2].replace(/\$|£|€/gi, "");
        data.push(["ADD SOURCE", fileName, convertToDateFormat(timestampValue), columnIndexedObj[index2], columns[index2]]); //ex: data.push(["25/11/2014", "Restaurant", "Restaurante Marco Santos", "johnDoe.csv"])
        //console.log(timestampValue +" | "+ columnIndexedObj[index2] +" | "+ columns[index2]);
      }
    }
  }
  return data;
}

//Get an object with the columns and their indexes and the index of the timestamp column
function getColumnsIndex(sentence, timestampText){
  var timestampIndex, columnIndex = {}, columns = sentence.split(",");
  for (var index = 0; index < columns.length; index++) {
    if(timestampText.trim() == columns[index].trim())                                                 //if next column is the timestamp column selected by the user ex: "Day" == "Day"
      timestampIndex = index;                                                           //get the index
    columnIndex[index] = columns[index].trim();                                         //create the obj by index and column ex:{"0":"Restaurante", "1":"Dia", ...}
  }
  return [columnIndex, timestampIndex];                                                 //return an array with two elements, the object with the columns and the index of the timestamp column
}

//ex: 2017:05:24
function convertToDateFormat(date){
  if (stringIsNull(date))
    return;

  var dateTime = date.split(" ")[0];
  dateTime = dateTime.replace(/(\/)|(\:)/, "-");
  dateTime = dateTime.replace(/(\/)|(\:)/, "-");
  var time = dateTime.split('-');

  if (stringIsNull(time[2]) || stringIsNull(time[1]) || stringIsNull(time[0]))
  return;
  else if (time[2].length == 4)
    return time[2] + ":" + time[1] + ":" + time[0];
  else
    return time[0] + ":" + time[1] + ":" + time[2];
}

//Check if a given string is null or empty
function stringIsNull(string){
  if (string == '' || string == 'undefined' || string == null)
    return true;
  return false;
}
