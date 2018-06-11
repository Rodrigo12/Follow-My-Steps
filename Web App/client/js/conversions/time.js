//get seconds between dates
function convertDatesToSeconds(initialDate, finalDate){
  var diffDate = initialDate.getTime() - finalDate.getTime();

  var diffSeconds = diffDate / 1000;
  return Math.round(Math.abs(diffSeconds));
}

//HH:MM:SS -> milliseconds
function convertToMilliseconds(time){
  var hmsArray = time.split(':'); // split into hours, minutes and seconds

  var millisecondsFromHours   = (hmsArray[0]) ?  3600000 * parseInt(hmsArray[0]) : 0;
  var millisecondsFromMinutes = (hmsArray[1]) ?  60000   * parseInt(hmsArray[1]) : 0;
  var millisecondsFromSeconds = (hmsArray[2]) ?  1000    * parseInt(hmsArray[2]) : 0;

  return millisecondsFromHours + millisecondsFromMinutes + millisecondsFromSeconds;
}
