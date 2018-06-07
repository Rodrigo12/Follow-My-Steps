/////////////UPDATE FUNCTIONS/////////////
function createClockPicker(elementClass, placement, align, autoclose){
  $('.' + elementClass).clockpicker({
    placement: placement,
    align: align,
    autoclose: autoclose
  });
}

//create update file container content
function createUpdateFilesContent(){
  var updateTitle = createHtml('h1', 'Update Files', 'id="updateTitle" style="text-align:center;margin:60px;"');

  //select
  var opt1              = createHtml('option', 'I want', '');
  var opt2              = createHtml('option', "I don't want", '');
  var selectFromControl = createHtml('select', opt1 + opt2, 'id="updateSelect" class="form-control updateSelect" size="1" style="position:absolute; top:153px; left:30.75px;width:100px; cursor:pointer; color:#608fdb;background-color:transparent;border-width:0px;border:none;"');
  var divFormGroup      = createHtml('div', selectFromControl, 'class="form-group"');

  //paragraph
  var paragraph = createHtml('p', ' _____________ that Follow My Steps update my lifelogging source files,  in a time interval of _________.', 'id="updateText" style="text-align:justify; margin:20px;"');

  //clock
  var clockInput = createHtml('input', '', 'type="text" id="updateClockInput" value="00:10" onclick="createClockPicker('+"'uploadClockpicker'" +', '+"'bottom'"+', '+"'left'"+', true);" size="30" style="cursor:pointer; outline: none; text-align:center;color:#608fdb;background-color:transparent;border-width:0px;border:none;"');
  var clockDiv   = createHtml('div', clockInput, 'class="uploadClockpicker" style="position:absolute; top:178px; left:61.5px;"');

  //update button
  var updateButton = createHtml('button', 'Apply', 'id="updateButton" class="btn btn-default" onclick="uploadUpdateOptions(true);"');

  $('#updateContent').html(updateTitle + divFormGroup + paragraph + clockDiv + updateButton);
}

function uploadUpdateOptions(sendServer){
  var decision = $('#updateSelect').val();
  var time     = $('#updateClockInput').val();
  var updateFilesObj = {};

  updateFilesObj['decision'] = decision.replace('\'', '|');
  updateFilesObj['time']     = time;
  updateFilesObj['type']     = 'update';

  //sendUpdateDataToServer(decision, time);
  if (sendServer)
    sendDataToServer(updateFilesObj, '/definitions', null);
  fadeElements(['pluginForm', 'updateContent', 'removeContent'], 0.0, ANIMATIONTIME, null, 'none');
  hideContainer('settingsContainer', ANIMATIONTIME, ['11%', '95%'], hideContainerContent, hide);
}

//Load update data stored in the server
function updateLoad(objData){
  $('#updateSelect').val(objData.decision.replace('|', '\''));
  $('#updateClockInput').val(objData.time);

  uploadUpdateOptions(false);
}
