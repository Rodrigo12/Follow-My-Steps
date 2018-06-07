var calendarHeatmapNumber   = 0;
var calendarHeatmapObjArray = [];
var calendarHeatmapPreview;

//Create heatmapCalendar menu initial content
function calendarHeatmapContainerSetting(data){
  var dataContent = JSON.parse(data);

  createVisualizationDetails(dataContent);
  createVisualizationEditDetails();
}

//Create heatmapCalendar details menu content
function createVisualizationDetails(dataContent){
  var optionsSelectFile     = [];
  for (var index = 0; index < dataContent.length; index++) {
    optionsSelectFile.push(dataContent[index].filename);
  }
  var optionsSelectAggregation = ['SUM', 'COUNT', 'AVG', 'MAX', 'MIN'];
  var optionsSelectTimestamp   = ['timestamp1', 'timestamp2', 'timestamp3'];
  getDataFromServer('calendarHeatmap', '/data', ['variables', optionsSelectFile[0]], 'UpdateOpts');
  var optionsSelectVariables = ['variable1', 'variable2', 'variable3'];
  getDataFromServer('calendarHeatmap', '/data', ['variables', optionsSelectFile[0]], 'UpdateOpts');

  var calendarParagraph = createHtml('p', 'Populate calendar with data from _______________ to show the number of times I\'ve been in _____________', 'style="position:absolute; top:61%; left:0%;"');

  var fileSelect			  = createSpecialInputSelect('fileSelectChart', ["36%", "3%"],   'File: ____________________', 'updateVariables', ["34%", "8%"], 150, optionsSelectFile );
  var aggregationSelect = createSpecialInputSelect('aggregationSelect', ["61%", "3%"], 'Aggregation: __________', 'updateCalendarPreview', ["59%", "21%"], 100, optionsSelectAggregation );
  var xAxisSelect	 		  = createSpecialInputSelect('xAxisSelect', ["36%", "63%"], 'Timestamp: ___________', 'updateCalendarPreview', ["34%", "76%"],  100, optionsSelectTimestamp );
  var yAxisSelect			  = createSpecialInputSelect('yAxisSelect', ["61%", "63%"], 'Variable: ____________', 'updateCalendarPreview', ["59%", "74%"],  100, optionsSelectVariables );
  var selects           = fileSelect + aggregationSelect + xAxisSelect + yAxisSelect;

  var objData = createCalendarProtoObject('STUFF', 'month', 'day', "%d", new Date(), 0, 0, {}, {}, 20);

  if (calendarHeatmapObjArray.length == 0)
    addNewCalendarObj('calendarHeatmapPreview', null, [], '', '', '', '', '', '', '', '');
  else{
    calendarHeatmapObjArray[0].legend         = 'Yes';
    calendarHeatmapObjArray[0].highlightToday = 'No';
    calendarHeatmapObjArray[0].legendColor    = [];
    calendarHeatmapObjArray[0].legendPosition = 'center';
    calendarHeatmapObjArray[0].label          = 'top';
  }

  createCalendarHeatmap('calendarHeatmapPreview', 'visualizationHeaderPreview', objData, true, 'position:absolute; left:40px; width:'+300+'px; height:'+240+'px; overflow: scroll;', false);

  $('#visualizationDetails').html(selects);
  $("#visualizationDetails").css('height', '300px');
  $("#visualizationDetails").css('top', '250px');
}

//Update variables selects
function calendarHeatmapUpdateOpts(data){
  var dataContent = JSON.parse(data), optsX = '', optsY = '', optsAggregation = '';
  if (($('#fileSelectChart').val()).includes('.life'))
    optsAggregation = ['COUNT'];
  else
    optsAggregation = ['SUM', 'COUNT', 'AVG', 'MAX', 'MIN'];

  for (var index = 0; index < dataContent.length; index++) {
    if (objectHasKey(dataContent[index], 'activity'))
			optsX += createHtml('option', dataContent[index].activity, '');
		else if (objectHasKey(dataContent[index], 'variable'))
			optsY += createHtml('option', dataContent[index].variable, '');
  }

  $('#xAxisSelect').html(optsX);
  $('#yAxisSelect').html(optsY);
  $('#aggregationSelect').html(createSelectOptions(optsAggregation));

  //console.log([$('#xAxisSelect').val(), $('#yAxisSelect').val(), $('#aggregationSelect').val(), 'months', startDate, endDate, $('#fileSelectChart').val(), 'All']);

  getDataFromServerToRefresh('calendarHeatmapPreview', calendarHeatmapObjArray[0]['calendarHeatmapPreview'], 'calendarHeatmap', '/data', [$('#xAxisSelect').val(), $('#yAxisSelect').val(), $('#aggregationSelect').val(), 'months', startDate, endDate, $('#fileSelectChart').val(), 'All'], 'updateHeatmapCalendar');
}

//Create heatmapCalendar edit details menu content
function createVisualizationEditDetails(){
  //color min input
  var colorMinButton = createHtml('img', '', 'src="./imgs/icons/initialColor.png" style="position:absolute;width:40px; cursor:pointer;"');
	var colorMinLabel  = createHtml('label', colorMinButton, 'for="colorMinCalendarPicker" style="position:absolute; top:10%; left:34%; width:20px; cursor:pointer;"');
	var colorMinInput  = createHtml('input', '', 'id="colorMinCalendarPicker" type="color" value="#DAE384" style="opacity:0;"');
	var colorMinElements = colorMinLabel + colorMinInput;

  //color max input
  var colorMaxButton = createHtml('img', '', 'src="./imgs/icons/finalColor.png" style="position:absolute;width:40px; cursor:pointer;"');
  var colorMaxLabel  = createHtml('label', colorMaxButton, 'for="colorMaxCalendarPicker" style="position:absolute; top:10%; left:60%; width:20px; cursor:pointer;"');
  var colorMaxInput  = createHtml('input', '', 'id="colorMaxCalendarPicker" type="color" value="#244E30" style="opacity:0;"');
  var colorMaxElements = colorMaxLabel + colorMaxInput;

  //today input
  //var todayHighlightButton = createHtml('img', '', 'src="./imgs/icons/todayDateNo.png" style="position:absolute;top:-50%; left:85%; width:50px; cursor:pointer;"');

  //width and height input
  var optionsSizeInput   = ['px', '%'];
  var widthSpecialInput  = createSpecialInputText(['36%', '3%'], 'Width: ______________', 'widthCalendarSelectChart', ['34%', '23%'], 'widthCalendarChart', ['28%', '6%'], 100, optionsSizeInput );
  var heightSpecialInput = createSpecialInputText(['51%', '3%'], 'Height: ______________', 'heightCalendarSelectChart', ['49%', '23%'], 'heightCalendarChart', ['42.5%', '6.5%'], 100, optionsSizeInput );

  //highlight today
  var highlightTodayInput = createSpecialInputSelect('highlightTodayCalendarSelectChart', ['66%', '3%'], 'Highlight Today: ______________', '', ['64%', '25%'], 100, ["No", "Yes"] );

  //label position
  var labelPositionInput = createSpecialInputSelect('labelCalendarSelectChart', ['36%', '55%'], 'Label Position: ______________', '', ['34%', '74%'], 100, ["top", "bottom", "left", "right"] );

  //legend
  var legendInput = createSpecialInputSelect('legendCalendarSelectChart', ['51%', '55%'], 'Legend: ______________', '', ['49%', '70%'], 100, ["Yes", "No"] );

  //legend position
  var legendPositionInput = createSpecialInputSelect('legendPositionCalendarSelectChart', ['66%', '55%'], 'Legend Position: ______________', '', ['64%', '74%'], 100, ["center", "left", "right"] );

  $('#visualizationEditDetails').html(colorMinElements + colorMaxElements + widthSpecialInput + heightSpecialInput + labelPositionInput + highlightTodayInput + legendInput + legendPositionInput);
  $('#widthCalendarChart').val('350');
  $('#heightCalendarChart').val('250');
}


function updateCalendarPreview(thisElement){
  var previewCalendar = getObjWithKeyInArray(calendarHeatmapObjArray, 'calendarHeatmapPreview')['calendarHeatmapPreview'];

  //add or remove legend
  if ($('#legendCalendarSelectChart').val() == 'Yes')
    previewCalendar.showLegend();
  else
    previewCalendar.removeLegend();

  //place legend
  if (thisElement.id == 'legendPositionCalendarSelectChart' || thisElement.id == 'legendCalendarSelectChart') {
    previewCalendar.options.legendHorizontalPosition = $('#legendPositionCalendarSelectChart').val();
    previewCalendar.setLegend();
  }

  $('#calendarHeatmapPreview .graph-label').css('align', $('#labelCalendarSelectChart').val());

  //highlight
  if ($('#highlightTodayCalendarSelectChart').val() == 'Yes')
    previewCalendar.highlight(new Date());
  else
    previewCalendar.highlight(new Date(1970, 0, 1));

  calendarHeatmapObjArray[0]['highlightToday'] = $('#highlightTodayCalendarSelectChart').val();
  calendarHeatmapObjArray[0]['legend']         = $('#legendCalendarSelectChart').val();
  calendarHeatmapObjArray[0]['legendPosition'] = $('#legendPositionCalendarSelectChart').val();
  calendarHeatmapObjArray[0]['label']          = $('#labelCalendarSelectChart').val();
}

function updateCalendarColor(chartID, colors){
  if (colors == null)
    return;
  $('#'+chartID+' .q1').css('backgroundColor', colors[0]);$('#'+chartID+' .q1').css('fill', colors[0]);
  $('#'+chartID+' .q2').css('backgroundColor', colors[1]);$('#'+chartID+' .q2').css('fill', colors[1]);
  $('#'+chartID+' .q3').css('backgroundColor', colors[2]);$('#'+chartID+' .q3').css('fill', colors[2]);
  $('#'+chartID+' .q4').css('backgroundColor', colors[3]);$('#'+chartID+' .q4').css('fill', colors[3]);
  $('#'+chartID+' .q5').css('backgroundColor', colors[4]);$('#'+chartID+' .q5').css('fill', colors[4]);
  $('#'+chartID+' .q6').css('backgroundColor', colors[5]);$('#'+chartID+' .q6').css('fill', colors[5]);
//console.log('#'+chartID+' .q1');
  calendarHeatmapObjArray[0]['legendColor'] = colors;
}

//update heatmapCalendar preview
function updateHeatmapCalendar(elementID, chart, data){
  var contentData       = JSON.parse(data);
  // console.log(contentData);
  //is preview
  var isPreview = (elementID.includes('Preview')) ? true : false;

  //get dates conversions
  var maxvalue           = contentData[contentData.length - 1].maxvalue;
  var monthHighestValue  = contentData[contentData.length - 1].monthHighestValue;
  var startCalendarDate  = contentData[contentData.length - 1].mintimestamp;
  var endCalendarDate    = contentData[contentData.length - 1].maxtimestamp;
  var todayDate          = new Date();
  var startConvertedDate = new Date(todayDate.getFullYear(), todayDate.getMonth(), 1);
  var endConvertedDate   = new Date(todayDate.getFullYear(), todayDate.getMonth() + 1, 0);
  var currentCalendar    = getObjWithKeyInArray(calendarHeatmapObjArray, elementID);
  var highlightToday     = currentCalendar.highlightToday;
  var legend             = currentCalendar.legend;
  var legendColor        = currentCalendar.legendColor;
  var legendPosition     = currentCalendar.legendPosition;
  var label              = currentCalendar.label;

  //if returned obj not null
  if(contentData[0].value != null){
    startConvertedDate = convertToDefaultDate(startCalendarDate);
    endConvertedDate   = convertToDefaultDate(endCalendarDate);
  }

  //get data for calendarHeatmap
  var ranges = d3.range(startConvertedDate/1000, endConvertedDate/1000 + 3600*24, 3600*24);//d3.range([start, ]stop[, step])
  var updateData = {};
  ranges.map(function(element, index, array) {
    var currentValue = getValueByIndex(contentData, index);
    if(currentValue != 'undefined' && currentValue != null)
	    updateData[element] = parseFloat(currentValue.value);
    else
      updateData[element] = '';
  });

  var updateMonthData = {};
  for (var currentSeconds, index = contentData.length - 2; index > 0; index--) {
    if (contentData[index].hasOwnProperty('month')){
      currentSeconds = convertDatesToSeconds(new Date(1970, 00, 01), convertToDefaultDate(contentData[index].month));
      updateMonthData[currentSeconds] = parseFloat(contentData[index].value);
    }else break;
  }

  //get timetype (days, months and years) and get values
  var timeType = getSpecificTimeType(startConvertedDate, endConvertedDate), timeTypeDiff = getTimeDiffApproximation(startConvertedDate, endConvertedDate), domainType, subdomainType, subDomainTextFormat;

  if (timeType == 'days') { domainType = 'month';  subdomainType = 'day'; subDomainTextFormat = '%d';}
  else { domainType = 'year';  subdomainType = 'month'; subDomainTextFormat = '%m';}

  //get obj data
  var objData = createCalendarProtoObject(elementID, domainType, subdomainType, subDomainTextFormat, startConvertedDate, maxvalue, monthHighestValue, updateData, updateMonthData,20);

  //delete previous calendar
  var chartData = getObjWithKeyInArray(calendarHeatmapObjArray, elementID)[elementID];
  chartData = chartData.destroy();

  var calendarProperties = {};
  calendarProperties['maxvalue']          = maxvalue;
  calendarProperties['monthHighestValue'] = monthHighestValue;
  calendarProperties['highlightToday']    = highlightToday;
  calendarProperties['legend']            = legend;
  calendarProperties['legendColor']       = legendColor;
  calendarProperties['legendPosition']    = legendPosition;
  calendarProperties['label']             = label;

  addCalendarHeatmap(elementID, new CalHeatMap(), objData, calendarProperties, isPreview);
}


//create the object to be used when creating the calendarHeatmap
function createCalendarProtoObject(elementID, domainType, subdomainType, subDomainTextFormat, startConvertedDate, maxvalue, monthHighestValue, updateData, updateMonthData, cellSize){
  var data = updateData;
  if(domainType == 'year'){
    data = updateMonthData;
    maxvalue = monthHighestValue;
  }

  return {
    'domain': domainType,
    'subDomain': subdomainType,
    'cellSize': cellSize,
    'subDomainTextFormat': subDomainTextFormat,
    'start': startConvertedDate,
    'previousSelector': '#leftArrow' + elementID,
    'nextSelector': '#rightArrow' + elementID,
    'displayLegend': true,
    'tooltip': true,
    'maxvalue':maxvalue,
    'monthHighestValue':monthHighestValue,
    'legend':[maxvalue/5, maxvalue*2/5, maxvalue*3/5, maxvalue*4/5, maxvalue],
    'data':data,
    'updateData':updateData,
    'updateMonthData':updateMonthData,
  }
}

//update calendar with data from cache
function calendarHeatmapVisualizationElement(){
  calendarHeatmapNumber += 1;

  calendarHeatmapObjArray[0]['width']    = parseInt($('#widthCalendarChart').val());
  calendarHeatmapObjArray[0]['height']   = parseInt($('#heightCalendarChart').val());
  calendarHeatmapObjArray[0]['filename'] = $('#fileSelectChart').val();

  createCalendarHeatmap('calendarHeatmap'+ calendarHeatmapNumber, 'visualizationsBody', calendarHeatmapObjArray[0].objData, false, 'width:'+calendarHeatmapObjArray[0]['width']+'px; height:'+calendarHeatmapObjArray[0]['height']+'px;', false);
  hideContainer('visualizationContainer', ANIMATIONTIME, ['16%', '95%'], hideContainerContent, hide);
}

//create the calendarHeatmap visualization div
function createCalendarHeatmap(elementID, parentID, objData, isPreview, styleProperties, isMapCalendar){
  var calendarDiv = createHtml('div', '', 'id="'+elementID+'" class="chart heatmapCalendar visualization" style="'+styleProperties+'"');
  $('#'+parentID).append(calendarDiv);

  var leftArrow  = createHtml('img', '', 'id="leftArrow'+elementID+'"  src="./imgs/visualizations/leftArrow.png" style="position:absolute; top:50%; left:0%; transform:translate(0%, -50%); width:15px; cursor:pointer;"');
  var rightArrow = createHtml('img', '', 'id="rightArrow'+elementID+'" src="./imgs/visualizations/rightArrow.png" style="position:absolute; top:50%; right:0%; transform:translate(0%, -50%); width:15px; cursor:pointer"');
  var backArrow  = createHtml('img', '', 'id="backArrow'+elementID+'" class="calendarBackArrow" src="./imgs/icons/containerIcons/arrows/back2.png" style="position:absolute; top:5%; left:5%; width:10px; cursor:pointer"');
  $('#'+elementID).append(backArrow + leftArrow + rightArrow);
  if (!isPreview && !isMapCalendar) {
    var spans = createVisualizationButtons(elementID);
    $('#'+elementID).append(spans);
  }

  var maxValue, monthHighestValue, highlightToday, legend, legendColor, legendPosition, label;

  if (isMapCalendar) {
    maxValue          = objData.maxvalue ;
    monthHighestValue = objData.monthHighestValue;
    highlightToday    = true;
    legend            = true;
    legendColor       = [];
    legendPosition    = 'center';
    label             = 'top';
    width             = 250;
    height            = 190;
    filename          = '';
  }else {
    maxValue          = (isPreview) ? 0 : calendarHeatmapObjArray[0].maxvalue ;
    monthHighestValue = (isPreview) ? 0 : calendarHeatmapObjArray[0].monthHighestValue;
    highlightToday    = (isPreview) ? false : calendarHeatmapObjArray[0].highlightToday;
    legend            = (isPreview) ? true : calendarHeatmapObjArray[0].legend;
    legendColor       = (isPreview) ? [] : calendarHeatmapObjArray[0].legendColor;
    legendPosition    = (isPreview) ? 'left' : calendarHeatmapObjArray[0].legendPosition;
    label             = (isPreview) ? 'top' : calendarHeatmapObjArray[0].label;
    width             = (isPreview) ? 300 : calendarHeatmapObjArray[0].width;
    height            = (isPreview) ? 240 : calendarHeatmapObjArray[0].height;
    filename          = (isPreview) ? ''  : calendarHeatmapObjArray[0].filename;
  }


  var calendarProperties = {};
  calendarProperties['maxvalue']          = maxValue;
  calendarProperties['monthHighestValue'] = monthHighestValue;
  calendarProperties['highlightToday']    = highlightToday;
  calendarProperties['legend']            = legend;
  calendarProperties['legendColor']       = legendColor;
  calendarProperties['legendPosition']    = legendPosition;
  calendarProperties['label']             = label;
  calendarProperties['width']             = width;
  calendarProperties['height']            = height;
  calendarProperties['filename']          = filename;

  addCalendarHeatmap(elementID, new CalHeatMap(), objData, calendarProperties, isPreview);// up arrow
  calendarHeatmapNumber++;
}


//add the calendar to the corresponding div
function addCalendarHeatmap(elementID, calendar, objData, calendarProperties, isPreview){
  var highlightToday = (calendarProperties.highlightToday == 'Yes') ? 'now' : 'none';
  var legend         = (calendarProperties.legend == 'Yes' || calendarProperties.legend == null) ? true : false;
  var legendPosition = (calendarProperties.legendPosition == null) ? 'center' : calendarProperties.legendPosition;
  var label          = (calendarProperties.label == null) ? 'top' : calendarProperties.label;
  var labelRotation  = (label == 'right' || label == 'left') ? label : 'none';

  objData.start = new Date(objData.start);

  calendar.init({
    itemSelector: "#" + elementID,
  	domain: objData.domain,
  	subDomain: objData.subDomain,
  	cellSize:objData.cellSize,
  	subDomainTextFormat: objData.subDomainTextFormat,
  	range: 1,
    previousSelector: objData.previousSelector,
	  nextSelector: objData.nextSelector,
    start: objData.start,
    tooltip: objData.tooltip,
    data: objData.data,
    legend:objData.legend,
    highlight: highlightToday,
    displayLegend: legend,
    legendHorizontalPosition: legendPosition,
    afterLoadNextDomain: function(date) {
      setTimeout(function (){ updateCalendarColor(elementID, calendarProperties.legendColor); updateStyleAllVisualizations(); }, 10);
  	},
    afterLoadPreviousDomain: function(date) {
      setTimeout(function (){ updateCalendarColor(elementID, calendarProperties.legendColor); updateStyleAllVisualizations(); }, 10);
  	},

    label: {
  		position: label,
      width: 30,
      rotate: labelRotation
    },

    itemName: ["time here", "times here"],
    subDomainTitleFormat: {
		  empty: "No records on {date}",
		  filled: "{count} on {date}"
	  },

    onClick: function(date, nb) { onClickCalendar(elementID, date, objData.domain, calendarProperties, objData.updateData, objData.updateMonthData, objData.cellSize, isPreview);  }
  });

  updateStyleAllVisualizations();

  if (!isPreview)
    addNewCalendarObj(elementID, calendar, objData, calendarProperties, objData.updateData, objData.updateMonthData, objData.start, '', '', '', '');
  else
    updateCalendarHeatmapPreview(elementID, calendar, objData, calendarProperties.maxvalue, calendarProperties.monthHighestValue, objData.updateData, objData.updateMonthData, objData.start);

}


function onClickCalendar(elementID, date, domain, calendarProperties, updateData, updateMonthData, cellSize, isPreview){
  //console.log(elementID);
  if (domain == 'year'){
    var objData = createCalendarProtoObject(elementID, 'month', 'day', "%d", date, calendarProperties.maxvalue, calendarProperties.monthHighestValue, updateData, updateMonthData, cellSize);

    //delete previous calendar
    var chartData = getObjWithKeyInArray(calendarHeatmapObjArray, elementID)[elementID];
    chartData = chartData.destroy();

    //remove all tooltips
    $('#'+elementID).find('.ch-tooltip').remove();

    if (!isPreview) {
      removeObjFromArrayByProperty(calendarHeatmapObjArray, elementID);
      addCalendarHeatmap(elementID, new CalHeatMap(), objData, calendarProperties, false);
    }else
      addCalendarHeatmap(elementID, new CalHeatMap(), objData, calendarProperties, true);
  }else {
    startDate = date;
    endDate   = date;
    $('.visualization').trigger('time', ['calendarTimeEvent']);
  }
}

//
function updateCalendarHeatmapPreview(chartID, chart, objData, maxvalue, monthHighestValue, updateData, updateMonthData, date){
	var calendarHeatmapObj 		     = calendarHeatmapObjArray[0];
  calendarHeatmapObj['id'] 		 	 = chartID;
  calendarHeatmapObj[chartID] 	 = chart;					//create an object property with the element chart id ex:{barChartVisualization1:chart}
  calendarHeatmapObj['objData']  = objData;
  calendarHeatmapObj['maxvalue'] = maxvalue;
  calendarHeatmapObj['monthHighestValue'] = monthHighestValue;
  calendarHeatmapObj['updateData']        = updateData;
  calendarHeatmapObj['updateMonthData']   = updateMonthData;
  calendarHeatmapObj['date']              = date;
}


//Function that adds the new created bar chart to the barchart object array
function addNewCalendarObj(chartID, chart, objData, calendarProperties, updateData, updateMonthData, date, filename, xAxis, yAxis, aggregation){
	var calendarHeatmapObj 		 		          = {};
	calendarHeatmapObj['id'] 		 	          = chartID;
	calendarHeatmapObj[chartID] 	          = chart;					//create an object property with the element chart id ex:{barChartVisualization1:chart}
  calendarHeatmapObj['objData']           = objData;
  calendarHeatmapObj['maxvalue']          = calendarProperties.maxvalue;
  calendarHeatmapObj['monthHighestValue'] = calendarProperties.monthHighestValue;
  calendarHeatmapObj['updateData']        = updateData;
	calendarHeatmapObj['updateMonthData']   = updateMonthData;
  calendarHeatmapObj['date']              = date;
  calendarHeatmapObj['legendColor']       = calendarProperties.legendColor;
  calendarHeatmapObj['highlightToday']    = calendarProperties.highlightToday;
  calendarHeatmapObj['legend']            = calendarProperties.legend;
  calendarHeatmapObj['legendPosition']    = calendarProperties.legendPosition;
  calendarHeatmapObj['label']             = calendarProperties.label;
  calendarHeatmapObj['width']             = calendarProperties.width;
  calendarHeatmapObj['height']            = calendarProperties.height;
  calendarHeatmapObj['filename']          = calendarProperties.filename;

  if (calendarProperties.legendColor != null && calendarProperties.legendColor != 'undefined') {
    setTimeout(function (){ updateCalendarColor(chartID, calendarProperties.legendColor); }, 10);
  }

	calendarHeatmapObjArray.push(calendarHeatmapObj);
}

function calendarHeatmapLoad(objData, elementID, properties, filename){
  objData = JSON.parse(objData);

  objData.data            = replaceAllValueByValueInObj(objData.data, null, NaN);
  objData.updateData      = replaceAllValueByValueInObj(objData.updateData, null, NaN);
  objData.updateMonthData = replaceAllValueByValueInObj(objData.updateMonthData, null, NaN);

  createUpdateCalendarHeatmapPreview(objData, properties, filename);

  calendarHeatmapNumber = Math.max(parseInt(elementID.match(/\d+/)[0]) + 1, calendarHeatmapNumber + 1); // update
  createCalendarHeatmap(elementID, 'visualizationsBody', objData, false, 'width:'+properties.width+'px; height:'+properties.height+'px;', false);
}

function createUpdateCalendarHeatmapPreview(objData, properties, filename){
  var calendarHeatmapObj = (calendarHeatmapObjArray.length == 0) ? {} : getObjWithKeyInArray(calendarHeatmapObjArray, 'calendarHeatmapPreview');

  calendarHeatmapObj['calendarHeatmapPreview'] = null;
  calendarHeatmapObj.id                = 'calendarHeatmapPreview';
  calendarHeatmapObj.maxvalue          = properties.maxvalue;
  calendarHeatmapObj.monthHighestValue = properties.monthHighestValue;
  calendarHeatmapObj.highlightToday    = properties.highlightToday;
  calendarHeatmapObj.legend            = properties.legend;
  calendarHeatmapObj.legendColor       = properties.legendColor;
  calendarHeatmapObj.legendPosition    = properties.legendPosition;
  calendarHeatmapObj.label             = properties.label;
  calendarHeatmapObj.width             = properties.width;
  calendarHeatmapObj.height            = properties.height;
  calendarHeatmapObj.date              = objData.start;
  calendarHeatmapObj.updateData        = objData.updateData;
  calendarHeatmapObj.updateMonthData   = objData.updateMonthData;
  calendarHeatmapObj.objData           = objData;
  calendarHeatmapObj.filename          = filename;

  if (calendarHeatmapObjArray.length == 0)
    calendarHeatmapObjArray.push(calendarHeatmapObj);
}
