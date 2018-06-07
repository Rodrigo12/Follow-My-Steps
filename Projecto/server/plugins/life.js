module.exports = {
  formatDecoder: lifeFormatDecoder
}

//Return the life data ready to insert on the database
function lifeFormatDecoder(content){
  var messageArray = content.split('|:|');
  var lifeContent = JSON.parse(messageArray[0]);
  var fileName = messageArray[1];
  var sentences = lifeContent.split("\n");                    //Store sentences in array
  var databaseData = sortSentences(sentences, fileName);
  return databaseData;
}



//Identify the type of the sentences (if they are a comment, a span, etc..)
function sortSentences(sentences, fileName){
  //ex: generalParser("20030303", "+3", ["2124-2349: neighborhood cinema [movies|leisure] {Star Wars: The Force Awakens}"]);
  var comments, dbData = [], data = [];
  var currentDate, currentTimeZone;

  //Patterns ex: 1342-1812: work
  var commentPattern = /;.*/g;
  var datePattern = /--[0-9]{4}_[0-9]{2}_[0-9]{2}/g;
  var tripPattern = /[0-9]{4}-[0-9]{4}:.+->.+/g;
  var spanPattern = /^([0-9]{4}-[0-9]{4}:).+/g;
  var subSpanPattern = /^(\s[0-9]{4}-[0-9]{4}:).+/g;
  var timeZonePattern = /^(@*UTC)(\+[0-9])*/g;

  //Meta Commands
  var placeInclusionPattern = /^@.+<.+/g;
  var canonicalLocationsPattern = /^@.+@\s*-?[0-9]+\.[0-9]+,\s*-?[0-9]+\.[0-9]+/g; //ex: @work @ 32.4343534,-9.54353
  var placeCategoriesPattern = /^@.+:.+/g;
  var nameChangesPattern = /^@.+>>.+/g;

  //Read all sentences from the file, one by one
  for(var index = 0 ; index < sentences.length; index++){
    //Remove sentence comments
    sentences[index] = sentences[index].replace(commentPattern, '');
    data = null;

    if (sentences[index].match(datePattern)){
      currentDate = convertToDateFormat(dateParser(sentences[index].match(datePattern)));
    }else if (sentences[index].match(timeZonePattern)) {
      currentTimeZone = timeZoneParser(sentences[index].match(timeZonePattern));
    }else if (sentences[index].match(tripPattern)) {
      data = generalParser(currentDate, currentTimeZone, "Trip", sentences[index], fileName);
    }else if (sentences[index].match(spanPattern)) {
      data = generalParser(currentDate, currentTimeZone, "Span", sentences[index], fileName);
    }else if (sentences[index].match(subSpanPattern)) {
      data = generalParser(currentDate, currentTimeZone, "SubSpan", sentences[index], fileName);
    }else if (sentences[index].match(placeInclusionPattern)) {
      data = metaCommandsParser(sentences[index], "Place Inclusion", "<", fileName);
    }else if (sentences[index].match(canonicalLocationsPattern)) {
      data = metaCommandsParser(sentences[index], "Canonical Locations", "@", fileName);
    }else if (sentences[index].match(placeCategoriesPattern)) {
      data = metaCommandsParser(sentences[index], "Place Categories", ":", fileName);
    }else if (sentences[index].match(nameChangesPattern)) {
      data = metaCommandsParser(sentences[index], "Name Changes", ">>", fileName);
    }else if(sentences[index] != null || sentences[index] != " "){
    }

    if(data != null)
      dbData.push(data);
  }

  return dbData;
}

//ex: 2017:05:24
function convertToDateFormat(date){
  var day = date.substring(6,8);
  var month = date.substring(4,6);
  var year = date.substring(0,4);
  return year+ ":" + month + ":" + day;
}

//Arranje date for database
function dateParser(dateObj){
  var date = dateObj[0];
  //Ex:--2017_01_01 -> 20170101 (YYYYMMDD)
  return date.charAt(2)+date.charAt(3)+date.charAt(4)+date.charAt(5)+date.charAt(7)+date.charAt(8)+date.charAt(10)+date.charAt(11);
}



//Arranje timeZone for database
function timeZoneParser(timeZoneObj){
  var timeZone = timeZoneObj[0];
  //Ex:@UTC+2 -> +2
  if(timeZone.length >= 5)
    return timeZone.charAt(timeZone.length-2) + timeZone.charAt(timeZone.length-1);
  else
    return '0';
}



//Parse annotations such as trips and spans
function generalParser(date, timeZone, type, span, fileName){
  //Ex: span = "2124-2349: neighborhood cinema [movies|leisure] {description} [tag1|tag2] {Star Wars: The Force Awakens}"
  var spanContent, type, parent, activity, tags, descriptions, timeData;
  var tagsPattern = /\[.+\]/g, descriptionPattern = /\{.+\}/g;

  timeData     = timeParser(span);
  activity     = activityParser(span, [tagsPattern, descriptionPattern]);
  tags         = blockParser(span, tagsPattern, '\]', '\[');
  descriptions = blockParser(span, descriptionPattern, '\}', '\{');
  parent       = -1;

  return ["ADD SOURCE", fileName, date, null, null, null, parseInt(timeZone), parseInt(timeData[0]), parseInt(timeData[1]), timeData[2], timeData[3], activity, type, parent, tags, descriptions, null, null];
}



//Get time information
function timeParser(data){
  var hoursString = data.split(":")[0];                         //ex: 2124-2349
  var initialHour = hoursString.split("-")[0];                  //ex: 2124
  var finalHour   = hoursString.split("-")[1];                  //ex: 2349

  var hoursMinutes = calculateHoursAndMinutes(initialHour, finalHour);

  return [initialHour, finalHour, hoursMinutes[0], hoursMinutes[1]];
}



//Calculate the difference between hours and minutes
function calculateHoursAndMinutes(initial, final){
  var initialHours   = parseInt(initial.charAt(0) + initial.charAt(1));     //ex: 21
  var initialMinutes = parseInt(initial.charAt(2) + initial.charAt(3));     //ex: 24
  var finalHours     = parseInt(final.charAt(0) + final.charAt(1));         //ex: 23
  var finalMinutes   = parseInt(final.charAt(2) + final.charAt(3));         //ex: 49

  var startTime  = new Date(2000, 1, 1, initialHours, initialMinutes);      //ex: new Date(year, month, day [, hour, minute, second, millisecond])
  var finalTime  = new Date(2000, 1, 1, finalHours, finalMinutes);          //ex: the year:month:day is irrelevant
  var difference = new Date(finalTime - startTime);
  var diff_hours = difference.getHours();
  var diff_mins  = difference.getMinutes();

  return [diff_hours, diff_mins];
}



//Identify the activities of each annotation
function activityParser(data, undesiredPatterns){
  var dataContent = data.split(/:(.+)/)[1];                         //ex: neighborhood cinema [movies|leisure] {description} [tag1|tag2] {Star Wars: The Force Awakens}
  var activity = dataContent;
  for(var index = 0; index < undesiredPatterns.length; index++){    //remove undesired patterns such as tags and descriptions
    activity = activity.replace(undesiredPatterns[index], '');
  }
  if(/^\s+$/.test(activity)) return " ";                            //If activity has more then one withespace return only one
  else return activity = activity.trim();                           //Trim remove the initial and final whitespaces
}



//Identify blocks of information such as tags and descriptions
function blockParser(data, pattern, symbol1, symbol2){
  var dataContent = data.split(/:(.+)/)[1];                   //ex: neighborhood cinema [movies|leisure] {description} [tag1|tag2] {Star Wars: The Force Awakens}
  var block, blockObj = dataContent.match(pattern);           //ex: [movies|leisure] {description} [tag1|tag2]
  if(blockObj != null){
    var pattern1 = "/" + symbol1 + ".*" + symbol2 + "/g";
    var pattern2 = "/" + symbol2 + "|" + symbol1 + "/g";
    blockObj[0]  = blockObj[0].replace(pattern1, '|');        //More than one group of tags (Ex: [movies|leisure] {description} [tag1|tag2] -> [movies|leisure|tag1|tag2])
    block = blockObj[0].replace(pattern2, '').split("|");     //ex: ["movies", "leisure", "tag1", "tag2"]
  }
  return block;
}



//
function metaCommandsParser(data, type, separator, fileName){
  var description = (data.replace(/^@/g, '')).split(separator);
  var latLng      = description[1].split(',');
  return ["ADD SOURCE", fileName, null, null, null, null,null,null,null,null,null,null,type,null,description[0].trim(),description, parseFloat(latLng[0]), parseFloat(latLng[1])];
}
