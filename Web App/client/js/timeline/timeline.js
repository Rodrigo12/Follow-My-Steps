function timelineCreateContent(){
  var start = createInputDate("startDate", "Start", startDate, startDate, "style='position:relative; margin-top:15%; left:32%; font-size:2.0em;'", "style='position:relative; margin-top:5%; left:7%; width:175px;'");
  var end   = createInputDate("endDate", "End", endDate, endDate, "style='position:relative; margin-top:15%; left:35%; font-size:2.0em;'", "style='position:relative; margin-top:5%; left:7%; width:175px;'");

  var divStart = createHtml('div', start, "style='display:inline-block; margin-left:10px; width:200px; height:140px; border-radius:10px; border:1px solid rgba(0,0,0,0.1);'");
  var divEnd   = createHtml('div', end, "style='display:inline-block; margin-left:100px; width:200px; height:140px; border-radius:10px; border:1px solid rgba(0,0,0,0.1);'");

  var updateButton = createHtml("button", 'Apply', "type='button' id='timelineApplyButton' class='btn-default btn submitNewDates' style='margin-top:3%; margin-left:44%; '");
  var elementDiv  = "<div> " + divStart + divEnd + updateButton + " </div>";

  $('#timelineContainerContent').html(elementDiv);

  $('#startDate').addClass('visualization');
  $('#endDate').addClass('visualization');

  $('#startDate').on('time',  function (evt, param1){
                if (param1 != 'timelineEvent') {
                  $('#startDate input').val(formatDate(startDate));
                  $('#endDate input').val(formatDate(endDate));
                }
						});
}

$(document).on('click', '.input-group-addon', function(){
  if ($(this).closest('#timelineContainerContent').length != 0 ){
    if ($(this).closest('#startDate').length != 0)
      setDate('startDate', new Date(2000, 00, 01));
    else
      setDate('endDate', new Date());
  }
});

function setDate(dateString, dateInput){
  if (dateString == 'startDate')
    startDate = dateInput;
  else
    endDate = dateInput;
  $('#'+dateString+' input').val(formatDate(dateInput));
}
