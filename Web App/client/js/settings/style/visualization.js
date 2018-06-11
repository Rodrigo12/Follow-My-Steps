var updateAllVisualizations = true;
var dragAllVisualizations   = true;

function createVisualizationStyleContent(){
  var visualizationTitle = createHtml('h1', 'Visualizations', 'id="visualizationStyleTitle" style="text-align:center;margin:60px;"');

  //image preview
  var previewImage    = createHtml('img', '', 'id="visualizationStylePreview" src="imgs/visualizations/barChart2.png" style="width:150px;"');
  var previewText1    = createHtml('p', 'X-Axis', 'id="visStylePreviewText" style="position:absolute; left:48%; top:100px; text-align:center;"');
  var previewText2    = createHtml('p', 'Y-Axis', 'id="visStylePreviewText" style="position:absolute; left:-35px; top:45%; transform: rotate(270deg); text-align:center;"');
  var previewImageDiv = createHtml('div', previewImage + previewText1 + previewText2, 'id="visStylePreviewDiv" style="position:absolute;left:50%; top:150px;transform:translate(-50%, 0%);"');

  ////background section////
  //select
  var textBkg   = createHtml('p', 'Background: _____________', '');
  var opt1Bkg   = createHtml('option', "Don't apply", '');
  var opt2Bkg   = createHtml('option', "Apply", '');
  var selectBkg = createHtml('select', opt1Bkg + opt2Bkg, 'id="bkgSelect" class="form-control updateSelect bkgStyleProperty" size="1" style="position:absolute; top:-5px; left:79px;width:100px; cursor:pointer; color:#608fdb;background-color:transparent;border-width:0px;border:none;"');
  var divBkg    = createHtml('div', textBkg + selectBkg, 'class="form-group" style="position:absolute; top:320px; left:60px;"');

  //radius
  var optionsSizeInput   = ['px', '%'];
	var radiusInputBkg = createSpecialInputText(['0px', '0%'], 'Background Radius:_______', 'borderRadiusVisSelect', ['-6px', '75%'], 'borderRadiusVis', ['-24px', '37.5%'], 100, optionsSizeInput );
  var divRadiusBkg   = createHtml('div', radiusInputBkg, 'class="form-group" style="position:absolute; top:362.5px; left:60px; width:200px;"');

  //color
  var colorTextBkgButton = createHtml('img', '', 'src="./imgs/icons/containerIcons/originals/bkgColorIcon.png" style="position:absolute;width:25px; cursor:pointer;"');
	var colorTextBkgLabel  = createHtml('label', colorTextBkgButton, 'for="colorInputBkg" style="position:absolute; top:0px; left:84%; width:30px; cursor:pointer;"');
	var colorInputBkg      = createHtml('input', '', 'id="colorInputBkg" class="bkgStyleProperty" type="color" value="#FFFFFF" style="position:absolute;z-index:-1;opacity:0;"');
  var divColorBkg        = createHtml('div', colorTextBkgLabel + colorInputBkg, 'class="form-group" style="position:absolute; top:112px; left:345px;"');

  ////font section////
  //font Family
  var textFont   = createHtml('p', 'Font Family: ______________', '');
  var opt0Font   = createHtml('option', '"Helvetica Neue", Helvetica, Arial, sans-serif', '');
  var opt1Font   = createHtml('option', 'Arial, Helvetica, sans-serif', '');
  var opt2Font   = createHtml('option', '"Arial Black", Gadget, sans-serif', '');
  var opt3Font   = createHtml('option', '"Comic Sans MS", cursive, sans-serif', '');
  var opt4Font   = createHtml('option', '"Courier New", Courier, monospace', '');
  var opt5Font   = createHtml('option', 'Impact, Charcoal, sans-serif', '');
  var opt6Font   = createHtml('option', 'Georgia, serif', '');
  var opt7Font   = createHtml('option', '"Lucida Console", Monaco, monospace', '');
  var opt8Font   = createHtml('option', '"Lucida Sans Unicode", "Lucida Grande", sans-serif', '');
  var opt9Font   = createHtml('option', '"Palatino Linotype", "Book Antiqua", Palatino, serif', '');
  var opt10Font  = createHtml('option', 'Tahoma, Geneva, sans-serif', '');
  var opt11Font  = createHtml('option', '"Times New Roman", Times, serif', '');
  var opt12Font  = createHtml('option', '"Trebuchet MS", Helvetica, sans-serif', '');
  var opt13Font  = createHtml('option', 'Verdana, Geneva, sans-serif', '');
  var selectFont = createHtml('select', opt0Font + opt1Font + opt2Font+ opt3Font+ opt4Font+ opt5Font+ opt6Font+ opt7Font + opt8Font + opt9Font + opt10Font + opt11Font + opt12Font + opt13Font, 'id="fontSelect" class="form-control updateSelect bkgStyleProperty" size="1" style="position:absolute; top:-5px; left:75px;width:120px; cursor:pointer; color:#608fdb;background-color:transparent;border-width:0px;border:none;"');
  var divFont    = createHtml('div', textFont + selectFont, 'class="form-group" style="position:absolute; top:320px; left:300px;"');

  // font size
  // var optionsSizeFont   = ['px'];
  // var sizeInputFont = createSpecialInputText(['0px', '0%'], 'Font Size: _______________', 'fontSizeSelect', ['-7px', '73%'], 'fontSizeVis', ['-25px', '30.5%'], 100, optionsSizeFont );
  // var divSizeFont   = createHtml('div', sizeInputFont, 'class="form-group" style="position:absolute; top:362.5px; left:300px; width:200px;"');

  // //font color
  // var textColorFont  = createHtml('p', 'Font Color: ', '');
  // var colorInputVisFont = createHtml('input', '', 'id="colorFontPicker" class="colorLabelDiv bkgStyleProperty" type="color" value="#000000" style="cursor:pointer;opacity:1; position:absolute; top:0px; left:135px;"');
  // var divColorFont   = createHtml('div', textColorFont + colorInputVisFont, 'class="form-group" style="position:absolute; top:410px; left:300px;"');

  //font shadow
  var fontShadowParagraph = createHtml('p', 'Font Shadow: _____________', 'style="position:absolute; top:362.5px; left:300px;"');
  var fontShadowInput1    = createInputText('fontShadowInput1Bkg', '', '', 'type="number" style="width:50px; cursor:pointer; color:#608fdb;background-color:transparent;border-width:0px;border:none;"', 'position:absolute; top:339px; left:360px;', 'specialSelect bkgStyleProperty');
  var fontShadowInput2    = createInputText('fontShadowInput2Bkg', '', '', 'type="number" style="width:50px; cursor:pointer; color:#608fdb;background-color:transparent;border-width:0px;border:none;"', 'position:absolute; top:339px; left:410px;', 'specialSelect bkgStyleProperty');
  var fontShadowSelect1   = createTextSelect('fontShadowSelect1Bkg', 'specialSelect bkgStyleProperty', 'position:absolute; top:357px; left:405px; width:39px; z-index:10; cursor:pointer; color:#608fdb;background-color:transparent;border-width:0px;border:none;', ['px'], 1);
  var fontShadowSelect2   = createTextSelect('fontShadowSelect2Bkg', 'specialSelect bkgStyleProperty', 'position:absolute; top:357px; left:455px; width:39px; z-index:10; cursor:pointer; color:#608fdb;background-color:transparent;border-width:0px;border:none;', ['px'], 1);
  var divShadowFont       = createHtml('div', fontShadowParagraph + fontShadowInput1 + fontShadowInput2 + fontShadowSelect1 + fontShadowSelect2);

  //font shadow color
  var colorTextShadowButton = createHtml('img', '', 'src="./imgs/icons/fontShadowColorIcon.png" style="position:absolute;width:30px; cursor:pointer;"');
  var colorTextShadowLabel  = createHtml('label', colorTextShadowButton, 'for="fontShadowColorBkg" style="position:absolute; top:0%; left:84%; width:30px; cursor:pointer;"');
  var colorInputShadowFont  = createHtml('input', '', 'id="fontShadowColorBkg" class="bkgStyleProperty" type="color" value="#BCBCBC" style="position:absolute;z-index:-1;opacity:0;"');
  var divColorShadowFont    = createHtml('div', colorTextShadowLabel + colorInputShadowFont, 'class="form-group" style="position:absolute; top:110px; left:425px;"');

  //font color
  var colorTextButton = createHtml('img', '', 'src="./imgs/icons/fontColorIcon.png" style="position:absolute;width:30px; cursor:pointer;"');
	var colorTextLabel  = createHtml('label', colorTextButton, 'for="colorInputVisFont" style="position:absolute; top:0%; left:84%; width:30px; cursor:pointer;"');
	var colorInputVisFont  = createHtml('input', '', 'id="colorInputVisFont" class="bkgStyleProperty" type="color" value="#000000" style="position:absolute;z-index:-1;opacity:0;"');
  var divColorFont    = createHtml('div', colorTextLabel + colorInputVisFont, 'class="form-group" style="position:absolute; top:110px; left:385px;"');

  //update all
  var opt0Update        = createHtml('option', 'Automatically', '');
  var opt1Update        = createHtml('option', "Don't", '');
  var applyUpdate       = createHtml('p', '______________ update visualizations when a time event is triggered', '');
  var selectApplyUpdate = createHtml('select', opt0Update + opt1Update, 'id="selectApplyUpdate" class="form-control updateSelect bkgStyleProperty" size="1" style="position:absolute; top:-5px; left:-10px;width:150px; cursor:pointer; color:#608fdb;background-color:transparent;border-width:0px;border:none;"');
  var divApplyUpdate    = createHtml('div', applyUpdate + selectApplyUpdate, 'style="position:absolute; top:420px; left:60px;"');

  //draggable
  var opt0Draggable        = createHtml('option', 'Enable', '');
  var opt1Draggable        = createHtml('option', "Disable", '');
  var applyDraggable       = createHtml('p', '______________ the draggable property in all visualizations', '');
  var selectApplyDraggable = createHtml('select', opt0Draggable + opt1Draggable, 'id="selectApplyDraggable" class="form-control updateSelect bkgStyleProperty" size="1" style="position:absolute; top:-5px; left:-10px;width:150px; cursor:pointer; color:#608fdb;background-color:transparent;border-width:0px;border:none;"');
  var divApplyDraggable    = createHtml('div', applyDraggable + selectApplyDraggable, 'style="position:absolute; top:460px; left:60px;"');

  //remove all
  createModal('removeAllVisAlert', 'Remove All Visualizations', 'This action will remove all visualizations from your dashboard. <br/> Are you sure you want to proceed?', ['Yes', 'No']); //alert for remove all
  var removeAllButton = createHtml('img', '', 'id="removeAllVis" src="./imgs/icons/containerIcons/originals/bin.png" data-toggle="modal" data-target="#removeAllVisAlert"  style="position:absolute; top:225px; left:331px; width:30px; cursor:pointer;"');

  //apply button
  var visStyleButton = createHtml('button', 'Apply', 'id="visStyleButton" class="btn btn-default" style="position:absolute; top:520px; left:50%; transform:translate(-50%, 0%);"');


  $('#visualizationStyleContent').html(visualizationTitle + previewImageDiv + divBkg + divRadiusBkg + divColorBkg + divFont + divColorFont + divShadowFont + divColorShadowFont + divApplyUpdate + divApplyDraggable + removeAllButton + visStyleButton);

  $('#borderRadiusVis').val('10');
  $('#fontSizeVis').val('13');
  $('#fontShadowInput1Bkg').val('0');
  $('#fontShadowInput2Bkg').val('0');
}

function updateStyleVisualizationPreview(){
  var bkgValue        = $('#bkgSelect').val();
  var bkgRadius       = $('#borderRadiusVis').val();
  var bkgRadiusSelect = $('#borderRadiusVisSelect').val();
  var bkgColor        = $('#colorInputBkg').val();
  var fontSelect      = $('#fontSelect').val();
  // var fontSize        = $('#fontSizeVis').val();
  var shadowTopFont     = $('#fontShadowInput1Bkg').val();
  var shadowLeftFont    = $('#fontShadowInput2Bkg').val();
  var shadowColorFont   = $('#fontShadowColorBkg').val();
  var fontColor       = $('#colorInputVisFont').val();
  var previewText     = $('#visStylePreviewDiv').find("h1, h2, h3, h4, h5, h6, p, text");

  if (bkgValue == "Don't apply")
    $('#visStylePreviewDiv').css('background-color', 'transparent');
  else {
    $('#visStylePreviewDiv').css('background-color', bkgColor);
    $('#visStylePreviewDiv').css('border-radius', bkgRadius + bkgRadiusSelect);
  }

  $(previewText).each(function(){
    $(this).css("font-family", fontSelect);
    // $(this).css("font-size", fontSize + 'px');
    $(this).css("textShadow", shadowTopFont + 'px ' + shadowLeftFont + 'px ' + shadowColorFont);
    $(this).css("color", fontColor);
  });
}

function updateStyleAllVisualizations(){
  var bkgValue        = $('#bkgSelect').val();
  var bkgRadius       = $('#borderRadiusVis').val();
  var bkgRadiusSelect = $('#borderRadiusVisSelect').val();
  var bkgColor        = $('#colorInputBkg').val();
  var fontSelect      = $('#fontSelect').val();
  // var fontSize        = $('#fontSizeVis').val();
  var shadowTopFont   = $('#fontShadowInput1Bkg').val();
  var shadowLeftFont  = $('#fontShadowInput2Bkg').val();
  var shadowColorFont = $('#fontShadowColorBkg').val();
  var fontColor       = $('#colorInputVisFont').val();

  var updateVis = $('#selectApplyUpdate').val();
  var dragVis   = $('#selectApplyDraggable').val();

  var visualizations = $('#visualizationsBody').find('.visualization');
  var previewText;

  $(visualizations).not('.textVisualization').each(function(){
    if (bkgValue == "Don't apply")
      $(this).css('background-color', 'transparent');
    else {
      $(this).css('background-color', bkgColor);
      $(this).css('border-radius', bkgRadius + bkgRadiusSelect);
    }

    previewText = $(this).find("h1, h2, h3, h4, h5, h6, h7, p, text");
    updateVisualizationFont(previewText, fontSelect, fontColor, shadowTopFont, shadowLeftFont, shadowColorFont);
  });

  updateAllVisualizations = (updateVis == 'Automatically') ? true : false;
  dragAllVisualizations   = (dragVis == 'Enable') ? true : false;

  hideContainer("settingsContainer", ANIMATIONTIME, ["5%", "95%"], hideContainerContent);
}

function updateVisualizationFont(previewText, fontSelect, fontColor, shadowTopFont, shadowLeftFont, shadowColorFont){
  $(previewText).each(function(){
    $(this).css("font-family", fontSelect);
    // $(this).css("font-size", fontSize + 'px');
    $(this).css("textShadow", shadowTopFont + 'px ' + shadowLeftFont + 'px ' + shadowColorFont);
    $(this).css("color", fontColor);
    $(this).css("fill", fontColor);
  });
}


function removeAllVisualizations(){
  $('#visualizationsBody').html('');
  removeVisFromArrays();
}

function removeVisFromArrays(){
  areaChartsObjArray = [];
  barChartsObjArray = [];
  calendarHeatmapObjArray = [];
  imagesObjArray = [];
  lineChartsObjArray = [];
  mapObjArray = [];
  pieChartsObjArray = [];
  timelineObjArray = [];
  textVisualizationObjArray = [];
}

//update data in the server
function updateVisualizationsDetailsOptions(){
  var visualizationsDetailsObj = {};

  visualizationsDetailsObj['background']       = $('#bkgSelect').val().replace('\'', '|');
  visualizationsDetailsObj['backgroundRadius'] = $('#borderRadiusVis').val() + ' ' + $('#borderRadiusVisSelect').val();
  visualizationsDetailsObj['backgroundColor']  = $('#colorInputBkg').val();

  visualizationsDetailsObj['fontFamily']      = $('#fontSelect').val();
  visualizationsDetailsObj['fontShadow']      = $('#fontShadowInput1Bkg').val() + ' ' + $('#fontShadowSelect1Bkg').val() + ' ' + $('#fontShadowInput2Bkg').val() + ' ' + $('#fontShadowSelect2Bkg').val();
  visualizationsDetailsObj['fontColor']       = $('#colorInputVisFont').val();
  visualizationsDetailsObj['fontShadowColor'] = $('#fontShadowColorBkg').val();

  visualizationsDetailsObj['updateVis']  = $('#selectApplyUpdate').val().replace('\'', '|');
  visualizationsDetailsObj['enableDrag'] = $('#selectApplyDraggable').val();
  visualizationsDetailsObj['type']       = 'visualizationsDetails';

  sendDataToServer(visualizationsDetailsObj, '/definitions', null);
}

//Load visualizations details data stored in the server
function visualizationsDetailsLoad(objData){
  $('#bkgSelect').val(objData.background.replace('|','\''));
  $('#borderRadiusVis').val(objData.backgroundRadius.split(' ')[0]);
  $('#borderRadiusVisSelect').val(objData.backgroundRadius.split(' ')[1]);
  $('#colorInputBkg').val(objData.backgroundColor);
  $('#fontSelect').val(objData.fontFamily);
  $('#fontShadowInput1Bkg').val(objData.fontShadow.split(' ')[0]);
  $('#fontShadowInput2Bkg').val(objData.fontShadow.split(' ')[2]);
  $('#fontShadowColorBkg').val(objData.fontShadowColor);
  $('#colorInputVisFont').val(objData.fontColor);

  $('#selectApplyUpdate').val(objData.updateVis.replace('|','\''));
  $('#selectApplyDraggable').val(objData.enableDrag);

  updateStyleVisualizationPreview();
  updateStyleAllVisualizations();
}
