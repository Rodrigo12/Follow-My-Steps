var timelineNumber = 0;
var timelineObjArray = [];
var timelinePreview;

function timelineContainerSetting(){
	createTimelinePreviewHeader();
	createTimelineVisualizationDetails();
	defaultTimelineValues();

	validateForm('visualizationForm', getFormValidators());

}

function createTimelineVisualizationDetails(){
	var colorBarButton = createHtml('img', '', 'src="./imgs/icons/barColorIcon.png" style="position:absolute;width:40px; cursor:pointer;"');
	var colorBarLabel  = createHtml('label', colorBarButton, 'for="colorBarPicker" style="position:absolute; top:0%; left:9%; width:40px; cursor:pointer;"');
	var colorBarInput  = createHtml('input', '', 'id="colorBarPicker" type="color" value="#CCCCCC" style="position:absolute;z-index:-1;opacity:0;"');
	var colorBarElements = colorBarLabel + colorBarInput;

	var colorSphereButton = createHtml('img', '', 'src="./imgs/icons/circlesColorIcon.png" style="position:absolute;width:30px; cursor:pointer;"');
	var colorSphereLabel  = createHtml('label', colorSphereButton, 'for="colorSpherePicker" style="position:absolute; top:0%; left:34%; width:30px; cursor:pointer;"');
	var colorSphereInput  = createHtml('input', '', 'id="colorSpherePicker" type="color" value="#eeeeee" style="position:absolute;z-index:-1;opacity:0;"');
	var colorSphereElements = colorSphereLabel + colorSphereInput;

	var colorDotsButton = createHtml('img', '', 'src="./imgs/icons/fontColorIcon.png" style="position:absolute;width:25px; cursor:pointer;"');
	var colorDotsLabel  = createHtml('label', colorDotsButton, 'for="colorDotsPicker" style="position:absolute; top:0%; left:59%; width:25px; cursor:pointer;"');
	var colorDotsInput  = createHtml('input', '', 'id="colorDotsPicker" type="color" value="#8E8E8E" style="position:absolute;z-index:-1;opacity:0;"');
	var colorDotsElements = colorDotsLabel + colorDotsInput;

	var colorTextButton = createHtml('img', '', 'src="./imgs/icons/circlesTextColorIcon.png" style="position:absolute;width:30px; cursor:pointer;"');
	var colorTextLabel  = createHtml('label', colorTextButton, 'for="colorTextPicker" style="position:absolute; top:0%; left:84%; width:30px; cursor:pointer;"');
	var colorTextInput  = createHtml('input', '', 'id="colorTextPicker" type="color" value="#999999" style="position:absolute;z-index:-1;opacity:0;"');
	var colorTextElements = colorTextLabel + colorTextInput;

	var optionsSizeInput   = ['px', '%'];
	var widthBarInput  		 = createSpecialInputText(['40%', '10%'], 'Bar Width: ___________', 'widthBarSelect', ['37%', '31%'], 'widthBar', ['28%', '15%'], 100, optionsSizeInput );
	var showMonths	 		   = createHtml("input", "", 'type="checkbox" class="checkboxInput" id="checkboxShowMonths" value="" alt="showMonths" checked');
	var showMonthsLabel	   = createHtml("label", showMonths + " Show Months", 'class="checkbox-inline" style="position:absolute; top:40%; left:67%;z-index:5;"');

	$('#visualizationDetails').html( colorBarElements + colorSphereElements + colorDotsElements + colorTextElements + showMonthsLabel + widthBarInput );
	$("#visualizationDetails").css('top', '170px');
}

function defaultTimelineValues(){
	if (!$('#widthBar').val())
		$('#widthBar').val(400);

	if (!$('#textSphere').val())
		$('#textSphere').val(10);
}

function updateTimelineProperties(timelineID, isLoad, loadProperties){
	var barColor 				= (isLoad) ? loadProperties.barColor : $('#colorBarPicker').val();
	var sphereColor 		= (isLoad) ? loadProperties.handlerColor : $('#colorSpherePicker').val();
	var sphereTextColor	= (isLoad) ? loadProperties.handlerFontColor : $('#colorTextPicker').val();
	var showMonths			= (isLoad) ? loadProperties.showMonths : document.getElementById('checkboxShowMonths').checked;
	var dotsColor				= (isLoad) ? loadProperties.fontColor : $('#colorDotsPicker').val();

	$("#" + timelineID).find('.sls').css('background', barColor);
	$("#" + timelineID).find('.sls-handle').css('background', sphereColor);
	$("#" + timelineID).find('.sls-handle').css('color', sphereTextColor);
	$("#" + timelineID).find('.sls-knob').css('color', dotsColor);

	if (showMonths)
		$("#" + timelineID).find('.sls-knob').css('display', 'block');
	else
		$("#" + timelineID).find('.sls-knob').css('display', 'none');

	if (isLoad) {
		var obj = getObjWithValueInArray(timelineObjArray, 'id', timelineID);

		obj.barColor 				 = loadProperties.barColor;
		obj.handlerColor 		 = loadProperties.handlerColor;
		obj.handlerFontColor = loadProperties.handlerFontColor;
		obj.showMonths 			 = loadProperties.showMonths;
		obj.fontColor 			 = loadProperties.fontColor;
	}
}

function createTimelinePreviewHeader(){
	$('.visualizationDetailsIcon').css('display', 'none');
	$('.noCircle').css('display', 'none');
	showVizualizationVariables();
	var timelineParentDiv = createHtml('div', '', 'id="timelinePreview" class="timeline" style="position:relative;width:415px;left:50%;transform:translate(-53%, 100%);"');
	$('#visualizationHeaderPreview').html(timelineParentDiv);
	addTimeline('timelinePreview', 400, true, false);
}

function timelineVisualizationElement(){
  timelineNumber += 1;
	var width = $('#widthBar').val();
  var timelineParentDiv = createHtml('div', '', 'id="timeline'+ timelineNumber +'" class="timeline visualization" style="width:'+width+'px;"');
  $('#visualizationsBody').append(timelineParentDiv);
  var spans = createVisualizationButtons('timeline'+ timelineNumber);
	$('#timeline'+ timelineNumber).append(spans);

	addTimeline('timeline'+ timelineNumber, parseInt(width), false, false);
	hideContainer('visualizationContainer', ANIMATIONTIME, ['16%', '95%'], hideContainerContent, hide);
}

function addTimeline(timelineID, width, isPreview, isLoad){
  var timelineHandleDiv = createHtml('div',   '', 'data-toggle="popover" data-container="body" data-trigger="manual" class="sls-handle" id="slsHandle'+timelineID+'"');
  var timelineSLSDiv    = createHtml('div',   timelineHandleDiv, 'data-start="0" data-end="366" class="sls sls-limit"');
  var timelineInput     = createHtml('input', '', 'type="text" name="data"');
	var slsBkgSize				= width + 15;
  var timelineDiv       = createHtml('div',   timelineInput + timelineSLSDiv, 'class="sls-container" style="width:100%;"');

  $("#"+timelineID).append(timelineDiv);
  createTimeline(timelineID, width, isPreview);

	if (!isPreview && !isLoad)
		updateTimelineProperties(timelineID, false, null);

	$('#' + timelineID).on('time',  function (evt, param1){
									var updateButton = $('#'+timelineID).find('.updateVisualizationButton')[0];
									var updateVis		 = ($(updateButton).attr('src').includes('updateBlocked')) ? false : true;
									if (updateAllVisualizations && updateVis){
										var handlers = $('#'+timelineID).find('.sls-handle');
										setTimelineHandler(handlers[0], startDate, false);
										setTimelineHandler(handlers[1], endDate, false);
									}
						});

	var timelineProperties = {};
	timelineProperties['barColor']         = $('#colorBarPicker').val();
	timelineProperties['fontColor']				 = $('#colorDotsPicker').val();
	timelineProperties['handlerColor']		 = $('#colorSpherePicker').val();
	timelineProperties['handlerFontColor'] = $('#colorTextPicker').val();
	timelineProperties['width']						 = $('#widthBar').val();

	if($("#checkboxShowMonths").length != 0)
		timelineProperties['showMonths'] = ($("#checkboxShowMonths").is(':checked'))? true : false;
	else
		timelineProperties['showMonths'] = true;


	if (!isPreview){
		addNewTimelineObj(timelineID, startDate, endDate, width, timelineProperties);
		updateStyleAllVisualizations();	//update text on graphs after the graph update
	}
}

function timelinePopupContent(date){
	var date = createInputDate("startDate", "Date:", date, date, "");

	var checkIcon    = createHtml("i", "", "class='glyphicon glyphicon-ok'");
	var updateButton = createHtml("button", checkIcon, "type='button' class='btn-default btn updateTimelineDates' style='margin-top:10%; margin-left:42%; '");
	var elementDiv  = "<div> " + date + updateButton + " </div>";

	return elementDiv;
}

function addNewTimelineObj(timelineID, handler1Value, handler2Value, width, timelineProperties){
	var timelineObj = {};

	timelineObj['id'] 					 		= timelineID;
	timelineObj['handler1Value'] 	 	= handler1Value;
	timelineObj['handler2Value'] 	  = handler2Value;
	timelineObj['width'] 		 				= width;
	timelineObj['barColor'] 	 			= timelineProperties.barColor;
	timelineObj['fontColor'] 			  = timelineProperties.fontColor;
	timelineObj['handlerColor'] 		= timelineProperties.handlerColor;
	timelineObj['handlerFontColor'] = timelineProperties.handlerFontColor;
	timelineObj['showMonths']  			= timelineProperties.showMonths;

	timelineObjArray.push(timelineObj);
}

function timelineLoad(objData, elementID, properties, filename){
  var timelineParentDiv = createHtml('div', '', 'id="'+ elementID +'" class="timeline visualization" style="width:'+properties.width+'px;"');
  $('#visualizationsBody').append(timelineParentDiv);
  var spans = createVisualizationButtons(elementID);
	$('#'+elementID).append(spans);

	timelineNumber = Math.max(parseInt(elementID.match(/\d+/)[0]) + 1, timelineNumber + 1); // update timelineNumber

	addTimeline(elementID, properties.width, false, true);
	updateTimelineProperties(elementID, true, properties);
}
