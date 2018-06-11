var fileOptionSelected = 'settingsContainerContent';

//////LAST CLICKED ELEMENT//////
$(document).on("click", function(evt){
  var imageVisualization = $( evt.target ).closest( ".imageInVisualization" );
  var visualization      = $( evt.target ).closest( ".visualization" );

  if (imageVisualization.length > 0)
    lastClickedItem = imageVisualization[0];
  else if (visualization.length > 0)
    lastClickedItem = visualization[0];
  else
    lastClickedItem = '';
});

///////PLUGIN REMOVE INTERACTION////////
$(document).on('mouseover', '.checkmarkBlockIcon', function(){
  $(this).attr('src', './imgs/closeBlockIcon.png');
});

$(document).on('mouseleave', '.checkmarkBlockIcon', function(){
  $(this).attr('src', './imgs/checkmarkBlockIcon.gif');
});

$(document).on('click', '.checkmarkBlockIcon', function(){
  var parent      = $($(this).parent()).parent();
  removeInputField(parent);
});

///////LATERAL BUTTONS MOUSE MOVEMENT INTERACTION////////
$(document).on('mousemove', function() {
    clearTimeout(lateralButtonTimeout);

    lateralButtonTimeout = setTimeout(function() {
        hideLateralButtons();
        lateralButtonHidden = true;
    }, 10000);//10 seconds

    if (lateralButtonHidden) {
      showLateralButtons();
      lateralButtonHidden = false;
    }
});


/////////////LATERAL BUTTONS CONTAINERS/////////////
$("#addVisualizationLateralButton").on("click", function(){
  fileOptionSelected = 'visualizationContent';

  if ($('#visualizationContainer').css('display') == 'block')
    return;

  var width = 690, height = 650;
  var containerInitialPosition = $(this).offset();
  var containerFinalPosition = [(($(window).height()/2) - height/2), (($(window).width()/2) - width/2)];
  $('.closeContainerIcon').css('display', 'block');
  showContainer("visualizationContainer", width, height, containerInitialPosition, containerFinalPosition, ANIMATIONTIME, 0); //Open the container and display its content
});

$("#settingsLateralButton").on("click", function(){
  fileOptionSelected = 'settingsContainerContent';

  if ($('#settingsContainer').css('display') == 'block')
    return;

  loadPlugins();
  var width = 550, height = 400;
  var containerInitialPosition = $(this).offset();
  var containerFinalPosition = [(($(window).height()/2) - height/2), (($(window).width()/2) - width/2)];

  $("#" + 'settingsContainer').css({top: containerInitialPosition.top, left: containerInitialPosition.left, display:'block'});
  incrementAndMove('settingsContainer', width+"px", height+"px", ANIMATIONTIME, null, containerFinalPosition);

  $('.closeContainerIcon').css('display', 'block');
  setTimeout(function (){ $('#settingsTitle').css('display', 'block'); $('#settingsContainerContent').css('display', 'block'); $('#settingsContainerContent').css('opacity', '1.0');  }, ANIMATIONTIME);
});


$("#helpLateralButton").on("click", function(){
  fileOptionSelected = 'helpContainerContent';

  if ($('#helpContainer').css('display') == 'block')
    return;

  var width = 550, height = 500;
  var containerInitialPosition = $(this).offset();
  var containerFinalPosition = [(($(window).height()/2) - height/2), (($(window).width()/2) - width/2)];
  showContainer("helpContainer", width, height, containerInitialPosition, containerFinalPosition, ANIMATIONTIME, 0); //Open the container and display its content
  $('.closeContainerIcon').css('display', 'block');
  setTimeout(function (){ $('#helpContainerContent').css('display', 'block'); $('#helpContainerContent').css('opacity', '1.0');  }, ANIMATIONTIME);
});

$("#timelineLateralButton").on("click", function(){
  fileOptionSelected = 'timelineContainerContent';

  if ($('#timelineContainer').css('display') == 'block')
    return;

  var width = 550, height = 350;
  var containerInitialPosition = $(this).offset();
  var containerFinalPosition = [(($(window).height()/2) - height/2), (($(window).width()/2) - width/2)];
  showContainer("timelineContainer", width, height, containerInitialPosition, containerFinalPosition, ANIMATIONTIME, 0); //Open the container and display its content
  $('.closeContainerIcon').css('display', 'block');
  setTimeout(function (){ $('#timelineContainerContent').css('display', 'block'); $('#timelineContainerContent').css('opacity', '1.0');  }, ANIMATIONTIME);
});


//click on the image while selecting visualization to add
$(document).on('click', '.visualizationPickerImage', function(evt){
  var width = 540, height = 600;
  currentVisualizationType = evt.target.alt;
  callVisualizationDetails(evt.target.alt);
  var finalPosition = [(($(window).height()/2) - 600/2), (($(window).width()/2) - 540/2)];
  if (currentVisualizationType == 'timeline') //reduce size if is timeline
    height = 400;
  else if (currentVisualizationType == 'text') //reduce size if is text
    height = 420;
  incrementAndMove('visualizationContainer', width, height, ANIMATIONTIME, null, finalPosition);
});

//click on the title while selecting visualization to add
$(".visualizationPickerText").on("click", function(){
  var width = 540, height = 600;
  var parentElement = $(evt.target).parentElement;
  var image         = $(parentElement).find('img')[0];
  currentVisualizationType = image.alt;
  callVisualizationDetails(image.alt);
  var finalPosition = [(($(window).height()/2) - 600/2), (($(window).width()/2) - 540/2)];
  if (currentVisualizationType == 'timeline') //reduce size if is timeline
    height = 400;
  else if (currentVisualizationType == 'text') //reduce size if is text
    height = 420;
  incrementAndMove('visualizationContainer', width, height, ANIMATIONTIME, null, finalPosition);
});

//click on div while selecting visualization to add
$(".visualizationPicker").on("click", function(){
  var width = 540, height = 600;
  var image         = $(evt.target).find('img')[0];
  currentVisualizationType = image.alt;
  callVisualizationDetails(image.alt);
  var finalPosition = [(($(window).height()/2) - 600/2), (($(window).width()/2) - 540/2)];
  if (currentVisualizationType == 'timeline') //reduce size if is timeline
    height = 400;
  else if (currentVisualizationType == 'text') //reduce size if is text
    height = 420;
  incrementAndMove('visualizationContainer', width, height, ANIMATIONTIME, null, finalPosition);
});

//Hide if doesn't click on the popover, if clicks on the close icon and if it's not clicking the datepicker
$(document).click(function (evt) {
  var calendarTouched = false;
  try{
    if (evt.target.className.indexOf('day') > -1 || evt.target.className.indexOf('month') > -1|| evt.target.className.indexOf('year') > -1)
      calendarTouched = true;

  }catch (err){
    closeOtherPopovers('.lateralButton', evt);
    closeOtherPopovers('.sls-handle', evt);
    return;
  }

  if(calendarTouched || ($('.date').has(evt.target).length != 0) || ($('.datepicker').has(evt.target).length != 0) || ($('.day').has(evt.target).length != 0) || ($('.month').has(evt.target).length != 0) || ($('.year').has(evt.target).length != 0) || ($('#loading').has(evt.target).length != 0))
    return;

  if (($('.popover').has(evt.target).length == 0) || $(evt.target).is('.close'))
    closeOtherPopovers('.lateralButton', evt);

  if (($('.sls-handle').has(evt.target).length == 0) || $(evt.target).is('.close'))
    closeOtherPopovers('.sls-handle', evt);

});


/////////////COMMON CONTAINERS BUTTONS/////////////
$(document).on('click', '.backArrowContainerIcon', function(){
  var containerID = $(this).parent()[0].id;
  var width, height, containerFinalPosition, childIndex, containerShown, hideContainerPosition  = [];
  $('.backArrowContainerIcon').css('display', 'none');
  if (containerID == 'settingsContainer'){
    width = 540; height = 400, childIndex = 1;
    containerFinalPosition = [(($(window).height()/2) - height/2), (($(window).width()/2) - width/2)];      //The final position is the center of the screen
    containerShown = 'settingsContainerContent';

    $('#settingsTitle').css('display', 'block');
    $('.backArrowContainerIcon').css('display', 'none');
    $('#filesContent').css('display', 'none');
    $('#stylesContent').css('display', 'none');
    $('#advancedContent').css('display', 'none');

  }else if(containerID == 'visualizationContainer'){
    width = 690; height = 650, childIndex = 0;
    containerFinalPosition = [(($(window).height()/2) - height/2), (($(window).width()/2) - width/2)];      //The final position is the center of the screen
    containerShown = 'visualizationContent';
    fileOptionSelected = 'visualizationContentDetails';

  }

  console.log(fileOptionSelected);

  fadeAndMove(fileOptionSelected, 0.0, ANIMATIONTIME/2, function(){           //move the visualization slightly left
    incrementAndMove(containerID, width, height, ANIMATIONTIME, null, containerFinalPosition);
    fileOptionSelected = containerShown;
    $('#' + containerID).css('display', 'inline-block');
    showContainerChild(containerID, ANIMATIONTIME*2, childIndex, "0px", "0px");
  }, hideContainerPosition, 'none');

});

$(document).on('click', '.closeContainerIcon', function(){
  var containerID = $(this).parent()[0].id;
  hideContainer(containerID, ANIMATIONTIME, ['16%', '95%'], hideContainerContent, hide);
});

//////MENU CLOSE INTERACTION//////
$(document).on('click', '.nav-icon', function () {
		$(this).toggleClass('open'); //toogle between menu icon and close icon

    if ($(this).hasClass('open')) {
      //close visualization settings container
      var parent = $(this).parent();
      incrementWidth($(parent)[0].id, '210px', ANIMATIONTIME, null);
    }else {
      //open visualization settings container
      var parent = $(this).parent();
      incrementWidth($(parent)[0].id, '35px', ANIMATIONTIME, null);
    }
});

//////DATE CHANGER INTERACTION//////
$(document).on('click', '.submitNewDates', function () {
  var inputs = $('.date :input');
  if (inputs[0].value)
    startDate = inputs[0].value;
  if (inputs[1].value)
    endDate = inputs[1].value;
  closeAllPopovers();
  $('.visualization').trigger('time', ['timelineEvent']);
});

$(document).on('change', '.date :input', function () {
  var newDate = $(this).val();

  if (newDate.split('/')[1])    //Check if it's on the right format
    $(this).val(convertFromConventionalDate(newDate));
});

//timeline date changer
$(document).on('click', '.updateTimelineDates', function(){
  var popover   = $(this).parent();
  var input     = $(popover).find('input')[0];
  var value     = ($(input).val()) ? $(input).val() : input.placeholder;
  setTimelineHandler(currentHandlerTouched, value, true);
})


//////DATE PICKER INTERACTION//////
$(document).on('click', '.date', function () {
  var datePoint = (($(this).attr('id') == 'startDate')) ? startDate : endDate;
  var todayDate = formatDate(new Date(), true);

    $(this).datepicker({
      orientation: 'top',
      dateFormat: ['mm/dd/yyyy', 'mm dd yyyy', 'mm-dd-yyyy', 'MM dd yyyy', 'M dd yyyy'],
      autoclose:true,
      endDate: todayDate,
      todayHighlight: true,
      todayBtn:true
    });

    //update datepicker date
    if($($(this).find('input')[0]).val())
      $(this).datepicker("setDate", convertToDefaultDateFromConventional($($(this).find('input')[0]).val()) );

    $(this).datepicker('show');
});

//////TOOLTIP INTERACTION//////
//Toogle tooltip
$(document).ready(function(){
  $('[data-toggle="tooltip"]').tooltip();
});

//remove tooltip on mouseenter
$(document).on('mouseenter', '.tooltip, .nvtooltip', function(){
  console.log('remove tooltip');
  $(this).remove();
});

//////MODALS//////
//////REMOVE ALL VISUALIZATIONS INTERACTION//////
$(document).on('click', '#removeAllVisAlert .modal-footer button', function (event) {
  if(event.target.innerHTML == 'Yes')
    removeAllVisualizations();
});

$(document).on('click', '.modalFooterBtn', function(){
  var modal = $(this).closest( ".modal" )[0];
  modalID = modal.id;
  $("#" + modalID).modal("hide");                                             //Add eventListener to close the modal each time that one of the buttons is clicked
  if($(this).html() == "Cancel")                                              //If the button clicked was "Cancel" change the value of the input to CancelButton
    $('#'+modalID+" #buttonSelected").val("CancelButton");
});


//////VISUALIZATION ELEMENTS POPOVER INTERACTION//////
//Lateral buttons popover
$(document).on('click', ".popoverElement", function() {
  closePopover($(this).parent().parent());                                                                //close the popover
});


//////CALENDAR INTERACTION//////
$(document).on('click', '.calendarBackArrow', function(){
  var parentID  = $(this).parent()[0].id;
  var chartData = getObjWithKeyInArray(calendarHeatmapObjArray, parentID);
  var objData   = createCalendarProtoObject(parentID, 'year', 'month', "%m", chartData['date'], chartData['maxvalue'], chartData['monthHighestValue'], chartData['updateData'], chartData['updateMonthData'], chartData['objData'].cellSize);
  //delete previous calendar
  chartData[parentID] = chartData[parentID].destroy();
  var isPreview = (parentID.includes('Preview')) ? true : false;

  //remove all tooltips
  $('#'+parentID).find('.ch-tooltip').remove();

  var calendarProperties = {};
  calendarProperties['maxvalue']          = chartData['maxvalue'];
  calendarProperties['monthHighestValue'] = chartData['monthHighestValue'];
  calendarProperties['highlightToday']    = chartData['highlightToday'];
  calendarProperties['legend']            = chartData['legend'];
  calendarProperties['legendColor']       = chartData['legendColor'];
  calendarProperties['legendPosition']    = chartData['legendPosition'];
  calendarProperties['label']             = chartData['label'];
  calendarProperties['width']             = chartData['width'];
  calendarProperties['height']            = chartData['height'];
  calendarProperties['filename']          = chartData['filename'];

  if (!isPreview) {
    removeObjFromArrayByProperty(calendarHeatmapObjArray, parentID);
    addCalendarHeatmap(parentID, new CalHeatMap(), objData, calendarProperties, false);
    if(calendarProperties.legendColor)
      updateCalendarColor(parentID, calendarProperties.legendColor);
    //getDataFromServerToRefresh(parentID, calendarHeatmapObjArray[1][parentID], 'calendarHeatmap', '/data', [$('#xAxisSelect').val(), $('#yAxisSelect').val(), $('#aggregationSelect').val(), 'years', startDate, endDate, $('#fileSelectChart').val(), 'All'], 'updateHeatmapCalendar');
  }else{
    addCalendarHeatmap(parentID, new CalHeatMap(), objData, calendarProperties, true);
    if(calendarProperties.legendColor)
      updateCalendarColor(parentID, calendarProperties.legendColor);
    updateStyleAllVisualizations();
  }
});

$(document).on('mouseover', '.hover_cursor', function(evt){
  var parentVisualization = $(this).closest('.visualization')[0];
  //tooltips are only deleted when we pass from months to years, so 2 tooltips means months and 1 years
  var graphLabel  = $(parentVisualization).find('.graph-label')[0].innerHTML;
  var tooltipType = (isNaN(parseInt(graphLabel))) ? 2 : 1;
  $(parentVisualization).find('.ch-tooltip').each(function(){
    //check if there is a legend
    var legendOffset = 0, legend = $($(this).closest('.visualization')).find('.graph-legend');
    if (legend.length > 0)
      legendOffset = - 8;

    //width and height difference between parent and preview
    var widthDiff = parseFloat($(parentVisualization).css('width')) - 300;
    var heightDiff = parseFloat($(parentVisualization).css('height')) - 240;

    var currentTooltipTop  = $(this).css('top').replace('px', '');
    var currentTooltipLeft = $(this).css('left').replace('px', '');

    var topOffset, leftOffset;
    if (tooltipType == 1) { // years
      topOffset  = 90 + heightDiff/2 + legendOffset;
      leftOffset = 20 + widthDiff/2;
    }else{  //months
      topOffset  = 25 + heightDiff/2 + legendOffset;
      leftOffset = 95 + widthDiff/2;
    }

    $(this).css('top', parseFloat(currentTooltipTop) + topOffset);
    $(this).css('left', parseFloat(currentTooltipLeft) + leftOffset);
  });
});

$(document).on('change', '#widthCalendarSelectChart, #heightCalendarChart, #highlightTodayCalendarSelectChart, #labelCalendarSelectChart, #legendCalendarSelectChart, #legendPositionCalendarSelectChart', function(evt){
  updateCalendarPreview(this);
});

//////FILES MENU INTERACTION//////
//change file select
$(document).on('click', "#divFilesAdd, #divFilesUpdate, #divFilesRemove", function(evt) {
  var divElemID = $(this)[0].id;
  var prevElem  = fileOptionSelected;
  var width, height, childIndex;

  if (prevElem == 'pluginForm') {
    addFileWidth  = $('#settingsContainer').width() + 30;
    addFileHeight = $('#settingsContainer').height() + 10;
  }

  $('#pluginForm').css('display', 'none');
  $('#updateContent').css('display', 'none');
  $('#removeContent').css('display', 'none');

  if (divElemID.includes('Add')) {
    width = addFileWidth; height = addFileHeight, childIndex = 0, fileOptionSelected = 'pluginForm';
  }else if (divElemID.includes('Update')) {
    width = 540; height = 300, childIndex = 1, fileOptionSelected = 'updateContent';
  }else if (divElemID.includes('Remove')) {
    width = 750; height = 600, childIndex = 2, fileOptionSelected = 'removeContent';
  }
  changeContainerContent(width, height, 'filesContent', childIndex, prevElem);

  $('#removableFilesSelect').val('All').change();
});


//////SETTINGS MENU INTERACTION//////
$(document).on('click', "#divStyleBackground, #divStyleVisualization, #divStyleFont", function(evt) {
  var divElemID = $(this)[0].id;
  var prevElem  = fileOptionSelected;
  var width, height, childIndex;

  $('#visualizationStyleContent').css('display', 'none');
  $('#backgroundContent').css('display', 'none');
  $('#fontContent').css('display', 'none');

  if (divElemID.includes('Visualization')) {
    width = 540; height = 580, childIndex = 0, fileOptionSelected = 'visualizationStyleContent';
  }else if (divElemID.includes('Background')) {
    width = 540; height = 400, childIndex = 1, fileOptionSelected = 'backgroundContent';
    backgroundImagePicker();
  }else if (divElemID.includes('Font')) {
    width = 540; height = 400, childIndex = 2, fileOptionSelected = 'fontContent';
  }
  changeContainerContent(width, height, 'stylesContent', childIndex, prevElem);
});

//////ADVANCED MENU INTERACTION//////
$(document).on('click', "#divAdvancedCache, #divAdvancedReport, #divAdvancedSave", function(evt) {
  var divElemID = $(this)[0].id;
  var prevElem  = fileOptionSelected;
  var width, height, childIndex;

  $('#cacheContent').css('display', 'none');
  $('#reportContent').css('display', 'none');
  $('#saveContent').css('display', 'none');

  if (divElemID.includes('Cache')) {
    width = 540; height = 300, childIndex = 0, fileOptionSelected = 'cacheContent';
  }else if (divElemID.includes('Report')) {
    width = 540; height = 350, childIndex = 1, fileOptionSelected = 'reportContent';
  }else if (divElemID.includes('Save')) {
    width = 540; height = 300, childIndex = 2, fileOptionSelected = 'saveContent';
  }

  changeContainerContent(width, height, 'advancedContent', childIndex, prevElem);
});


function changeContainerContent(width, height, divParent, childIndex, prevElem){
  var containerInitialPosition = $(this).offset();                                          //The initial position is the settingsContainer current position
  var containerFinalPosition = [(($(window).height()/2) - height/2), (($(window).width()/2) - width/2)];      //The final position is the center of the screen
  var hideContainerPosition  = [];

  fadeAndMove(prevElem, 0.0, ANIMATIONTIME/2, function(){           //move the visualization slightly left
    incrementAndMove('settingsContainer', width, height, ANIMATIONTIME, null, containerFinalPosition);
    $('#' + divParent).css('display', 'inline-block');
    $('.backArrowContainerIcon').css('display', 'block');
    $('#settingsTitle').css('display', 'none');

    showContainerChild(divParent, ANIMATIONTIME*2, childIndex, "0px", "0px");
  }, hideContainerPosition, 'none');
}

//////SWITCH BETWEEN FILES AND FOLDERS INTERACTION//////
$( document ).on('click', '.switch', function( event ) {                                        //Everytime that swtich changes
  var target = $( event.target );
  var inputPlugin = getCurrentInputPlugin();                                    //Get the input field
  console.log(inputPlugin);
  console.log($(inputPlugin));
  if ( target.is( ":checked" ) )                                                //If switch is checked then allow folders upload
    enableFoldersInput(inputPlugin);
  else
    enableFilesInput(inputPlugin);                                              //Otherwise allow files upload
});

//////SUBMIT FILES TO SERVER BUTTON INTERACTION//////
$(document).on('click', '#submitButton',function(e){                                         //Call function everytime that submit button is clicked
  e.preventDefault();
  var dataToSend = getDataFromInputFields();                                  //ex: [Obj, Obj, Obj]
  sendDataToServer(dataToSend, "/pluginData", null);
  fadeElements(['pluginForm', 'updateContent', 'removeContent'], 0.0, ANIMATIONTIME, null, 'none');
  pluginsNumber = 0;
  hideContainer("settingsContainer", ANIMATIONTIME, ["5%", "95%"], hideContainerContent);
});

//Get the data from the filled plugins input fields
function getDataFromInputFields(){
  var inputFieldsValues = [];
  $('.pluginData').each(function(){
    if($(this).val()) //make sure that is not null
      inputFieldsValues = inputFieldsValues.concat(JSON.parse($(this).val()));
  });

  return inputFieldsValues;
}

//////INSERT IMAGES BUTTON INTERACTION//////
//interaction for background image selecting
$(document).on('click', '.backgroundTypeContainer', function(evt){
  var element = getImageInImageContainer(evt);
  var containerElement = element.parentElement.parentElement.parentElement; //backgroundContainerContent

  var position = ["44px", "-30px"];
  var children = $('#' + containerElement.id).children();
  fadeAndMove(children[1].id, 0.0, ANIMATIONTIME, function(){           //move the visualization slightly left
      createBackgroundElements(element.src, element.alt);
      showContainerChild(containerElement.id, ANIMATIONTIME, 2, "0px", "0px");  //backgroundContainer
  }, position, 'none');

  evt.preventDefault();
});

//interaction for image selecting
$(document).on('click', '.imageTypeContainer', function(evt){
  var element       = getImageInImageContainer(evt);
  var parentElement = element.parentElement;
  var imageSrc      = $(parentElement).find('img').attr('src');
  var imagePath     = $(parentElement).find('img').attr('alt');

  if ($(parentElement).find('img').length == 2){                               //if image already has the check mark
    $(parentElement).find('img')[1].remove();                                  //remove the check mark
    removeFromArrayByString(imagesVizualizationSelected, imageSrc);            //reduce the number of images selected
    removeFromArrayByString(imagesVizualizationSelectedPath, imagePath);       //reduce the number of images selected
  }else if ($(parentElement).find('img').length == 1 && imagesVizualizationSelected.length < MAXIMAGESVISUALIZATION) { //if the image is not selected and the number of images is less than the MAXIMAGESVISUALIZATION
    var checkMark = createHtml('img', '', 'src="./imgs/checkmarkBlockIcon.gif" class="checkMarkImageSelected" style="position:absolute; width:15px; top:95px; right:53px;"'); //create check mark
    $(parentElement).append(checkMark);                                        //add the check mark to the image parent element
    imagesVizualizationSelected.push(imageSrc);                                //increase the number of images selected
    imagesVizualizationSelectedPath.push(imagePath);                           //increase the number of images selected
  }else if (imagesVizualizationSelected.length >= MAXIMAGESVISUALIZATION) {
    return;
  }

  $($('.imageDivPreview')[0]).remove();
  var divPreview = createImagesVisualization(300, 300, 5, 'id="imageDivPreview" class="imageDivPreview" style="position:absolute; left:50%; transform: translate(-50%, 0%); height:300px; width:300px; margin-bottom:1%;"');
  $('#visualizationEditDetails').append( divPreview );
  updateImageProperties("imageDivPreview");

  if (imagesVizualizationSelected.length >= MAXIMAGESVISUALIZATION) { //if max photos chosen
    $('.imageContainer').each(function(){
      if ($(this).find('img').length == 1) {
        changeOpacity(this, 0.3, ANIMATIONTIME);  //lower opacity of others
      }
    });
  }else if (imagesVizualizationSelected.length == MAXIMAGESVISUALIZATION -1){  //if not max photos chosen
    $('.imageContainer').each(function(){
      if ($(this).find('img').length == 1) {
        changeOpacity(this, 1.0, ANIMATIONTIME);  //increase opacity of others
      }
    });
  }
});

//Add images button interaction
function insertVisualizationImage(){
  var width    = $('#inputImageSizeWidth').val()  + $('#imageSelectPositionWidth').val();
  var height   = $('#inputImageSizeHeight').val() + $('#imageSelectPositionHeight').val();
  insertImage(width, height);
  addImageObj($('#imageDivPreview'));
  hideContainer('visualizationContainer', ANIMATIONTIME, ['16%', '95%'], hideContainerContent, hide);
}

//update background interaction
$(document).on('click','#inputLinkSpan',    function(){ changeToEditBkg(); });


//get image even if the user click on the image name or image container
function getImageInImageContainer(evt){
  if(hasClass(evt.target, 'imageContainer'))
    return evt.target.getElementsByTagName("IMG")[0];
  else if(hasClass(evt.target, 'imageTitleName'))
    return evt.target.parentElement.getElementsByTagName("IMG")[0];
  else
    return evt.target;
}

//Get Bottom of images visualization div (scroll)
function applyScroll(element, callback){
  $( element ).scroll(function() {
    if($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight)
      callback();
  });
}

function removeScroll(element){
  $( element ).scroll(function() {});
}

//////MOUSE HOVER PREVIEWS//////
//mouse enter/leave image div container
$(document).on( "mouseenter", "#imageDivPreview, #timelinePreview", function() {  $('#visualizationContainer').removeClass('draggable');  });       //remove draggable option from container while in previe
$(document).on( "mouseleave", "#imageDivPreview, #timelinePreview", function() {  $('#visualizationContainer').addClass('draggable'); });


$(document).on( "mouseenter", ".imageInVisualization", function() {  $( this ).resizable(); $( this ).resizable("option", "disabled", false); });
$(document).on( "mouseleave", ".imageInVisualization", function() {  $( this ).resizable(); $( this ).resizable( "option", "disabled", true ); });

$(document).on( "click", ".imageInVisualization", function() {
  var currentImage = $( this ).find('img')[0];
  $(currentImage).css('top', '0%');
  $(currentImage).css('left', '0%');
  $(currentImage).css('transform', 'translate(0%, 0%)');
});

$(document).on('resize','.imageInVisualization', function(){ console.log('resize');saveImagesChanges($(this)); });
$(document).on('click','.imageInVisualization', function(){ console.log('click');saveImagesChanges($(this)); });

//mouse enter/leave resizable icon
$(document).on( "mouseenter", ".ui-icon-gripsmall-diagonal-se", function() {
  var parentElement = $(this).parent();
  $(parentElement).removeClass('draggable');
});
$(document).on( "mouseleave", ".ui-icon-gripsmall-diagonal-se", function() {
  var parentElement = $(this).parent();
  $(parentElement).addClass('draggable');
});




//////SEARCH IMAGES INTERACTION//////
$(document).on('change', '#searchPhotoInput', function(evt){
  $("#visualizationDetails").html(createLoadingIcon());                                        //clear the visualization details
  numberInfoLoadedDB = 0;
  var numberOfImages = $('#imageVisualization'+imagesNumber).find('img').length;
  var params = [numberInfoLoadedDB, numberOfImages, $('#searchPhotoInput').val(), '', startDate, endDate];
  getDataFromServer('image', '/data', params, 'ContainerSetting');
});





//////ADD BUTTON INTERACTION//////
//Get the xaxis and yaxis value and request their values to the server
$(document).on('click', '.addVisualizationButton', function(evt){
  var params;
  var buttonParent = $(this)[0].parentElement;                                  //get the visualization container (add button parent)
  //console.log(buttonParent);
  if (buttonParent.getElementsByClassName('chartPreview').length != 0){
    window[getVisualizationType() + 'VisualizationElement']();
    return;
    //params = getChartParameters(buttonParent);
  }else if(buttonParent.getElementsByClassName('map').length != 0)
    params = ["photo", "location", "route"];
  else if(buttonParent.getElementsByClassName('heatmapCalendar').length != 0){
    calendarHeatmapVisualizationElement();
    return;
  }else if(buttonParent.getElementsByClassName('imageContainer').length != 0){
    insertVisualizationImage();
    return;
  }else if(buttonParent.getElementsByClassName('timeline').length != 0){
    timelineVisualizationElement();
    return;
  }else if(buttonParent.getElementsByClassName('textVisualization').length != 0){
    textVisualizationElement();
    return;
  }

  getDataFromServer(getVisualizationType(), '/data', params, 'VisualizationElement'); //get data from server
});


function getCalendarHeatmapParameters(buttonParent){
  var inputs = buttonParent.getElementsByClassName('updateSelect');
  var parameters = [];
  for (var index = 0; index < inputs.length; index++) {
    parameters.push($(inputs[index]).val());
  }
  return parameters;
}

function imageSelection(evt){
  var element = evt.target;
  var containerElement = element.parentElement; //visualizationContentDetails
  var position   = ["0px", "-30px"];
  fadeAndMove(containerElement.id, 0.0, ANIMATIONTIME, function(){           //move the visualization slightly left
    createImageElements();
    showContainerChild(containerElement.parentElement.id, ANIMATIONTIME, 2, "0px", "0px");  //visualizationContent
  }, position, 'none');
}

//////DROPDOWN INTERACTION//////
//Disable options and enable the corresponding ones each time that the user change the dropdown box
$(document).on('change','.xAxis',function(){
  var xAxisSelectOption = $( this).val();                                       //get option selected
  enableAllDropdownOptions($( this )[0]);                                       //enable all values in the select changed dropdown (to allow to select all options)
  $( ".yAxis" ).each(function(index) {                                          //loop to each y axis and enable or disable the corresponding options
    enableDropdownOptions($( this )[index], xAxisSelectOption);
  });
});

$(document).on('change','.yAxis',function(){
  var yAxisSelectOption = $( this).val();                                       //get option selected
  enableAllDropdownOptions($( this )[0]);                                       //enable all values in the select changed dropdown (to allow to select all options)
  $( ".xAxis" ).each(function(index) {                                          //loop to each y axis and enable or disable the corresponding options
    enableDropdownOptions($( this )[index], yAxisSelectOption);
  });
});


//////MAP DROPDOWN INTERACTION//////
$(document).on('change','#mapTypeDropdown',function(){
  removeMapElement();
  var optionSelected = getSelectOption(document.getElementById('mapTypeDropdown')).innerHTML;
  var optionValue = getSelectOption(document.getElementById('mapTypeDropdown')).value;
  createMapElement("#visualizationDetails",optionSelected, [500, 250], [51.505, -0.09], 5, optionValue);
});

//////TIMELINE MENU INTERACTION//////
//if clicked outside the datepicker, hide them
$(document).on('click','#timelineContainer',function(e){
  if ($(e.target).closest('.datepicker').length <= 0 && !$(e.target).is('input'))
    $('.datepicker').hide();
});

//close timeline menu if clicked on apply button
$(document).on('click','#timelineApplyButton',function(e){
  hideContainer('timelineContainer', ANIMATIONTIME, ['10%', '95%'], hideContainerContent, hide);
});

//////DETECT IF CLICKED ON CONTAINER//////
//////CLOSE CONTAINER//////
$(document).mouseup(function(e) {
    var containers = $(".container");
    var visibleContainer = null;
    var clockTouched = false;
    var calendarTouched = false;
    var modalPhotosTouched = false;
    var modalColumnTouched = false;
    var modalRemoveAllVisTouched = false;

    try{  if (e.target.className.animVal.indexOf('clockpicker') > -1 )  clockTouched = true;  //if selecting time in update container, dont close
    }catch (err){ }

    try{  if ($(e.target).closest('.datepicker').length > 0)  calendarTouched = true;  //if selecting date in timeline container, dont close
    }catch (err){ }

    if($($('#columnModalContainer').find('div')[0]).css('display') == 'block') modalColumnTouched = true;
    if($($('#photosModalContainer').find('div')[0]).css('display') == 'block') modalPhotosTouched = true;
    if($('#removeAllVisAlert').css('display') == 'block') modalRemoveAllVisTouched = true;
    for (var index = 0; index < containers.length; index++) {
      if (containers[index].style.display != 'none' && containers[index].style.display != '' && containers[index].style.display != null)
        visibleContainer = containers[index];
    }

    if (visibleContainer == null || clockTouched || calendarTouched || modalColumnTouched || modalPhotosTouched || modalRemoveAllVisTouched)
      return;
    else if (!($('#'+visibleContainer.id).is(e.target)) && $('#'+visibleContainer.id).has(e.target).length === 0) {
      var finalPosition;
      if (visibleContainer.id == 'settingsContainer'){
        //fadeElements(['pluginForm', 'updateContent', 'removeContent'], 0.0, ANIMATIONTIME, null, 'none');
        finalPosition = ['5%', '95%'];
      }else if(visibleContainer.id == 'timelineContainer')
        finalPosition = ['10%', '95%'];
      else if(visibleContainer.id == 'visualizationContainer')
        finalPosition = ['16%', '95%'];
      else if(visibleContainer.id == 'helpContainer')
        finalPosition = ['22%', '95%'];

      pluginsNumber = 0;
      hideContainer(visibleContainer.id, ANIMATIONTIME, finalPosition, hideContainerContent, hide);
    }
});


//////DETECT IF HOVER VISUALIZATION//////
$(document).on({
    mouseover: function () { //On hover
      //console.log('hover in');
      var graphID = $(this)[0].id;
      var visMenu = $('#' + graphID).find('.visButtonsContainer')[0];
      if ($(visMenu).css('opacity') == 0.0)
        fade($(visMenu)[0].id, 1.0, ANIMATIONTIME/3, null, 'block'); //if visualization menu is hidden, show it
    },
    mouseleave:function () {  //On hover out
      try{//console.log('hover out');
        var graphID = $(this)[0].id;
        var visMenu = $('#' + graphID).find('.visButtonsContainer')[0];

        $("#"+graphID).removeClass('draggable');  //remove visualization draggable property
        $("#"+graphID).css('cursor', 'default');  //change cursor
        $("#"+graphID).css('border', 'none');     //remove move border

        var visButtonsContainer = $(this).find('.visButtonsContainer')[0];
        var menuIcon            = $(this).find('.nav-icon')[0];

        $(menuIcon).removeClass('open'); //in menuvis switch to close icon

        if (!$(visButtonsContainer).hasClass('open')) {
          //close visualization settings container
          var parent = $(visButtonsContainer).parent();
          incrementWidth($(visButtonsContainer)[0].id, '35px', ANIMATIONTIME, function(){
            fade($(visMenu)[0].id, 0.0, ANIMATIONTIME/3, null, 'block');
          });
        }
      }catch(err){}
    }
},".visualization");

//////MOVE VISUALIZATION INTERACTION//////
$(document).on('click','.visualization',function(evt){
try{
    if(evt.target.className.indexOf('removeVisualizationButton') > -1) {
      console.log('remove');
      removeVisualization($(this)[0].id);
    }else if (evt.target.className.indexOf('moveVisualizationButton') > -1 && dragAllVisualizations) {
      console.log('move');
      $(this).addClass('draggable');
      $(this).css('cursor', 'move');
      $(this).css('border', '1px dashed rgba(0,0,0,0.5)');
    }else if (evt.target.className.indexOf('resizeVisualizationButton') > -1) {
      console.log('resize');
      $(this).resizable();
    }else if (evt.target.className.indexOf('bringFrontVisualizationButton') > -1) {
      console.log('bring front');
      maxViszIndex++;
      $(this).css('zIndex', maxViszIndex);
    }else if (evt.target.className.indexOf('sendBackVisualizationButton') > -1) {
      console.log('send back');
      var currentZIndex;
      $(this).css('zIndex', minViszIndex);
      $('#visualizationsBody .visualization').not(this).each(function(){
        currentZIndex = parseInt($(this).css('zIndex'));
        $(this).css('zIndex', currentZIndex+1);
      });
    }else if (evt.target.className.indexOf('updateVisualizationButton') > -1) {
      console.log('update');
      var imgName = 'update';
      if (!evt.target.src.match('updateBlocked')) {
        imgName = 'updateBlocked';
      }
      $(evt.target).attr('src', './imgs/visualizations/'+imgName+'.png');
    }
  }catch(err){/*console.log(err);*/}
});


////////////////////////RESIZE DASHBOARD TEXT VISUALIZATION INTERACTION//////////////////////////////
$(document).on('resize', '.textVisualization', function(){  //resize text
  var textID = $(this).find('p')[0].id; //get paragraph from the selected visualization
  var textInitialWidth    = $('#'+textID).attr('alt').split(':')[0];  //ex alt = '100:100:21px' -> 100
  var textInitialHeigth   = $('#'+textID).attr('alt').split(':')[1];  //ex alt = '100:100:21px' -> 100
  var textInitialFontSize = $('#'+textID).attr('alt').split(':')[2];  //ex alt = '100:100:21px' -> 21px

  var textFontSizeValue = textInitialFontSize.match(/[0-9]+\.*[0-9]+/); //get the numeric part ex: 21px -> 21
  var textFontSizeType  = textInitialFontSize.match(/[a-z]+$/); //get the text part ex: 21px -> px

  var initDiagonal = getContentDiagonal(parseFloat(textInitialWidth), parseFloat(textInitialHeigth), '#'+textID);
  var newDiagonal = getContentDiagonal($(this).width(), $(this).height(), '#'+textID);
  var ratio = newDiagonal / initDiagonal;
  $('#'+textID).css("font-size", (parseFloat(textFontSizeValue) + ratio * 3) + textFontSizeType);
});

//calculate distance (or diagonal)
function getContentDiagonal(contentWidth, contentHeight, textID) {
    return contentWidth * contentWidth + contentHeight * contentHeight;
}



////////////////////////VISUAZALITION STYLE MENU PROPERTIES UPDATE INTERACTION//////////////////////////////
$(document).on('change', '.bkgStyleProperty, #borderRadiusVisSelect, #borderRadiusVis, #fontSizeVis', function(){
  updateStyleVisualizationPreview();
});

$(document).on('click', '#visStyleButton', function(){
  updateStyleAllVisualizations();
  updateVisualizationsDetailsOptions();
});

////////////////////////FONT STYLE MENU PROPERTIES UPDATE INTERACTION//////////////////////////////
$(document).on('change', '.fontStyleProperty, #letterSpacingSelect, #letterSpacingVis, #fontSizeSelect, #fontSize', function(){
  updateStyleFontPreview();
});

$(document).on('click', '#fontStyleButton', function(){
  updateStyleFont(true);
});


////////////////////////VISUAZALITION PROPERTIES UPDATE INTERACTION//////////////////////////////
$(document).on('change','.updateVariables',function(evt){
  var divID = $('#visualizationHeaderPreview').find('div')[0].id;
  var type  = divID.replace('Preview', '');
  getDataFromServer(type, '/data', ['variables', $(evt.target).val()], 'UpdateOpts');

});

$(document).on('change','.updatePreview',function(evt){
  var previewID = $('.preview')[0].id;
  chartUpdatePreview(previewID);
});

//update text preview
$(document).on('change', '.fontTextVisProperty, #textFontSizeSelectTextVis, #textFontSizeTextVis, #letterSpacingSelectTextVis, #letterSpacingTextVis', function(evt){
  updateTextPreview();
})

//update calendar preview
$(document).on('change','.updateCalendarPreview',function(evt){
  getDataFromServerToRefresh('calendarHeatmapPreview', calendarHeatmapObjArray[0]['calendarHeatmapPreview'], 'calendarHeatmap', '/data', [$('#xAxisSelect').val(), $('#yAxisSelect').val(), $('#aggregationSelect').val(), 'months', startDate, endDate, $('#fileSelectChart').val(), 'All'], 'updateHeatmapCalendar');
});

//show the visualization style edition menu, while creating a visualization
$(document).on('click','#visualizationStyleButton',function(evt){
  showVizualizationStyle();
});

function showVizualizationStyle(){
  var type = getVisualizationType();

  if($("#visualizationEditDetails").css("display") == "none"){
    var position   = [$("#visualizationDetails").css("top"), "-30px"];
    fadeAndMove('visualizationDetails', 0.0, ANIMATIONTIME/2, function(){           //move the visualization slightly left
      $('#visualizationTitle').html('Select Styles');
      $('#visualizationStyleCircle').addClass('circle');
      $('#visualizationVariablesCircle').removeClass('circle');

      if (type == 'image')  $("#visualizationHeaderPreview").css("display", 'none');

      showContainerChild('visualizationContentDetails', ANIMATIONTIME/4, 2, $("#visualizationDetails").css("top"), "0px");  //backgroundContainer
    }, position, 'none');
  }
}

//show the visualization variable menu, while creating a visualization
$(document).on('click','#visualizationVariablesButton',function(evt){
  showVizualizationVariables();
});

function showVizualizationVariables(){
  var type = getVisualizationType();

  if($("#visualizationDetails").css("display") == "none"){
    var position   = [$("#visualizationEditDetails").css("top"), "30px"];
    fadeAndMove('visualizationEditDetails', 0.0, ANIMATIONTIME/2, function(){           //move the visualization slightly left
      $('#visualizationTitle').html(getVisualizationTitle(type));
      $('#visualizationVariablesCircle').addClass('circle');
      $('#visualizationStyleCircle').removeClass('circle');

      if (type == 'image')  $("#visualizationHeaderPreview").css("display", 'block');

      showContainerChild('visualizationContentDetails', ANIMATIONTIME/4, 1, $("#visualizationEditDetails").css("top"), "0px");  //backgroundContainer
    }, position, 'none');
  }
}

//update charts if input values changed
$(document).on('change', '#colorPicker, #thicknessChart, #labelTypeSelectChart, #donutRatioChart', function(){
  var divID = $($('#visualizationHeaderPreview')[0]).find('div')[0].id;
  updateGraphProperties(eval(divID), divID);
});

$(document).on('change', '#borderImageRadius, #borderRadiusSelect, #borderImage, #borderImageSelect', function(){
  updateImageProperties("imageDivPreview");
});

$(document).on('change', '#colorBarPicker, #colorSpherePicker, #checkboxShowMonths, #textSphere, #checkboxShowDots, #colorDotsPicker, #colorTextPicker', function(){
  updateTimelineProperties('timelinePreview');
});

//toogle opacity of the chart axis
$(document).on('click', '.axisHide', function(evt){
	var parentElement = evt.target.parentElement;
	var opacity  = (($($(parentElement).find('input')[0]).css('opacity') == 1) ? 0.3 : 1);
	var codeIcon = (($($(parentElement).find('input')[0]).css('opacity') == 1) ? '&#43' : '&times');

	$($(parentElement).find('input')[0]).css('opacity', opacity);
	$($(parentElement).find('p')[0]).css('opacity', opacity);
	$(evt.target).html(codeIcon);
});

//toogle opacity of the chart label
$(document).on('click', '.labelHide', function(evt){
	var opacity, codeIcon;
	$('#visualizationHeaderPreview .nv-series').each( function() {
		codeIcon = ($(this).css('opacity') == 1) ? '&#43' : '&times';
		opacity  = ($(this).css('opacity') == 1) ? 0.3 : 1;
		$(this).css('opacity', opacity);
	});
	$(evt.target).html(codeIcon);
});

//map preview interaction
$(document).on('change', '#borderRadiusMap, #borderRadiusMapSelect, #borderMap, #borderMapSelect', function(){
  var divID = $($('#visualizationHeaderPreview')[0]).find('div')[0].id;
  updateMapProperties(divID);
});

$(document).on('change', '.colorMapLegendPicker', function(){
  var divID    = $(this)[0].id;
  var colorDiv = $('#'+divID).parent().find('div')[0];
  $(colorDiv).css('backgroundColor', $(this)[0].value);
});

$(document).on('click', '#addLabelDiv', function(){
  addNewLabel();
});


$(document).on('click', '#pieDonutImg', function(){
  var type = $(this).attr('alt');
  if (type == 'pieChart') {
    $(this).attr('src', './imgs/icons/pieChartIcon.png');
    $(this).attr('alt', 'donutChart');
  }else {
    $(this).attr('src', './imgs/icons/donutChartIcon.png');
    $(this).attr('alt', 'pieChart');
  }

  var divID = $($('#visualizationHeaderPreview')[0]).find('div')[0].id;
  updateGraphProperties(eval(divID), divID);

});

////////////////////////CALENDAR MENU INTERACTION//////////////////////////////
$(document).on('change', '#colorMaxCalendarPicker, #colorMinCalendarPicker', function () {
  var colorMin = $('#colorMinCalendarPicker').val();
  var colorMax = $('#colorMaxCalendarPicker').val();
  var colors = [blendCodeColors(colorMin, colorMax, 0), blendCodeColors(colorMin, colorMax, 0.2), blendCodeColors(colorMin, colorMax, 0.4), blendCodeColors(colorMin, colorMax, 0.6), blendCodeColors(colorMin, colorMax, 0.8), blendCodeColors(colorMin, colorMax, 1)];

  updateCalendarColor("calendarHeatmapPreview", colors);
});


////////////////////////MAP POPUPS ELEMENTS INTERACTION//////////////////////////////
$(document).on('click', '.popupIcon', function(evt){
  var visualization = $(this).closest('.visualization');
  var parent        = $(this).closest('.popupDivLocationContent');
  var xAxis         = $(parent).find('h5')[0].innerHTML;

  animatePopupLocationCommonElements($(visualization)[0].id, 0, 'none', ['-10px', '130px'], ['100%', '60px'], ['0px','0px'], '10px', [0.3, 'block'], ['-5px','-50px'], ['60px', '54.14px'], ['0px','5px']);

  var currentMapObj = getObjWithKeyInArray(mapObjArray, $(visualization)[0].id);
  var currentMap    = currentMapObj[$(visualization)[0].id];
  var currentZoom   = currentMap.getZoom(), zoomLevel;
	if(currentZoom > 14)
	 	zoomLevel = 'street';
	else if(currentZoom > 9)
		zoomLevel = 'city';
	else
		zoomLevel = 'country';

  var params = ['Timestamp', xAxis, 'COUNT', 'months', startDate, endDate, $(parent).attr('alt'), 'All', zoomLevel];
  if (!$(parent).find('.heatmapCalendar')[0]) //if calendar not already inserted
    getDataFromServerToRefresh(currentMapObj.currentOpenPopupMap, currentMapObj, 'calendarHeatmap', '/data', params, 'updatePopupCalendar');
});

function animatePopupLocationCommonElements(visualizationID, opacity, display, titlePosition, timesHereSize, timesHerePosition, borderRadiusInput, backIconInput, calendarTextPosition, calendarIconSize, calendarIconPosition){
  fade('timesHereString' + visualizationID, opacity, ANIMATIONTIME, null, display);
  fade('timesHereNumber' + visualizationID, opacity, ANIMATIONTIME, null, display);
  fade('popupClockText' + visualizationID,  opacity, ANIMATIONTIME, null, display);
  fade('popupCalendarText' + visualizationID,  opacity, ANIMATIONTIME, null, display);
  fadeElement('.popupDivLocationCalendar h6', opacity, ANIMATIONTIME, null, display);

  moveTo('popupDivLocationTitle' + visualizationID, ANIMATIONTIME, null, titlePosition);
  incrementAndMove('timesHereDiv' + visualizationID, timesHereSize[0], timesHereSize[1], ANIMATIONTIME, null, timesHerePosition);
  borderRadius('timesHereDiv' + visualizationID, borderRadiusInput, ANIMATIONTIME);
  fadeClass('popupBackIcon', backIconInput[0], ANIMATIONTIME, null, backIconInput[1]);

  incrementAndMove('popupCalendarIcon' + visualizationID, calendarIconSize[0], calendarIconSize[1], ANIMATIONTIME, null, calendarIconPosition);

}

//return from calendar menu in map popups
$(document).on('click', '.popupBackIcon', function(){
  var parent        = $(this).parent();
  var calendar      = $(parent).find('.heatmapCalendar')[0];
  var timesHere     = $(parent).find('#timesHere')[0];
  var visualization = $(this).closest('.visualization');

  //remove calendar
  if (calendar != null)
    removeVisualization(calendar.id);

  //move elements to their initial position
  animatePopupLocationCommonElements($(visualization)[0].id, 1, 'block', ['0%','50%'], ['170px','170px'], ['20px','0px'], '100px', [0, 'none'], ['-65px','-50px'], ['60px', '54.14px'], ['80px','73%']);
});


//////REMOVE FILE INTERACTION//////
//change select file input
$(document).on('change', '#removableFilesSelect', function(evt){
  var fileType    = $(this).val();
  var searchQuery = $('#removeFilesSearch').val();
  var params      = ['files', fileType, searchQuery];
  getDataFromServer('remove', '/data', params, 'PossibleFiles');
});

//change search file input
$(document).on('change', "#removeFilesSearch", function(evt) {
  var fileType    = $('#removableFilesSelect').val();
  var searchQuery = $(this).val();
  var params      = ['files', fileType, searchQuery];
  getDataFromServer('remove', '/data', params, 'PossibleFiles');
});

$(document).on('click', '.removableFileImg', function(){
  var filename = $(this)[0].alt;
  var dataToSend = {};
  dataToSend.filename = filename;
  deleteDataInServer(dataToSend, '/deleteFiles', function(){
    $('#removableFilesSelect').val('All').change();
  });
});


//////KEYBOARD INTERACTION//////
var currentKeyDown = '';
$(document).keydown(function(){
  if(event.keyCode == 16){  //shift key
    currentKeyDown = 'shift';
  }else if (event.keyCode == 17) { //control key
    currentKeyDown = 'control';
  }else if (event.keyCode == 18) { //alt key
    currentKeyDown = 'alt';
  }

});

$(document).keyup(function(){
  if(event.keyCode == 16 || event.keyCode == 17 || event.keyCode == 18)
    currentKeyDown = '';
});

$(document).keydown(function(){
  var visualizationKeyClicked = false, visualizationType = '';
  if (currentKeyDown == '') { //theres none key down
      if(event.keyCode == 8){  //backspace key
        visualizationType = 'delete';
        visualizationKeyClicked = true;
      }else if(event.keyCode == 65){  //a key
        visualizationType = 'areaChart';
        visualizationKeyClicked = true;
      }else if(event.keyCode == 66){  //b key
        visualizationType = 'barChart';
        visualizationKeyClicked = true;
      }else if(event.keyCode == 67){  //c key
        visualizationType = 'calendarHeatmap';
        visualizationKeyClicked = true;
      }else if(event.keyCode == 73){  //i key
        visualizationType = 'image';
        visualizationKeyClicked = true;
      }else if(event.keyCode == 76){  //l key
        visualizationType = 'lineChart';
        visualizationKeyClicked = true;
      }else if(event.keyCode == 77){  //m key
        visualizationType = 'map';
        visualizationKeyClicked = true;
      }else if(event.keyCode == 80){  //p key
        visualizationType = 'pieChart';
        visualizationKeyClicked = true;
      }else if(event.keyCode == 84){  //t key
        visualizationType = 'timeline';
        visualizationKeyClicked = true;
      }else if(event.keyCode == 27){  //esc key
        visualizationType = 'esc';
        visualizationKeyClicked = true;
      }
      if (visualizationKeyClicked) {
        if (visualizationType == 'esc') { //close open container
          $('.container').each(function(){
            var containerID = $(this)[0].id;
            if ($('#'+containerID).css('display') != 'none') {
              hideContainer(containerID, ANIMATIONTIME, ['15%', '95%'], hideContainerContent, null);
              return;
            }
          });
          return;
        }else {
          if (visualizationType == 'delete') { //delete visualization
            removeVisualization($(lastClickedItem).attr('id'));
            return;
          }
        }

        var width = 540, height = 600;

        if (visualizationType == 'timeline') //reduce size if is timeline
          height = 400;
        else if (visualizationType == 'text') //reduce size if is text
          height = 420;

        if ($('#visualizationContainer').css('display') == 'none' && $('#settingsContainer').css('display') == 'none' && $('#timelineContainer').css('display') == 'none' && $('#helpContainer').css('display') == 'none') { //if container is not openned already
          var containerInitialPosition = {top:'15%', left:'95%'};
          var containerFinalPosition = [(($(window).height()/2) - height/2), (($(window).width()/2) - width/2)];
          showContainer("visualizationContainer", width, height, containerInitialPosition, containerFinalPosition, ANIMATIONTIME, 1); //Open the container and display its content
        }else {
          return;
        }

        callVisualizationDetails(visualizationType);
        currentVisualizationType = visualizationType;
      }

  }else{//if ctrl, shift or alt key are down
    if (currentKeyDown == 'control') {
      if(event.keyCode == 65){  //a key
        visualizationType = 'divFilesAdd';
        visualizationKeyClicked = true;
      }else if(event.keyCode == 66){  //b key
        visualizationType = 'divStyleBackground';
        visualizationKeyClicked = true;
      }else if(event.keyCode == 67){  //c key
        visualizationType = 'divAdvancedCache';
        visualizationKeyClicked = true;
      }else if(event.keyCode == 68){  //d key
        visualizationType = 'divFilesRemove';
        visualizationKeyClicked = true;
      }else if(event.keyCode == 70){  //f key
        visualizationType = 'divStyleFont';
        visualizationKeyClicked = true;
      }else if(event.keyCode == 82){  //r key
        visualizationType = 'divAdvancedReport';
        visualizationKeyClicked = true;
      }else if(event.keyCode == 83){  //s key
        visualizationType = 'divAdvancedSave';
        visualizationKeyClicked = true;
      }else if(event.keyCode == 85){  //u key
        visualizationType = 'divFilesUpdate';
        visualizationKeyClicked = true;
      }else if(event.keyCode == 86){  //v key
        visualizationType = 'divStyleVisualization';
        visualizationKeyClicked = true;
      }
    }else if (currentKeyDown == 'shift') {
      if(event.keyCode == 84){  //t key
        visualizationType = 'timelineLateralButton';
        visualizationKeyClicked = true;
      }
    }else if (currentKeyDown == 'alt') {
      if(event.keyCode == 72){  //h key
        visualizationType = 'helpLateralButton';
        visualizationKeyClicked = true;
      }
    }

    if (visualizationKeyClicked) {
      if ($('#visualizationContainer').css('display') == 'none' && $('#settingsContainer').css('display') == 'none' && $('#timelineContainer').css('display') == 'none' && $('#helpContainer').css('display') == 'none') { //if container is not openned already
        if (visualizationType == 'timelineLateralButton' || visualizationType == 'helpLateralButton') {
          console.log('testeeeee');
          $( "#" +  visualizationType).trigger( "click" );
        }else {
          $( "#settingsLateralButton" ).trigger( "click" );
          setTimeout(function(){
            $( "#" + visualizationType ).trigger( "click" )}
          , ANIMATIONTIME);
        }
      }
    }
  }

});




//////CLOSING WINDOW INTERACTION//////
window.onbeforeunload = function () {
  if (saveDefinitions) {
    getAllVisualizationsObjs();
    cacheCurrentSize = 0;
    var text = createHtml('p', 'TESXTSRX','');
    return text;
  }
};
