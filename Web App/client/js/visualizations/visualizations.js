var clickedElementIndex = 0;
var lastClickedItem;

var maxViszIndex = 0;
var minViszIndex = 0;

function getOptionsFromData(data, type){
	var optionsArray = [];
	for (var index = 0; index < data.length; index++) {
		if(data[index].type == type)
			optionsArray.push([data[index].key, data[index].source]);
	}
	return optionsArray;
}

function getOptionsFromObject(obj){
	var optionsArray = [];
	for (var currentKey, index = 0; index < getObjectLength(obj); index++) {
		currentKey = getKeyByIndex(obj,index);
		optionsArray.push([currentKey, getValueByKey(obj, currentKey)]);
	}
	return optionsArray;
}

function createVisualizationGraphElements(graphID, graphNumber, graphClass, parentID){
	createSVG(graphID, graphClass, parentID);

	var spans = createVisualizationButtons(graphID);
	$('#' + graphID).append(spans);
}

function createVisualizationButtons(elementID){
	//menu/close button images
	var moveImg				= createHtml('img', '', 'id="moveVisualizationButton'   		+ elementID + '" 	class="visualizationButton moveVisualizationButton" 			src="./imgs/visualizations/move.png" ');
	var resizeImg		  = createHtml('img', '', 'id="resizeVisualizationButton'   	+ elementID + '" 	class="visualizationButton resizeVisualizationButton" 		src="./imgs/visualizations/resize.png" ');
	var bringFrontImg	= createHtml('img', '', 'id="bringFrontVisualizationButton' + elementID + '" 	class="visualizationButton bringFrontVisualizationButton" src="./imgs/visualizations/bringFront.png" ');
	var sendBackImg	  = createHtml('img', '', 'id="sendBackVisualizationButton'   + elementID + '" 	class="visualizationButton sendBackVisualizationButton"  	src="./imgs/visualizations/sendBack.png" ');
	var updateImg 	  = createHtml('img', '', 'id="updateVisualizationButton'   	+ elementID + '" 	class="visualizationButton updateVisualizationButton"  		src="./imgs/visualizations/update.png" ');
	var removeImg		  = createHtml('img', '', 'id="removeVisualizationButton'   	+ elementID + '" 	class="visualizationButton removeVisualizationButton" 		src="./imgs/visualizations/bin.png" ');

	//menu/close Icon animation
	var span1		 = createHtml('span', '', '');
	var span2		 = createHtml('span', '', '');
	var span3		 = createHtml('span', '', '');
	var span4		 = createHtml('span', '', '');
	var menuIcon = createHtml('div', span1 + span2 + span3 + span4, 'class="nav-icon"');

	//background div
	var visButtonsContainer = createHtml('div', moveImg + resizeImg + bringFrontImg + sendBackImg + updateImg + removeImg + menuIcon, 'id="'+elementID+'SettingsMenu" class="visButtonsContainer draggable"');

	return visButtonsContainer;
}

function createSVG(graphID, graphClass, parentID){
  	var graphSvg = createHtml("svg", "", "id='svg"+ graphID +"'");
  	var graphDiv = createHtml("div", graphSvg, "id='"+ graphID +"' class='"+ graphClass +"' style='display:inline-block; z-index:0;'");

		if (parentID == 'visualizationHeaderPreview')
			$('#'+parentID).html(graphDiv);
		else
			$('#'+parentID).append(graphDiv);
}

function replaceSVG(graphID, parentID){
	var graphSvg = createHtml("svg", "", "id='svg"+ graphID +"'");
	var spans = createVisualizationButtons(graphID);
	$('#'+parentID).html(graphSvg + spans);
}

function serverDataToD3Obj(key, data){
	return [{
						key: key,
						nonStackable: false,
						values: data
				 }];
}

//Every visualization container has an image and a button add
function createChartCommonElements(elementID, parentID, elements){
	createSVG(elementID, 'chartPreview preview', parentID);

  var form = createHtml("form", elements, "id='visualizationForm' class='form-horizontal'");
  //appendCommonElements(parentID, form);
}

//Insert Common elements in the container
function appendCommonElements(elemID, form){
  $("#" + elemID).css("display","none");
  $("#" + elemID).html(form);
  fadeInElement("id", elemID, ANIMATIONTIME);
}

//Function called after getting data to update graphs
function updateGraph(elementID, chart, data){
	// console.log(elementID);
	// console.log(chart);
	// console.log(data);
	var contentData = JSON.parse(data);
	var timestamp, descriptions;

	if (chart == null) {
		chartUpdatePreview(elementID);
		return;
	}

	var visualizationType = elementID.replace(/Graph.*|Preview/g, '');
	var arrayObj = getObjWithKeyInArray(eval(visualizationType + 'sObjArray'), elementID);

	if (elementID.indexOf('areaChart') > -1 || elementID.indexOf('lineChart') > -1){		//if the visualization is a area chart or a line chart Ex: contentData = [["2017:05:02","2017:05:04"],[[0,63.33], [1,13.2]]]
		timestamp    = contentData[0] ;																										//ex: ["2017:05:02","2017:05:04"]
		descriptions = contentData[2];																											//ex: [Macdonalds, rodas]
		contentData  = contentData[1];																											//ex: [[0,63.33], [1,13.2]]

		if(elementID.indexOf('areaChart') > -1) updateAreaColor(elementID, timestamp, 'updateGraph')
		else updateLineColor(elementID, timestamp, 'updateGraph');
		chart.xAxis.tickFormat(function (d) {	return convertToChartDates(timestamp[d]); });													//get the correspondent label
		chart.tooltip.headerFormatter(function (d) {
			return (descriptions == null || isDate(descriptions[d])) ? convertToChartDates(timestamp[d]) : convertToChartDates(timestamp[d]) + ' </br> ' + descriptions[d];
		});
	}else if (elementID.indexOf('pieChart') <= -1) {
		chart.xAxis.tickFormat(function (d) {	return convertToChartDates(d); });
		chart.tooltip.headerFormatter(function (d) {
			var obj = getObjWithValueInArray(contentData, 'x', d);
			return (obj == null || obj.xvalues == null || isDate(obj.xvalues)) ? convertToChartDates(d) : convertToChartDates(d) + ' </br> ' + obj.xvalues;
		});
	}

	var obj 			 = contentData;
	var graphLabel = (arrayObj.yAxis == null || arrayObj.yAxis == true || arrayObj.yAxis == 'variableY1') ? $('#yAxisSelect').val() : arrayObj.yAxis;
// console.log(graphLabel);
	if (elementID.indexOf('pieChart') <= -1 && elementID.indexOf('pieChart') <= -1)			//if it's not pie chart and not pie chart parse the data to d3 object
		obj = serverDataToD3Obj(graphLabel, contentData);

	//update obj data in the correspondent obj array
	var objIndex = getObjIndexWithKeyInArray(eval(visualizationType + 'sObjArray'), elementID);
	eval(visualizationType + 'sObjArray')[objIndex].chartData    = obj;
	eval(visualizationType + 'sObjArray')[objIndex].labels 		   = timestamp;
	eval(visualizationType + 'sObjArray')[objIndex].descriptions = descriptions;

	var svg = d3.select('#' + elementID + ' svg');
	if (elementID.indexOf('pieChart') <= -1 ){			//if it's not pie chart the data to d3 object
		svg.datum(obj).transition().duration(500).call(chart);//update graph
	}else{
		var width = 0, height = 0;
		var isPreview = (elementID.indexOf('Preview') > -1);
		if (isPreview) { width  = 400;height = 200; }
		replaceSVG(elementID, elementID);
		addPieGraph(obj, elementID, width, height, isPreview, true);
	}

	d3.selectAll("rect").attr('class', function(d){
		var currentClassName = $($(this)[0]).attr('class');
		var timeType;
		if(d.x == null)	return currentClassName;
		if ((d.x).length == 4) {timeType = 'years';}
		else if ((d.x).length == 7) {timeType = 'months';}
		else {timeType = 'days';}
		return "nv-bar positive " + timeType + 'Bar';
	});

	updateStyleAllVisualizations();	//update text on graphs after the graph update

	d3.selectAll(".nv-bar").on('click',
			 function(){
				 if (elementID.indexOf('Preview') > -1){ //if is preview
					 barChartsObjArray[0].xAxis = $('#xAxisSelect').val();	//get xaxis selected label
					 barChartsObjArray[0].yAxis = $('#yAxisSelect').val();	//get yaxis selected label
				 }
				 barChartElementsInteraction(this);
	 });

	// nv.utils.windowResize(chart.update);
}




function updateSpecificElementsGraph(elementID, chart, data){
	var contentData = JSON.parse(data);

	var type 		= elementID.replace(/Graph.*|Preview/g, '');
	var dataObj = getObjWithKeyInArray(eval(type + 'sObjArray'), elementID).chartData;

	if (type != "pieChart")
		dataObj[0].values.splice(clickedElementIndex, 1);
	else
		dataObj.splice(clickedElementIndex, 1);

	for (var insertIndex = clickedElementIndex, index = 0; index < contentData.length; index++, insertIndex++) {
		if (type != "pieChart")
			dataObj[0].values.splice(insertIndex, 0, contentData[index]);
		else
			dataObj.splice(insertIndex, 0, contentData[index]);
	}

	if (type != "pieChart")
		updateGraph(elementID, chart, JSON.stringify(dataObj[0].values));
	else{
		var width = 0, height = 0;
		var isPreview = (elementID.indexOf('Preview') > -1);
		if (isPreview) { width  = 400; height = 200; }
		replaceSVG(elementID, elementID);
		addPieGraph(dataObj, elementID, width, height, isPreview, true);
	}
}

function removeVisualization(elementID){
	var element	= $('#' + elementID);

	if(!$(element).hasClass('visualization'))
		return;

	var elementType, arrayIndex;
	if (elementID.indexOf('Chart') > -1)
		elementType = elementID.replace(/Graph\d+/g, 's');
	else if(elementID.indexOf('timeline') > -1 || elementID.indexOf('calendarHeatmap') > -1 || elementID.indexOf('text') > -1 )
		elementType = elementID.replace(/\d+/g, '');
	else if(elementID.indexOf('image') > -1 )
		elementType = 'images';
	else if(elementID.indexOf('Map') > -1 )
		elementType = 'map';

	arrayIndex  = getObjIndexWithKeyInArray(eval(elementType + 'ObjArray'), elementID);
	eval(elementType + 'ObjArray').splice(arrayIndex, 1);	//remove from the respective visualizations array
	$( "#" + elementID ).fadeOut( ANIMATIONTIME, function(){element.remove();});
}


/////////////CHART EDITION MENUS/////////////
//Create chart visualizationDetails elements
function createChartVisualizationDetails(dataContent, type){
	var optionsSelectFile     = [];
  for (var index = 0; index < dataContent.length; index++) {
    optionsSelectFile.push(dataContent[index].filename);
  }
	var optionsSelectAggregation = ['SUM', 'COUNT', 'AVG', 'MAX', 'MIN'];
	var optionsSelectXaxis = ['variableX1', 'variableX2', 'variableX3'];
	getDataFromServer(type, '/data', ['variables', optionsSelectFile[0]], 'UpdateOpts');
  var optionsSelectYaxis = ['variableY1', 'variableY2', 'variableY3'];
	getDataFromServer(type, '/data', ['variables', optionsSelectFile[0]], 'UpdateOpts');

	var fileSelect			  = createSpecialInputSelect('fileSelectChart', ["36%", "3%"], 'File: ____________________', 'updateVariables', ["34%", "8%"], 150, optionsSelectFile );
	var aggregationSelect = createSpecialInputSelect('aggregationSelect', ["61%", "3%"], 'Aggregation: __________', 'updatePreview', ["59%", "21%"], 100, optionsSelectAggregation );
	var xAxisSelect	 		  = createSpecialInputSelect('xAxisSelect', ["36%", "63%"], 'X-Axis: _______________', 'updatePreview', ["34%", "75%"],  100, optionsSelectXaxis );
	var yAxisSelect			  = createSpecialInputSelect('yAxisSelect', ["61%", "63%"], 'Y-Axis: _______________', 'updatePreview', ["59%", "73%"],  100, optionsSelectYaxis );

  $('#visualizationDetails').html(fileSelect + aggregationSelect + xAxisSelect + yAxisSelect);
	$("#visualizationDetails").css('height', '250px');
	$("#visualizationDetails").css('top', '250px');
}


//Create charts visualizationEditDetails elements
function createChartVisualizationEditDetails(type){
	var colorButton = createHtml('img', '', 'src="./imgs/icons/colorIcon.png" style="position:absolute;width:20px; cursor:pointer;"');
	var colorLabel  = createHtml('label', colorButton, 'for="colorPicker" style="position:absolute; top:-50%; left:85%; width:20px; cursor:pointer;"');
	var colorInput  = createHtml('input', '', 'id="colorPicker" type="color" value="#4F93C4" style="opacity:0;"');
	var colorElements = colorLabel + colorInput;

	var axisData = "";
	if (type != 'pieChart') {
		var xAxisInput  = createSpecialInputText(['18px', '-42px'], '______________', '', [], 'xAxisInput', ['-7px', '-81px'], 115, []);
		var xAxisHide		= createHtml('div', '&times','class="axisHide" style="position:absolute; top:7px; left:37px; width:100px; cursor:pointer;"')
		var xAxisLabel	= createHtml('div', xAxisInput + xAxisHide,'id="xAxisLabel" style="position:absolute; top:-0%; left:50%; width:100px;"')
		var yAxisInput  = createSpecialInputText(['-0px', '-50px'], '______________', '', [], 'yAxisInput', ['-25px', '-72px'], 115, []);
		var yAxisHide		= createHtml('div', '&times','class="axisHide" style="position:absolute; top:-10px; left:40px; width:100px; cursor:pointer;"')
		var yAxisLabel	= createHtml('div', yAxisInput + yAxisHide,'id="yAxisLabel" style="position:absolute; top:-45%; left:0%; width:100px;"')
		axisData				= xAxisLabel + yAxisLabel;
	}else {
		var pieDonutImg = createHtml('img', '', 'id="pieDonutImg" src="./imgs/icons/donutChartIcon.png" alt="pieChart" style="position:absolute; top:-30%; left:85%;width:20px; cursor:pointer;"');
		axisData				= pieDonutImg;
	}

	var daysSpecialInput  		 = (type != 'pieChart') ? createSpecialInputSelect('daysSelectChart', ['36%', '64%'], 'Days: ______________', '', ['34%', '74%'], 100, ["All", "With data"] ) : "";
	var labelTypeInput     		 = (type == 'pieChart') ? createSpecialInputSelect('labelTypeSelectChart', ['36%', '64%'], 'Label Type: ________', '', ['34%', '78%'], 100, ["value", "key", "percent"] ) : "";
	var donutRatioInput  		   = (type == 'pieChart') ? createSpecialInputText(['61%', '64%'], 'Donut Ratio: _______', 'donutRatioSelectChart', ['59%', '74%'], 'donutRatioChart', ['51%', '72.5%'], 100, [""] ) : "";
	var thicknessSpecialInput  = (type == 'barChart') ? createSpecialInputText(['61%', '64%'], 'Thickness: _________', 'thicknessSelectChart', ['59%', '84%'], 'thicknessChart', ['51.5%', '74%'], 50, ["px"]) : "";

  var optionsSizeInput   = ['px', '%'];
	var widthSpecialInput  = createSpecialInputText(['36%', '3%'], 'Width: ______________', 'widthSelectChart', ['34%', '23%'], 'widthChart', ['27%', '6%'], 100, optionsSizeInput );
	var heightSpecialInput = createSpecialInputText(['61%', '3%'], 'Height: ______________', 'heightSelectChart', ['59%', '23%'], 'heightChart', ['51.5%', '6.5%'], 100, optionsSizeInput );

	var labelHide		= createHtml('div', '&times','class="labelHide" style="position:absolute; top:-170px; left:420px; width:100px; cursor:pointer;"')

	$('#visualizationEditDetails').html(colorElements + labelHide + axisData + daysSpecialInput + labelTypeInput + donutRatioInput + thicknessSpecialInput + widthSpecialInput + heightSpecialInput);

	if(type != 'pieChart')
		$('#daysSelectChart').addClass('updatePreview');

	$('#yAxisLabel').css({'transform' : 'rotate(-90deg)'});
	$("#visualizationEditDetails").css('height', '250px');
	$("#visualizationEditDetails").css('top', '250px');
}

function defaultChartValues(){
	if (!$('#colorChart').val())
		$('#colorChart').val('#4682b4');

	if (!$('#thicknessChart').val())
		$('#thicknessChart').val(0.9);

	if (!$('#widthChart').val())
		$('#widthChart').val(500);

	if (!$('#heightChart').val())
		$('#heightChart').val(250);

	if (!$('#donutRatioChart').val())
		$('#donutRatioChart').val(0.35);
}

function chartUpdatePreview(previewID){
	var aggregationType = $('#aggregationSelect').val();
	var timeType = getTimeType();

	$('#xAxisInput').val($('#xAxisSelect').val()); //update xAxis input Value
	$('#yAxisInput').val($('#yAxisSelect').val()); //update yAxis input Value

console.log('chartUpdatePreview');
	getDataFromServerToRefresh(previewID, eval(previewID), previewID.replace('Preview', ''), '/data', [$('#xAxisSelect').val(), $('#yAxisSelect').val(), aggregationType, timeType, startDate, endDate, $('#fileSelectChart').val(), $('#daysSelectChart').val()], 'updateGraph');
}

function chartUpdateOpts(data, preview, type){
	var dataContent = JSON.parse(data), optsX = '', optsY = '';

	if (($('#fileSelectChart').val()).includes('.life'))
    optsAggregation = ['COUNT'];
  else
    optsAggregation = ['SUM', 'COUNT', 'AVG', 'MAX', 'MIN'];

  for (var index = 0; index < dataContent.length; index++) {
		if (objectHasKey(dataContent[index], 'x'))
			optsX += createHtml('option', dataContent[index].x, '');
		else if (objectHasKey(dataContent[index], 'y'))
			optsY += createHtml('option', dataContent[index].y, '');
  }
	$('#xAxisSelect').html(optsX);
  $('#yAxisSelect').html(optsY);
	$('#aggregationSelect').html(createSelectOptions(optsAggregation));

	$('#xAxisInput').val($('#xAxisSelect').val()); $('#yAxisInput').val($('#yAxisSelect').val());
	var aggregationType = $('#aggregationSelect').val();

	var timeType = getTimeType();

	getDataFromServerToRefresh(type + 'Preview', preview, type, '/data', [$('#xAxisSelect').val(), $('#yAxisSelect').val(), aggregationType, timeType, startDate, endDate, $('#fileSelectChart').val(), $('#daysSelectChart').val()], 'updateGraph');
}


function updateGraphProperties(preview, elementID){
	preview.color([$('#colorPicker').val()]);

	if (elementID.includes('barChartPreview')) {
		preview.groupSpacing(1.0 - $('#thicknessChart').val());
	}

	var visualizationType = elementID.replace(/Graph.*|Preview/g, '');
	var objIndex = getObjIndexWithKeyInArray(eval(visualizationType + 'sObjArray'), elementID);
	var objData = (visualizationType != 'pieChart') ? eval(visualizationType + 'sObjArray')[objIndex].chartData[0].values : eval(visualizationType + 'sObjArray')[objIndex].chartData;

	if (visualizationType == 'areaChart' || visualizationType == 'lineChart'){
		var obj = getObjWithKeyInArray(eval(visualizationType + 'sObjArray'), elementID);
		objData = [obj.labels, objData, obj.descriptions];
	}

	updateGraph(elementID, preview, JSON.stringify(objData));
}

function updateImageProperties(elementID){
	var borderRadius 		 = $('#borderImageRadius').val();
	var borderRadiusType = $('#borderRadiusSelect').val();
	var borderImage  		 = $('#borderImage').val();
	var borderType	 		 = $('#borderImageSelect').val();
	// $('#'+ elementID).css('borderRadius', borderRadius + borderRadiusType);
	// $('#'+ elementID).css('border', borderImage + "px " + borderType);

	$($('#'+elementID).find('img')).each(function(){
		if($(this)[0].className == 'visualizationImage' ){
			$(this).css('border-radius', borderRadius + borderRadiusType );
			$(this).css('border', borderImage + "px " + borderType);
		}
	});
}

//check if it need to aglumerate the data in years or months
function getTimeType(){
	var date1 = new Date(startDate);
	var date2 = new Date(endDate);
	var timeDiff = Math.abs(date2.getTime() - date1.getTime());
	var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

	if (diffDays > 730) //365 * 2 = 2 years or more
		return 'years';
	else if(diffDays > 62)	//31 * 2 = 2 months or more
		return 'months';
	else
		return 'days'
}

function getSpecificTimeType(date1, date2){
	var timeDiff = Math.abs(date2.getTime() - date1.getTime());
	var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

	if (diffDays > 730) //365 * 2 = 2 years or more
		return 'years';
	else if(diffDays > 62)	//31 * 2 = 2 months or more
		return 'months';
	else
		return 'days'
}

function getTimeDiffApproximation(date1, date2){
	var timeDiff = Math.abs(date2.getTime() - date1.getTime());
	var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

	if (diffDays > 365) //365 * 2 = 2 years or more
		return Math.floor(diffDays/365);
	else if(diffDays > 62)	//31 * 2 = 2 months or more
		return Math.floor(diffDays/62);
	else
		return diffDays;
}



/////////////VISUALIZATION BRUSH/////////////

function createBrushTool(elementID, width, height, svg){
	var brushMaxWidth = width-10, brushMinWidth = 60;

	var x = d3.scale.ordinal().rangeRoundBands([brushMinWidth, brushMaxWidth], .1);
	var y = d3.scale.linear().range([height, 0]);

  // Draw the brush
  var brush = d3.svg.brush()
      .x(x)
      // .on("brush", brushmove)
      .on("brushend", function(){brushend(elementID, brush, brushMinWidth, brushMaxWidth)});

  var brushg = svg.append("g")
    .attr("class", "brush")
    .call(brush);

  brushg.selectAll(".resize").append("path")
      .attr("transform", "translate(0," +  height / 2 + ")");

  brushg.selectAll("rect")
			.attr("height", height-50);
}

$(document).on('click', '.brushCleaner', function(){
	var parentID = $($(this).parent()).attr('id');
	clearBrushLimit(parentID);
});

function clearBrushLimit(elementID){
	var type = elementID.replace(/Graph.*|Preview/g, '');
	var obj  = getObjWithKeyInArray(eval(type + 'sObjArray'), elementID);

	//remove brush cleaner
	var values 		 = (type == 'barChart') ? obj.chartData[0].values : [ obj.previousLabels, obj.previousData.values, obj.previousDescriptions];
	var valuesSize = (type == 'barChart') ? values[0].x.length : values[0][0].length;

	var firstDateArray, lastDateArray;
	if(values.length == 0){
		if (type == 'barChart') {
			firstDateArray = (obj.previousMonthsDate) ? obj.previousMonthsDate[0].split(':') : ['1970','01'];
			lastDateArray  = (obj.previousMonthsDate) ? obj.previousMonthsDate[obj.previousMonthsDate.length-1].split(':') : [(new Date()).getFullYear(),'01'];
		}else if (type=='areaChart'||type=='lineChart') {
			firstDateArray = (obj.previousMonthsDescriptions) ? obj.previousMonthsDescriptions[0].split(':') : ['1970','01'];
			lastDateArray  = (obj.previousMonthsDescriptions) ? obj.previousMonthsDescriptions[obj.previousMonthsDescriptions.length-1].split(':') : [(new Date()).getFullYear(),'01']		}
		startDate = new Date(parseInt(firstDateArray[0]), parseInt(firstDateArray[1])-1, 1);
		endDate 	= new Date(parseInt(lastDateArray[0]), parseInt(lastDateArray[1]), 0);
	}else if(valuesSize == 7) {
		if (type == 'barChart') {
			firstDateArray = (obj.previousYearsDate) ? obj.previousYearsDate[0].split(':') : ['2000'];
			lastDateArray  = (obj.previousYearsDate) ? obj.previousYearsDate[obj.previousYearsDate.length-1].split(':') : [(new Date()).getFullYear()];
		}else if (type=='areaChart'||type=='lineChart') {
			firstDateArray = (obj.previousYearsDescriptions) ? obj.previousYearsDescriptions[0].split(':') : ['2000'];
			lastDateArray  = (obj.previousYearsDescriptions) ? obj.previousYearsDescriptions[obj.previousYearsDescriptions.length-1].split(':') : [(new Date()).getFullYear()];
		}

		startDate = new Date(parseInt(firstDateArray[0]), 0, 1);
		endDate 	= new Date(parseInt(lastDateArray[0])+1, 0, 0);
		console.log('remove brush cleaner');
		$('#'+elementID + ' .brushCleaner').remove();
	}else if (valuesSize >= 10){
		if (type == 'barChart') {
			firstDateArray = (obj.previousMonthsDate) ? obj.previousMonthsDate[0].split(':') : ['2000','01'];
			lastDateArray  = (obj.previousMonthsDate) ? obj.previousMonthsDate[obj.previousMonthsDate.length-1].split(':') : [(new Date()).getFullYear(),'01'];
		}else if (type=='areaChart'||type=='lineChart') {
			firstDateArray = (obj.previousMonthsDescriptions) ? obj.previousMonthsDescriptions[0].split(':') : ['2000','01'];
			lastDateArray  = (obj.previousMonthsDescriptions) ? obj.previousMonthsDescriptions[obj.previousMonthsDescriptions.length-1].split(':') : [(new Date()).getFullYear(),'01'];
		}

		startDate = new Date(parseInt(firstDateArray[0]), parseInt(firstDateArray[1])-1, 1);
		endDate 	= new Date(parseInt(lastDateArray[0]), parseInt(lastDateArray[1]), 0);
	}

	console.log(startDate);
	console.log(endDate);

	//if(type=='areaChart') updateAreaColor(elementID, [firstDateArray], 'clearBrush');
	if(type=='lineChart') updateLineColor(elementID, [firstDateArray], 'clearBrush');

	$('.visualization').trigger('time', ['chartTimeEvent']);

	//updateGraph(elementID, obj[elementID], JSON.stringify(values));
}

function brushend(elementID, brush, brushMinWidth, brushMaxWidth) {
	brushValues = brush.extent();

	if (brushValues[0] == 0 && brushValues[1] == 0){
		$($('#' + elementID).find('.extent')[0]).attr('width', '0px');
		return;
	}

	var type 				  				 = elementID.replace(/Graph.*|Preview/g, '');
	var obj 						       = getObjWithKeyInArray(eval(type + 'sObjArray'), elementID);

	var previousData					 = obj.chartData[0];
	var previousLabels		 		 = obj.labels;
	var previousDescriptions	 = obj.descriptions;
	var currentObjValuesLength = obj.chartData[0].values.length; //ex: 2 values ['feb 2017', 'mar 2017']
	var brushWidthDiff 				 = brushMaxWidth - brushMinWidth;	 //represents the size of the area where we can create the brush ex: 500 - 60
	var valuesContainerSize 	 = brushWidthDiff/currentObjValuesLength;

	var startIndex = Math.floor((brushValues[0]-brushMinWidth)/valuesContainerSize);	//0 represents first bar, 1 represents the second, etc..
	var endIndex 	 = Math.floor((brushValues[1]-brushMinWidth)/valuesContainerSize);

	var startContainerIndex = ((brushValues[0]-brushMinWidth) < brushWidthDiff) ? startIndex : currentObjValuesLength-1;
	var endContainerIndex 	= ((brushValues[1]-brushMinWidth)	< brushWidthDiff) ? endIndex	 : currentObjValuesLength-1;

	if ((brushValues[0]-brushMinWidth) == valuesContainerSize) //decrease one if values are the same (ex: 1 parcel would return 0, 1 if the all area were covered)
		startContainerIndex--;
	if ((brushValues[1]-brushMinWidth) == valuesContainerSize)
		endContainerIndex--;

	var parent, xFirstLabelElement, xFirstLabel, xLastLabelElement, xLastLabel;
	if (type == 'areaChart' || type == 'lineChart') {
		xFirstLabel				 = convertToChartDates(obj.labels[startContainerIndex]);
		xLastLabel				 = convertToChartDates(obj.labels[endContainerIndex]);
		// console.log('area: ' + eval(type +'LabelsPreview'));
	}else{
		parent 			  		 = $('#'+elementID).find('.nv-series-0')[0];
		xFirstLabelElement = $($('#'+elementID).find('.nv-x')[0]).find('.tick')[startContainerIndex];
		xFirstLabel				 = $($(xFirstLabelElement).find('text')[0]).html();
		xLastLabelElement  = $($('#'+elementID).find('.nv-x')[0]).find('.tick')[endContainerIndex];
		xLastLabel				 = $($(xLastLabelElement).find('text')[0]).html();
	}

	$($('#'+elementID).find('.nv-series-0')[0]).attr('zIndex', 10);
	if (xFirstLabel == null && xLastLabel == null){
		$($('#' + elementID).find('.extent')[0]).attr('width', '0px');
		return;
	}

	var thisStartDate = new Date(xFirstLabel);
	var thisEndDate   = new Date(xLastLabel);
	var thisEndDateArray = xLastLabel.split(' ');
	if (thisEndDateArray.length == 1)
		thisEndDate   = new Date(thisEndDateArray[0], 12, 0);
	else if (thisEndDateArray.length == 2)
	thisEndDate   = new Date(thisEndDateArray[1], getIndexMonth(thisEndDateArray[0], monthAbrevNames), 0);

	//create the back Point
	obj['previousData']					= previousData;
	obj['previousLabels']				= previousLabels;
	obj['previousDescriptions'] = previousDescriptions;


	if ($('#' + elementID).find('.brushCleaner').length == 0) {
		var brushBackButton = createHtml('img', '', 'src="./imgs/icons/containerIcons/arrows/back.png" style="position:absolute; top:2%; left:2%; width:20px; cursor:pointer;" class="brushCleaner"');
		$('#' + elementID).append(brushBackButton);
	}

	startDate = thisStartDate;
	endDate   = thisEndDate

	var timeType = 'months';
	if (type == 'barChart') {
		if (previousData.values[0].x.length == 4){
			obj.previousYearsDate	= [previousData.values[0].x, previousData.values[previousData.values.length-1].x];
		}else if (previousData.values[0].x.length == 7){
			obj.previousMonthsDate	= [previousData.values[0].x, previousData.values[previousData.values.length-1].x];
			timeType = 'days';
		}else if (previousData.values[0].x.length > 7)
			timeType = 'days';
	}else if (type == 'areaChart' || type == 'lineChart') {
		if (previousLabels[0].length == 4){
			obj.previousYearsDate				  = [previousData.values[0][1], previousData.values[0][previousData.values.length-1]];
			obj.previousYearsDescriptions	= [previousLabels[0], previousLabels[previousLabels.length-1]];
		}else if (previousLabels[0].length == 7){
			obj.previousMonthsDate				 = [previousData.values[0][1], previousData.values[0][previousData.values.length-1]];
			obj.previousMonthsDescriptions = [previousLabels[0], previousLabels[previousLabels.length-1]];
			timeType = 'days';
		}else if (previousLabels[0].length > 7){
			timeType = 'days';
		}
	}

	//if (type == 'areaChart') updateAreaColor(elementID, previousLabels, 'brushend');
	if (type == 'lineChart') updateLineColor(elementID, previousLabels, 'brushend');


	$('.visualization').trigger('time', ['brushEnd', timeType]);

	getDataFromServerToRefresh(elementID, obj[elementID], type, '/data', [obj.xAxis, obj.yAxis, obj.aggregationType, timeType, thisStartDate, thisEndDate, obj.filename, obj.showTimestamp], 'updateGraph');
	$($('#' + elementID).find('.extent')[0]).attr('width', '0px');
}



/////////////INPUT VALIDATORS/////////////
//validators for the forms
function getFormValidators(){
	return { label: {
							validators: { stringLength: { min: 0, max: 20, message: 'Can have more than 20 characteres'}}
					},color: {
							validators: { stringLength: { min: 7, max: 7, message: 'Color code between #000000 and #ffffff'},
														regexp: {regexp: /^#[A-Za-z0-9]/, message: 'Color code between #000000 and #ffffff'}}
					}, thickness: {
							validators: { between: { min: 0.0, max: 1.0, message: 'Number between 0 and 1'}}
					}, width: {
							validators: { between: { min: 100, max: 1000, message: 'Width must be between 100 and 1000'}}
					},height: {
							validators: { between: { min: 100, max: 1000, message: 'Height must be between 100 and 1000'}}
					}
				}
}
