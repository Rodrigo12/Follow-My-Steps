module.exports = {
  getDay:getDay,
  getWeek:getWeek,
  getMonday:getMonday,
  getMonth:getMonth,
  getYear:getYear,
  getNextWeekDay:getNextWeekDay,
  getMonthDays:getMonthDays,
  getYearDay:getYearDay
}

/////////DATE FUNCTIONS//////////////
function getDay(date, daysNumber){
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() - daysNumber);
}

function getWeek(date, weekNumber){
    var week = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 7 * weekNumber);
    return week ;
}

function getMonday(date) {
  var d = new Date(date);
  var day = d.getDay(),
      diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
  return new Date(d.setDate(diff));
}

function getMonth(date, monthsNumber, lastDay){
  var lastDayNumber = (lastDay) ? 0 : 1;
  return new Date(date.getFullYear(), date.getMonth() - monthsNumber, lastDayNumber);
}

function getYear(date, yearsNumber, lastDay){
  var lastDayNumber = (lastDay) ? 31 : 1;
  var lastMonthNumber = (lastDay) ? 11 : 0;
  return new Date(date.getFullYear() - yearsNumber, lastMonthNumber, lastDayNumber);
}

function getNextWeekDay(weekDay){
    var date = new Date();
    date.setDate(date.getDate() + (weekDay+(7-date.getDay())) % 7);
    return date;
}


function getMonthDays(weekDay) {
    var d = new Date(),
        month = d.getMonth()+1,
        mondays = [];

    d.setMonth(d.getMonth()+1);
    d.setDate(1);

    // Get the first Monday in the month
    while (d.getDay() !== weekDay) {
        d.setDate(d.getDate() + 1);
    }
    // Get all the other Mondays in the month
    while (d.getMonth() === month) {
        mondays.push(new Date(d.getTime()));
        d.setDate(d.getDate() + 7);
    }
    return mondays;
}

function getYearDay(weekDay) {
    var d = new Date(),
        year = d.getFullYear()+1;

    d.setYear(d.getFullYear()+1);
    d.setDate(1);
    d.setMonth(0);

    // Get the first day in the year
    while (d.getDay() !== weekDay) {
        d.setDate(d.getDate() + 1);
    }

    return d;
}
