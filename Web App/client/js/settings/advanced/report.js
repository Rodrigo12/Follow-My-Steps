function createReportAdvancedContent(){
  //title
  var reportTitle = createHtml('h1', 'Report', 'id="reportTitle" style="text-align:center;margin:60px;"');

  //paragraph
  var reportParagraph = createHtml('p', "_____________ to receive a report every _____________ at _____________ of _____________ with data regarding what I've done ________________ ago.", 'style="text-align:justify; margin:20px; line-height: 25px;"');

  //select
  var opt1              = createHtml('option', 'I want', '');
  var opt2              = createHtml('option', "I don't want", '');
  var selectFromControl = createHtml('select', opt1 + opt2, 'id="reportSelect" class="form-control updateSelect" size="1" style="position:absolute; top:156px; left:30px;width:100px; cursor:pointer; color:#608fdb;background-color:transparent;border-width:0px;border:none;"');
  var divFormGroup      = createHtml('div', selectFromControl, 'class="form-group"');

  //select time
  var opt1Time   = createHtml('option', 'Day', '');
  var opt2Time   = createHtml('option', "Week", '');
  var opt3Time   = createHtml('option', "Month", '');
  var opt4Time   = createHtml('option', "Year", '');
  var selectTime = createHtml('select', opt1Time + opt2Time + opt3Time + opt4Time, 'id="reportTimeSelect" class="form-control updateSelect" size="1" style="position:absolute; top:156px; left:300px;width:100px; cursor:pointer; color:#608fdb;background-color:transparent;border-width:0px;border:none;z-index:2;"');
  var divTime    = createHtml('div', selectTime, 'class="form-group"');

  //clock

  //days of the week
  var opt1Days   = createHtml('option', 'Monday', '');
  var opt2Days   = createHtml('option', "Tuesday", '');
  var opt3Days   = createHtml('option', "Wednesday", '');
  var opt4Days   = createHtml('option', "Thursday", '');
  var opt5Days   = createHtml('option', "Friday", '');
  var opt6Days   = createHtml('option', "Saturday", '');
  var opt7Days   = createHtml('option', "Sunday", '');
  var selectDays = createHtml('select', opt1Days + opt2Days + opt3Days + opt4Days + opt5Days + opt6Days + opt7Days, 'id="reportDaysSelect" class="form-control updateSelect" size="1" style="position:absolute; top:180px; left:30px;width:100px; cursor:pointer; color:#608fdb;background-color:transparent;border-width:0px;border:none;"');
  var divDays    = createHtml('div', selectDays, 'class="form-group"');

  //time Period
  var timePeriod = createSpecialInputText(['61%', '64%'], '', 'timePeriodSelect', ['180px', '72%'], 'timePeriod', ['162px', '320px'], 100, ["Days", "Weeks", "Months", "Years"]);

  //clock
  var clockReportInput = createHtml('input', '', 'type="text" id="reportClockInput" value="12:30" onclick="createClockPicker('+"'uploadClockpicker'" +', '+"'bottom'"+', '+"'left'"+', true);" size="20" style="cursor:pointer; outline: none; text-align:center;color:#608fdb;background-color:transparent;border-width:0px;border:none;"');
  var clockReportDiv   = createHtml('div', clockReportInput, 'class="uploadClockpicker" style="position:absolute; top:160px; left:68%;z-index:2;"');

  //email paragraph
  var reportEmailParagraph = createHtml('p', 'Email: ______________________________', 'style="text-align:justify; margin:20px;"');
  var emailInput = createSpecialInputText(['61%', '64%'], '', 'emailSelect', ['59%', '84%'], 'emailInput', ['205px', '57px'], 220, []);

  //Apply button
  var reportButton = createHtml('button', 'Apply', 'id="reportButton" class="btn btn-default" onclick="updateReportOptions(true);"');

  //add to report content
  $('#reportContent').html(reportTitle + reportParagraph + divFormGroup + divTime + divDays + reportEmailParagraph + clockReportDiv + timePeriod + emailInput + reportButton);
  $('#timePeriod').val('2');
  $('#emailInput').attr('placeholder', 'emailexample@someemail.com');
}

function updateReportOptions(sendServer){
  var reportObj = {};

  reportObj['want'] = ($('#reportSelect').val() == 'I want') ? true : false;

  reportObj['repeat']       = $('#reportTimeSelect').val();
  reportObj['time']         = $('#reportClockInput').val();
  reportObj['timeDay']      = $('#reportDaysSelect').val();
  reportObj['periodNumber'] = $('#timePeriod').val();
  reportObj['periodTime']   = $('#timePeriodSelect').val();
  reportObj['email']        = $('#emailInput').val();
  reportObj['type']         = 'report';

  if (sendServer)
    sendDataToServer(reportObj, '/definitions', null);
  hideContainer('settingsContainer', ANIMATIONTIME, ['5%', '95%'], hideContainerContent, hide);
}

//Load report data stored in the server
function reportLoad(objData){
  var reportSelect = (objData.want) ? 'I want' : "I don't want";
  $('#reportSelect').val(reportSelect);
  $('#reportTimeSelect').val(objData.repeat);
  $('#reportClockInput').val(objData.time);
  $('#reportDaysSelect').val(objData.timeDay);
  $('#timePeriod').val(objData.periodNumber);
  $('#timePeriodSelect').val(objData.periodTime);
  $('#emailInput').val(objData.email);

  updateReportOptions(false);
}
