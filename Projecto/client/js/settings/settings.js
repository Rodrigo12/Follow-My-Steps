function settingsCreateContent(){
  //chose between images saved on server or external link
  var imageFiles      = createHtml("img", "", "id='imageFiles' class='imageSettingsType' src='imgs/pluginIcons/filesIcon.png'");
  var textFiles       = createHtml("h5", 'Files', " class='textSettingsType'");
  var divImageFiles   = createHtml("div", imageFiles + textFiles ,   "id='divImageFiles' class='divSettingsImage leftImageSettings' data-toggle='collapse' data-target='#divFilesCollapse' ");

  var imageFilesAdd      = createHtml("img", "", "class='imageSettingsType' src='imgs/icons/containerIcons/originals/fileAdd.png'");
  var textFilesAdd       = createHtml("h5", 'Add', "class='textSettingsType'");
  var divFilesAdd        = createHtml("div", imageFilesAdd+textFilesAdd, "id='divFilesAdd' class='divSettingsCollapseImage'");
  var imageFilesUpdate   = createHtml("img", "", "class='imageSettingsType' src='imgs/icons/containerIcons/originals/fileUpdate.png'");
  var textFilesUpdate    = createHtml("h5", 'Update', "class='textSettingsType'");
  var divFilesUpdate     = createHtml("div", imageFilesUpdate+textFilesUpdate, "id='divFilesUpdate' class='divSettingsCollapseImage'");
  var imageFilesRemove   = createHtml("img", "", "class='imageSettingsType' src='imgs/icons/containerIcons/originals/fileRemove.png'");
  var textFilesRemove    = createHtml("h5", 'Delete', "class='textSettingsType'");
  var divFilesRemove     = createHtml("div", imageFilesRemove+textFilesRemove, "id='divFilesRemove' class='divSettingsCollapseImage '");

  var divFilesCollapse   = createHtml("div", divFilesAdd+divFilesUpdate+divFilesRemove, 'id="divFilesCollapse" class="collapse divCollapse"');


  //chose between images saved on server or external link
  var imageStyle      = createHtml("img", "", "id='imageStyle' class='imageSettingsType' src='imgs/icons/containerIcons/originals/edit.png'");
  var textStyle       = createHtml("h5", "Style", "class='textSettingsType'");
  var divImageStyle   = createHtml("div", imageStyle + textStyle ,   "id='divImageStyle' class='divSettingsImage centerImageSettings' data-toggle='collapse' data-target='#divStyleCollapse' ");

  var imageStyleVisualization = createHtml("img", "", "class='imageSettingsType' src='imgs/icons/containerIcons/originals/chartIcon.png'");
  var textStyleVisualization  = createHtml("h5", 'Visualizations', "class='textSettingsType'");
  var divStyleVisualization   = createHtml("div", imageStyleVisualization+textStyleVisualization, " id='divStyleVisualization' class='divSettingsCollapseImage'");
  var imageStyleBackground    = createHtml("img", "", "class='imageSettingsType' src='imgs/icons/containerIcons/originals/background.png'");
  var textStyleBackground     = createHtml("h5", 'Background', "class='textSettingsType'");
  var divStyleBackground      = createHtml("div", imageStyleBackground+textStyleBackground, "id='divStyleBackground' class='divSettingsCollapseImage'");
  var imageStyleFont          = createHtml("img", "", "class='imageSettingsType' src='imgs/icons/containerIcons/originals/font.png'");
  var textStyleFont           = createHtml("h5", 'Font', "class='textSettingsType'");
  var divStyleFont            = createHtml("div", imageStyleFont+textStyleFont, "id='divStyleFont' class='divSettingsCollapseImage '");

  var divStyleCollapse = createHtml("div", divStyleVisualization+divStyleBackground+divStyleFont, 'id="divStyleCollapse" class="collapse divCollapse"');


  //chose between images saved on server or external link
  var imageAdvanced    = createHtml("img", "", "id='imageAdvanced' class='imageSettingsType ' src='imgs/icons/containerIcons/originals/advanced.png'");
  var textAdvanced     = createHtml("h5", "Advanced", "class='textSettingsType'");
  var divImageAdvanced = createHtml("div", imageAdvanced + textAdvanced ,   "id='divImageAdvanced' class='divSettingsImage rightImageSettings' data-toggle='collapse' data-target='#divAdvancedCollapse'  ");

  var imageAdvancedCache  = createHtml("img", "", "class='imageSettingsType' src='imgs/icons/containerIcons/originals/cache.png'");
  var textAdvancedCache   = createHtml("h5", 'Cache', "class='textSettingsType'");
  var divAdvancedCache    = createHtml("div", imageAdvancedCache+textAdvancedCache, "id='divAdvancedCache' class='divSettingsCollapseImage'");
  var imageAdvancedReport = createHtml("img", "", "class='imageSettingsType' src='imgs/icons/containerIcons/originals/report.png'");
  var textAdvancedReport  = createHtml("h5", 'Report', "class='textSettingsType'");
  var divAdvancedReport   = createHtml("div", imageAdvancedReport+textAdvancedReport, "id='divAdvancedReport' class='divSettingsCollapseImage'");
  var imageAdvancedSave   = createHtml("img", "", "class='imageSettingsType' src='imgs/icons/containerIcons/originals/save.png'");
  var textAdvancedSave    = createHtml("h5", 'Save', "class='textSettingsType'");
  var divAdvancedSave     = createHtml("div", imageAdvancedSave+textAdvancedSave, "id='divAdvancedSave' class='divSettingsCollapseImage '");

  var divAdvancedCollapse = createHtml("div", divAdvancedCache+divAdvancedReport+divAdvancedSave, 'id="divAdvancedCollapse" class="collapse divCollapse"');


  $('#filesDetails').html( divImageFiles + divImageStyle + divImageAdvanced + divFilesCollapse + divStyleCollapse + divAdvancedCollapse);
}

var settingsImagePosition;
$(document).on('click', '.divSettingsImage', function(){
  var divID, imgID, fadeElementsID, text = $(this)[0].innerText;

  if (text.includes('Files')) {
    divID = 'divImageFiles';  imgID = 'imageFiles'; fadeElementsID = ['divImageStyle', 'divImageAdvanced'];
  }else if (text.includes('Style')) {
    divID = 'divImageStyle';  imgID = 'imageStyle'; fadeElementsID = ['divImageFiles', 'divImageAdvanced'];
  }else if (text.includes('Advanced')) {
    divID = 'divImageAdvanced';  imgID = 'imageAdvanced'; fadeElementsID = ['divImageStyle', 'divImageFiles'];
  }

  if($('#'+divID)[0].offsetWidth != 150){
    settingsImageLeft = $('#'+divID)[0].offsetLeft;
    resizeAndMoveImageSettings(divID, imgID, fadeElementsID, 150, 90, ['110px', '200px'], 0.0, 'none');
  }else
    resizeAndMoveImageSettings(divID, imgID, fadeElementsID, 100, 50, ['180px', settingsImageLeft + 'px'], 1.0, 'inline-block');
});

//Function used to increase or decrease the link or server button in the background container
function resizeAndMoveImageSettings(divID, imgID, fadeElementsID, divSize, imgSize, position, opacity, display){
  incrementAndMove(divID, divSize, divSize, ANIMATIONTIME, null, position);
  incrementWidthAndHeight(imgID, imgSize, imgSize, ANIMATIONTIME, null);
  fade(fadeElementsID[0], opacity, ANIMATIONTIME, null, display);
  fade(fadeElementsID[1], opacity, ANIMATIONTIME, null, display);
}
