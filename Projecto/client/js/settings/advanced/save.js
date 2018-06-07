var saveDefinitions = true;
var saveTimer       = null;

function createSaveAdvancedContent(){
  //title
  var saveTitle = createHtml('h1', 'Save', 'id="saveTitle" style="text-align:center;margin:60px;"');

  //select
  var opt1              = createHtml('option', 'I want', '');
  var opt2              = createHtml('option', "I don't want", '');
  var selectFromControl = createHtml('select', opt1 + opt2, 'id="saveSelect" class="form-control updateSelect" size="1" style="position:absolute; top:153px; left:30.75px;width:100px; cursor:pointer; color:#608fdb;background-color:transparent;border-width:0px;border:none;"');
  var divFormGroup      = createHtml('div', selectFromControl, 'class="form-group"');

  //select 2
  var opt2_1              = createHtml('option', 'want', '');
  var opt2_2              = createHtml('option', "don't want", '');
  var selectFromControl2 = createHtml('select', opt2_1 + opt2_2, 'id="saveSelect2" class="form-control updateSelect" size="1" style="position:absolute; top:174px; left:215px; width:100px; cursor:pointer; color:#608fdb;background-color:transparent;border-width:0px;border:none;"');
  var divFormGroup2      = createHtml('div', selectFromControl2, 'class="form-group"');

  //paragraph
  var paragraph = createHtml('p', ' _____________ to save my dashboard changes automatically, in a time interval of _________. I also _____________ to save everytime I reload or close Follow My Steps web page. ', 'id="saveText" style="text-align:justify; margin:20px;"');

  //clock
  var clockInput = createHtml('input', '', 'type="text" id="saveClockInput" value="00:10" onclick="createClockPicker('+"'saveClockpicker'" +', '+"'bottom'"+', '+"'left'"+', true);" size="30" style="cursor:pointer; outline: none; text-align:center;color:#608fdb;background-color:transparent;border-width:0px;border:none;"');
  var clockDiv   = createHtml('div', clockInput, 'class="saveClockpicker" style="position:absolute; top:178px; left:25px;"');

  //save button
  var saveButton = createHtml('button', 'Apply', 'id="updateButton" class="btn btn-default" onclick="saveUpdateOptions(true);"');

  $('#saveContent').html(saveTitle + divFormGroup + divFormGroup2 + paragraph + clockDiv + saveButton);
}

function saveUpdateOptions(sendServer){
  var time        = convertToMilliseconds($('#saveClockInput').val());
  var autoSave    = ($('#saveSelect').val()  == 'I want') ? true : false;
  saveDefinitions = ($('#saveSelect2').val() == 'want')   ? true : false;

  if (saveTimer != null)
    clearInterval(saveTimer);

  if (autoSave)
    saveTimer = setInterval(function(){
      getAllVisualizationsObjs(); //save dashboard in the server
    }, time);

  var saveObj = {};

  saveObj['autoSave']  = autoSave;
  saveObj['saveClose'] = saveDefinitions;
  saveObj['time']      = $('#saveClockInput').val();
  saveObj['type']      = 'save';

  if (sendServer)
    sendDataToServer(saveObj, '/definitions', null);
  hideContainer('settingsContainer', ANIMATIONTIME, ['11%', '95%'], hideContainerContent, hide);
}

$(document).on('change', '#saveSelect, #saveSelect2', function(){
  var saveSelect  = ($('#saveSelect').val() == 'I want') ? true : false;
  var saveSelect2 = ($('#saveSelect2').val() == 'want') ? true : false;

  var textParagraph = $('#saveText')[0].outerText;
  if (saveSelect == saveSelect2)
    textParagraph = $('#saveText')[0].outerText.replace('But I', 'I also');
  else
    textParagraph = $('#saveText')[0].outerText.replace('I also', 'But I');

  $('#saveText').html(textParagraph);
})

//Load save stored in the server
function saveLoad(objData){
  var autoSave    = (objData.autoSave) ? 'I want' : "I don't want";
  var saveDefinitions = (objData.saveClose) ? 'want' : "don't want";

  $('#saveSelect').val(autoSave);//set to user option
  $('#saveSelect2').val(saveDefinitions);
  $('#saveClockInput').val(objData.time);

  saveUpdateOptions(false);
}
