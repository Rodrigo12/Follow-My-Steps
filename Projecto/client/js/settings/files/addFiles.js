//create add file container content
function createAddFilesContent(){
  var addTitle  = createHtml('h1', 'Add Files', 'id="addTitle" style="text-align:center;margin-top:60px;"');
  var imgFile   = createHtml('img', '', 'id="fileIcon" src="/static/imgs/pluginIcons/fileIcon.png"');
  var imgFolder = createHtml('img', '', 'id="folderIcon" src="/static/imgs/pluginIcons/folderIcon.png"');

  //switch
  var input     = createHtml('input', '', 'type="checkbox"');
  var sliderDiv = createHtml('div', '', 'class="slider round"');
  var label     = createHtml('label', input + sliderDiv, 'class="switch"');

  //plugins
  var div          = createHtml('div', imgFile + imgFolder + label, 'class="toogleSwitch"');
  var divPlugins   = createHtml('div', '', 'id="plugins"');
  var submitButton = createHtml('input', '', 'type="button" class="btn btn-default" id="submitButton" value="Select" disabled');

  $('#pluginForm').html(addTitle + div + divPlugins + submitButton);
}
