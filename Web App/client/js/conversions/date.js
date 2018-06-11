var monthAbrevNames = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var monthNames      = ["January", "February", "March","April", "May", "June", "July","August", "September", "October","November", "December"];

//from new Date ex: Sat May 13 2017 12:10:32 GMT+0100 (WEST)
function formatDate(date, isMonthNumber) {
  var day        = date.getDate();
  var monthIndex = date.getMonth();
  var year       = date.getFullYear();

  if (isMonthNumber)
    return (monthIndex+1) + ' ' + day + ' ' + year;
  else
    return monthNames[monthIndex] + ' ' + day + ' ' + year;
}

//ex: 2017:01:31 -> 31 Jan 2017
function convertDate(date){
  var dateArray  = date.split(':');
  var year  = dateArray[0];
  var month = dateArray[1];
  var day   = dateArray[2];

  return day + " " + monthAbrevNames[parseInt(month) - 1] + " " + year;
}

//ex: 2017:05:13 -> Sat May 13 2017 12:10:32 GMT+0100 (WEST)
function convertToDefaultDate(date){
  var dateArray  = date.split(':');
  var year  = dateArray[0];
  var month = dateArray[1];
  var day   = dateArray[2];

  return new Date(parseInt(year), parseInt(month) - 1 , parseInt(day));
}

//ex: MM/DD/YYYY -> January 21 2017
function convertFromConventionalDate(date){
  var month = date.split('/')[0];
  var day   = date.split('/')[1];
  var year  = date.split('/')[2];

  return monthNames[parseInt(month)-1] + " " + day + " " + year;
}

//ex: January 21 2017 -> MM/DD/YYYY
function convertToConventionalDate(date){
  var month = date.split(' ')[0];
  var day   = date.split(' ')[1];
  var year  = date.split(' ')[2];

  var monthIndex = getIndexMonth(month, monthNames);

  if (monthIndex < 10)
    return "0" + monthIndex + "/" + day + "/" + year;
  else
    return monthIndex + "/" + day + "/" + year;
}

//ex: January 21 2017 -> Sat Jan 21 2017 12:10:32 GMT+0100 (WEST)
function convertToDefaultDateFromConventional(date){
  var month = date.split(' ')[0];
  var day   = date.split(' ')[1];
  var year  = date.split(' ')[2];

  var monthIndex = getIndexMonth(month, monthNames);

  return new Date(parseInt(year), parseInt(monthIndex)-1, parseInt(day));
}


// 2 -> 'Mar'
function getMonthAbrevByIndex(index){
  return monthAbrevNames[parseInt(index)-1];
}

// 'Mar' -> 2
function getIndexMonth(month, monthNames){
  for (var index = 0; index < monthNames.length; index++) {
    if (monthNames[index] == month) {
      return ((index+1) > 9) ? (index+1) : '0' + (index+1);
    }
  }
}

//ex: 01-04-2012 -> 04-01-2012
function switchMonthDay(date){
  var month = date.split('-')[0];
  var day   = date.split('-')[1];
  var year  = date.split('-')[2];

  return day + "-" + month + "-" + year;
}

//dateFromDay(2010, 365) -> "Fri Dec 31 2010"
function dateFromYearDay(year, day){
  var date = new Date(year, 0); // initialize a date in `year-01-01`
  return new Date(date.setDate(day)); // add the number of days
}

// "Fri Dec 31 2010" -> 2010/12/31
function getMonthAndDay(date){
  var dateArray = date.split(' ');
  return dateArray[3]+"/"+getIndexMonth(dateArray[1], monthAbrevNames)+"/"+dateArray[2];
}

//server time to client time
//Ex: 2017:01:01 -> 01 Jan 2017 | 2017 -> 2017 | :01 -> Jan
function convertToChartDates(dateString){
  if (dateString == null || dateString.toString().split(':').length < 2) {//if not a date
    return dateString;
  }

  if ( dateString.length == 10 ) //Day
    return convertDate(dateString);
  else if ( dateString.length == 7 ) //Month
    return getMonthAbrevByIndex(dateString.split(":")[1]) + " " + dateString.split(":")[0];
  else
    return dateString;
}

////////////CONVERT DATES FORMAT////////////
//June 25 2017 -> Jun 25 2017
function getFormatedDate(dateString){
  var dateArray = dateString.split(' ');
  var abrevMonth=  getMonthAbrevByIndex(  getIndexMonth(dateArray[0], monthNames) );
  return abrevMonth + ' ' + dateArray[1] + ' ' + dateArray[2];
}

//Sat Jan 01 2000 00:00:00 GMT+0000 (WET)-> Jan 01 2000
function getTimelineFormatedDate(dateString){
  var dateArray = dateString.split(' ');
  return dateArray[1] + ' ' + dateArray[2] + ' ' + dateArray[3];
}

////////////CONVERT DATES TO DAYS////////////
//Sat May 13 2017 12:10:32 GMT+0100 (WEST) -> 365 days
function getDayOfYear(date){
  var start = new Date(date.getFullYear(), 0, 0);
  var diff = date - start;
  var oneDay = 1000 * 60 * 60 * 24;
  var day = Math.floor(diff / oneDay);
  return day;
}

function subtractDates(date1, date2){
  var timeDiff = Math.abs(date2.getTime() - date1.getTime());
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
}

function getDatesDiff(date1, date2){
  var timeDiff = date2.getTime() - date1.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
}

//ex 223 hours 342 minutes -> 7 days 3 hours 25 minutes
function getCorrectTime(inputHours, inputMinutes){
  var minutes = 0, hours = 0, days = 0;

  hours   = Math.floor(inputMinutes / 60) + parseInt(inputHours);
  minutes = parseInt(inputMinutes) % 60;

  days  = Math.floor(hours / 24);
  hours = parseInt(hours) % 24;

  return '⏱ '+ days + ' Days '+ hours +' Hours '+ minutes +' Minutes';
}

//check if input is Date
function isDate(input){
  var dateArray  = input.split(':');
  if (dateArray.length == 1) {//ex:2017
    if (!isNaN(input) && input.length == 4)
      return true;
  }else if (dateArray.length == 2) {//ex: 2017:06
    if (!isNaN(dateArray[0]) && !isNaN(dateArray[1]) && dateArray[0].length == 4 && dateArray[1].length == 2)
      return true;
  }else if (dateArray.length == 3) {//ex: 2017:06:01
    if (!isNaN(dateArray[0]) && !isNaN(dateArray[1]) && !isNaN(dateArray[2]) && dateArray[0].length == 4 && dateArray[1].length == 2 && dateArray[2].length == 2)
      return true;
  }

  return false;
}
