module.exports = {
  sendEmail:getDefinitionsReport
}

var nodemailer  = require('nodemailer'),
    db          = require('../dbCalls.js'),
    dbInfo      = require('../dbInfo.js'),
    conversion  = require('../general/conversion.js'),
    date        = require('../general/date.js'),
    application = require('../../app.js'),
    finder      = require('fs-finder'),
    schedule    = require('node-schedule'),
    pg          = require('pg');

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'appfollowmysteps@gmail.com',
        pass: 'followmysteps'
    }
});

// setup email data with unicode symbols
let mailOptions = {
    from: '"Follow My Steps 👣" <appfollowmysteps@gmail.com>', // sender address
};

function sendEmail(){
  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          application.sendSocketMessage('emailFeedback', {type:'Error', email: mailOptions.to, extension:'email'});
          return console.log(error);
      }
      console.log('Message %s sent: %s', info.messageId, info.response);
      application.sendSocketMessage('emailFeedback', {type:'Success', email: mailOptions.to, extension:'email'});
  });
}


function composeEmailBody(properties, results, initialDate, finalDate){
  mailOptions.to = properties.email;

  if (properties.repeat == 'Day')
    mailOptions.subject = 'Daily Report';
  else
    mailOptions.subject = properties.repeat + 'ly Report'; //ex: week -> weekly report


  //email body
  var imageCover   = '<img src="cid:emailImageCover" style="position:relative; width:100%; height:150px; border-radius:10px;">'
  var subject      = '<h1 style="position:absolute; top:0px; left:90%;">'+mailOptions.subject+'</h1>';
  var timePeriod   = '<h3>🗓 '+conversion.convertDate(conversion.getDateHandler(initialDate.toString()))+' - '+ conversion.convertDate(conversion.getDateHandler(finalDate.toString())) + '</h3>';
  var timesHere    = '<h4>You have been:</h4>';
  var listOfPlaces = '<div>', listOfPhotos = '<div>';
  var filePath = finder.from('/Users/').findFirst().findFiles('followMyStepsCoverV2.png');
  var attachmentsObjArray = [{filename: 'followMyStepsCover.png',path: filePath,cid: 'emailImageCover'}];//attachments with cover image
  for (var currentTitle, currentImage, currentTimes, currentText, currentTime, currentHour, currentMinutes, locations = false, photos = false, index = 0; index < results.length; index++) {
    if (results[index].hasOwnProperty('activity')) { //places
      locations = true;
      currentTitle  = '<p style="text-align:center; margin:0px; font-size:20px; color:white; height:40px; padding:5px; background-color:rgb(79, 147, 196); border-radius:10px;">'+results[index].activity+'</p>';
      currentTimes  = '<h1 style="text-align:center; margin:0px; font-size:100px">'+results[index].timesthere+'</h1>';
      currentText   = '<h4 style="text-align:center; margin:0px; font-size:10px">Times</h1>';
      currentHours  = '<h3 style="text-align:center; margin-top:5px; font-size:10px;">' + getCorrectTime(results[index].hours, results[index].minutes) + '</h3>';
      listOfPlaces += '<div style="position:relative; margin:15px; display:inline-block; width:200px; height:200px; border-radius:10px; border:1px solid rgba(0, 0, 0, 0.1)">'+currentTitle+currentTimes+currentText+currentHours+'</div>';
      getCorrectTime(results[index].hours, results[index].minutes);
    }else{ //photos
      photos = true;
      currentTitle  = '<p style="position:absolute; text-align:center; margin:0px; font-size:15px; padding:5px;">'+results[index].filename+'</p>';
      currentText   = '<p style="position:absolute; text-align:center; margin:0px; font-size:10px; padding:5px;">'+conversion.convertDate(results[index].timestamp)+'</p>';
      currentImage  = '<img src="cid:photoID'+index+'" style="position:absolute; max-width:100%; max-height:100%; border-radius:10px;">';
      attachmentsObjArray.push({filename: results[index].filename, path: results[index].source, cid: 'photoID'+index});
      listOfPhotos  += '<div style="position:relative; margin:15px; display:inline-block; width:200px; height:200px; border-radius:10px;">'+currentImage+currentTitle+currentText+'</div>';
    }
  }
  if (!locations)
    listOfPlaces += "<h3 style='text-align:center;'>🗺 No locations found for this period of time</h3>";
  if (!photos)
    listOfPhotos += "<h3 style='text-align:center;'>📷 No photos found for this period of time</h3>";

  listOfPlaces += '</div>', listOfPhotos += '</div>';

  var photosText = '<h4>Photos:</h4>';


  mailOptions.html = imageCover+subject+timePeriod+timesHere+listOfPlaces + photosText + listOfPhotos;
  //console.log(mailOptions.html);

  mailOptions.attachments = attachmentsObjArray;
  sendEmail();
}

function getDefinitionsReport(){
  pg.connect(dbInfo.connect, function(err, client, done){
    db.checkIfTableExist(client, 'definitions', function(bool){
      if (bool) {
        var dbGetQuery = "SELECT properties FROM definitions WHERE type = 'report'";
        db.getInternalData(client, dbGetQuery, "", function(results){ //get definitions properties "i want", time, period
          if (results.rowCount == 1)
            getEmailBodyContent(client, done, results.rows[0]);
          done();
        });
      }
    });
  });
}

function getEmailBodyContent(client, done, results){
  var properties   = JSON.parse(results.properties);

  var wantEmail    = properties.want;
  var repeat       = properties.repeat;
  var time         = properties.time;
  var timeDay      = properties.timeDay;
  var periodNumber = properties.periodNumber;
  var periodTime   = properties.periodTime;
  var email        = properties.email;

  var initialDate, finalDate, week, nextWeek;

  if (!wantEmail)
    return;

  var numberOfPhotos;
  if (periodTime == 'Days') {
    initialDate = date.getDay(new Date(), periodNumber - 1);
    finalDate   = initialDate;
    numberOfPhotos = 1;
  }else if (periodTime == 'Weeks') {
    week        = date.getWeek(new Date(), periodNumber);
    nextWeek    = date.getWeek(new Date(), periodNumber - 1);
    initialDate = date.getMonday(week);
    finalDate   = date.getMonday(nextWeek);
    numberOfPhotos = 3;
  }else if (periodTime == 'Months') {
    initialDate = date.getMonth(new Date(), periodNumber, false);
    finalDate   = date.getMonth(new Date(), periodNumber - 1, true);
    numberOfPhotos = 6;
  }else if (periodTime == 'Years') {
    initialDate = date.getYear(new Date(), periodNumber, false);
    finalDate   = date.getYear(new Date(), periodNumber, true);
    numberOfPhotos = 9;
  }

  db.checkIfTableExist(client, 'life', function(bool){
    if (bool) {
      var dbGetQuery = "SELECT activity, sum(hour) AS hours, sum(minutes) AS minutes, COUNT(activity) AS timesThere, MIN(timestamp) AS StartDate, MAX(timestamp) AS EndDate FROM life WHERE timestamp >= '"+conversion.getDateHandler(initialDate.toString())+"' AND timestamp <= '"+conversion.getDateHandler(finalDate.toString())+"' AND type='Span' GROUP BY activity ORDER BY COUNT(activity) DESC;";
      dbGetQuery    += "SELECT source, filename, timestamp FROM photos WHERE timestamp >= '"+conversion.getDateHandler(initialDate.toString())+"' AND timestamp <= '"+conversion.getDateHandler(finalDate.toString())+"' ORDER BY RANDOM() LIMIT "+numberOfPhotos+";";
       db.getInternalData(client, dbGetQuery, "", function(results){ //get life info within the selected period
        composeEmailBody(properties, results.rows, initialDate, finalDate);
        setEmailTimer(repeat, time, timeDay);
        done();
      });
    }
  });

}

function setEmailTimer(repeat, time, timeDay){
  var daysOfWeekObj = {'Sunday':0,'Monday':1,'Tuesday':2,'Wednesday':3,'Thursday':4,'Friday':5,'Saturday':6};
  var hours         = time.split(':')[0];
  var minutes       = time.split(':')[1];
  var nextDate      = new Date();

  if (repeat == 'Day') {
    nextDate.setDate(nextDate.getDate()+1);
  }else if (repeat == 'Week') {
    nextDate = date.getNextWeekDay(daysOfWeekObj[timeDay]);
  }else if (repeat == 'Month') {
    nextDate = date.getMonthDays(daysOfWeekObj[timeDay])[0];
  }else if (repeat == 'Year') {
    nextDate = date.getYearDay(daysOfWeekObj[timeDay]);
  }

  //year, month, day, hours, minutes, seconds, milliseconds
  var selectedDate = new Date(nextDate.getFullYear(), nextDate.getMonth(), nextDate.getDate(), parseInt(hours), parseInt(minutes), 0, 0);
  console.log('selectedDate: ' + selectedDate);

  var emailTimer = schedule.scheduleJob(selectedDate, function(){
    getDefinitionsReport();
  });
}

function getCorrectTime(inputHours, inputMinutes){
  var minutes = 0, hours = 0, days = 0;

  hours   = Math.floor(inputMinutes / 60) + parseInt(inputHours);
  minutes = parseInt(inputMinutes) % 60;

  days  = Math.floor(hours / 24);
  hours = parseInt(hours) % 24;

  return '⏱ '+ days + ' Days, '+ hours +' Hours and '+ minutes +' Minutes';
}
