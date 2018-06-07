var lineChartGraphNumber = 0;
var lineChartsObjArray = [];
var lineChartPreview;

function lineChartContainerSetting(data){
	var dataContent = JSON.parse(data);

	createLineChartPreview();

	createChartVisualizationDetails(dataContent, 'lineChart');
  createChartVisualizationEditDetails('lineChart');
	defaultChartValues();

	validateForm('visualizationForm', getFormValidators());
}


function createLineChartPreview(){
	if ($('#lineChartPreview').length == 0) {
		createChartCommonElements('lineChartPreview', 'visualizationHeaderPreview', '');

		var width 					= 400;
		var height 					= 200;
		var showLegend 			= true;
		var showXAxisLabel  = false;
		var showYAxisLabel  = false;
		var color						= '#4682b4';
		var xAxisInput 			=	true;
		var yAxisInput 			=	true;
		var xAxisLabel 			=	'xAxis';
		var yAxisLabel 			=	'yAxis';
		var showTimestamp 	=	'With data';
		var properties 			= [width, height, showLegend, showXAxisLabel, showYAxisLabel, color, xAxisInput, yAxisInput, xAxisLabel, yAxisLabel, showTimestamp];


		addLineGraph(areaLineChartPreviewData, areaLineChartLabelsPreviewData, areaLineChartLabelsPreviewData, 'lineChartPreview', properties, true);
	}
}


function lineChartUpdateOpts(data){
  chartUpdateOpts(data, lineChartPreview, 'lineChart');
}

function lineChartVisualizationElement(){
	lineChartGraphNumber += 1;
	createVisualizationGraphElements('lineChartGraph'+ lineChartGraphNumber, lineChartGraphNumber, 'lineChartGraph visualization', 'visualizationsBody')

	var width 					= parseInt($('#widthChart').val());
	var height 					= parseInt($('#heightChart').val());
	var showLegend 			= ($($('.nv-series')[0]).css('opacity') == 1) ? true : false;
	var showXAxisLabel  = ($('#xAxisInput').css('opacity') == 1) ? true : false;
	var showYAxisLabel  = ($('#yAxisInput').css('opacity') == 1) ? true : false;
	var color						= $('#colorPicker').val();
	var xAxisInput 			=	$('#xAxisSelect').val();
	var yAxisInput 			=	$('#yAxisSelect').val();
	var xAxisLabel 			=	$('#xAxisInput').val();
	var yAxisLabel 			=	$('#yAxisInput').val();
	var showTimestamp   =	$('#daysSelectChart').val();
	var properties 			= [width, height, showLegend, showXAxisLabel, showYAxisLabel, color, xAxisInput, yAxisInput, xAxisLabel, yAxisLabel, showTimestamp];


	addLineGraph(lineChartsObjArray[0].chartData, lineChartsObjArray[0].labels, lineChartsObjArray[0].descriptions, 'lineChartGraph'+ lineChartGraphNumber, properties, false);
	hideContainer('visualizationContainer', ANIMATIONTIME, ['16%', '95%'], hideContainerContent, hide);
}

//Properties = [width, height, showLegend, showXAxisLabel, showYAxisLabel, color, xAxisInput, yAxisInput]
function addLineGraph(objData, labels, descriptions, elementID, properties, isPreview){
	nv.addGraph(function() {
		var chart = nv.models.lineChart()
								.width(properties[0])
								.height(properties[1])
								.color([properties[5]])
								.showLegend(properties[2])
                .showYAxis(true)        //Show the y-axis
                .showXAxis(true);       //Show the x-axis

		if (properties[3]) {
	 		chart.xAxis.axisLabel(properties[8]);
	  }
	  if (properties[4]) {
	 		chart.yAxis.axisLabel(properties[9])
	  }

		chart.xAxis.tickFormat(function (d) {
				return convertToChartDates(labels[d]);
		});

		chart.tooltip.headerFormatter(function (d) {
			return (descriptions == null || isDate(descriptions[d])) ? convertToChartDates(labels[d]) : convertToChartDates(labels[d]) + ' </br> ' + descriptions[d];
		});


		chart.noData("No data found for this time period");
		chart.padData(true);

	  //chart.yAxis.tickFormat(d3.format(.2));
		chart.yAxis.tickFormat(function (d) {	return d;	});

		var svg = d3.select('#' + elementID + ' svg')
			.attr('viewBox', '0 0 ' + properties[0] + ' ' + properties[1])
			.datum(objData);

			$('#' + elementID).css('width', properties[0] + 'px');
			$('#' + elementID).css('height', properties[1] + 'px');

		//create brush tool (visualizations.js)
		createBrushTool(elementID, properties[0], properties[1], svg);

    //nv.utils.windowResize(function() { chart.update() });

		svg.transition().duration(0).call(chart);

		$('#' + elementID).on('time',
										function (evt, param1, param2){
											var updateButton = $('#'+elementID).find('.updateVisualizationButton')[0];
	                    var updateVis 	 = ($(updateButton).attr('src').includes('updateBlocked')) ? false : true;
	                    if (updateAllVisualizations && updateVis)
												getNewDataLineGraph(elementID, chart, param1, param2);
							});

		if (isPreview)
			lineChartPreview = chart;

		//labels = (lineChartsObjArray[0] == null) ? labels : lineChartsObjArray[0].labels ;//if preview already created
		var chartLabels = [];
		for (var index = 0; index < labels.length; index++) {
			if (labels[index] != null && !labels[index].includes('Label')){
				chartLabels.push(labels[index]);
			}
		}
		//console.log(chartLabels);
		var styleData = {'width':properties[0], 'height':properties[1], 'showLegend':properties[2], 'showXAxisLabel':properties[3], 'showYAxisLabel':properties[4], 'color':properties[5], 'labels': chartLabels, 'xAxisLabel':properties[8], 'yAxisLabel':properties[9], 'showTimestamp':properties[10], 'descriptions':descriptions};
		if (isPreview && lineChartsObjArray != 0)  //if ispreview and preview already added to array
			updateLineChartPreview(elementID, chart, objData, styleData);
		else
			addNewLineChartObj(elementID, chart, objData, styleData, properties[11], properties[6], properties[7], properties[12]);

		updateLineColor(elementID, labels, 'addLineGraph');
		updateStyleAllVisualizations();	//update text on graphs after the graph update

	  return chart;
	});
}


function updateLineColor(elementID, previousLabels, type){
	var elementLine = $('#'+elementID).find('path');
	if (type == 'brushend' || type == 'addLineGraph') {
		if (previousLabels[0].length == 4){
			$(elementLine).removeClass('yearsBar');
			$(elementLine).addClass('monthsBar');
		}else if (previousLabels[0].length == 7){
			$(elementLine).removeClass('monthsBar');
			$(elementLine).addClass('daysBar');
		}else {
			$(elementLine).addClass('daysBar');
		}
	}else if(type == 'clearBrush'){
		if (previousLabels[0].length == 4){
			$(elementArea).addClass('yearsBar');
		}else if (previousLabels[0].length == 7){
			$(elementLine).removeClass('monthsBar');
			$(elementLine).addClass('yearsBar');
		}else {
			$(elementLine).addClass('monthsBar');
			$(elementLine).removeClass('daysBar');
		}
	}
}


function updateLineChartPreview(chartID, chart, objData, styleData){
	var lineChartObj 		  = lineChartsObjArray[0];
	lineChartObj[chartID] = chart;					//create an object property with the element chart id ex:{lineChartVisualization1:chart}
	lineChartObj['aggregationType'] = $('#aggregationSelect').val();
	lineChartObj['chartData']			  = objData;
	lineChartObj['xAxis'] 					= $('#xAxisSelect').val();
	lineChartObj['yAxis'] 					= $('#yAxisSelect').val();
	lineChartObj['xAxisLabel'] 		  = $('#xAxisInput').val();
	lineChartObj['yAxisLabel'] 		  = $('#yAxisInput').val();

	lineChartObj['width'] 		 		 = styleData.width;
	lineChartObj['height'] 		 		 = styleData.height;
	lineChartObj['showLegend'] 		 = styleData.showLegend;
	lineChartObj['showXAxisLabel'] = styleData.showXAxisLabel;
	lineChartObj['showYAxisLabel'] = styleData.showYAxisLabel;
	lineChartObj['color'] 				 = styleData.color;
	lineChartObj['showTimestamp']  = styleData.showTimestamp;
	lineChartObj['descriptions']   = styleData.descriptions;
	lineChartObj['filename'] 			 = $('#fileSelectChart').val();
}

//Function that adds the new created line chart to the linechart object array
function addNewLineChartObj(chartID, chart, objData, styleData, filename, xAxis, yAxis, aggregation){
	var lineChartObj 		 = {};
	lineChartObj['id'] 		 				 = chartID;
	lineChartObj[chartID] 				 = chart;					//create an object property with the element chart id ex:{lineChartVisualization1:chart}
	lineChartObj['chartData'] 		 = objData;

	lineChartObj['width'] 		 		 = styleData.width;
	lineChartObj['height'] 		 		 = styleData.height;
	lineChartObj['showLegend'] 		 = styleData.showLegend;
	lineChartObj['showXAxisLabel'] = styleData.showXAxisLabel;
	lineChartObj['showYAxisLabel'] = styleData.showYAxisLabel;
	lineChartObj['xAxisLabel']  	 = styleData.xAxisLabel;
	lineChartObj['yAxisLabel']  	 = styleData.yAxisLabel;
	lineChartObj['color'] 				 = styleData.color;
	lineChartObj['showTimestamp']  = styleData.showTimestamp;
	lineChartObj['descriptions']   = styleData.descriptions;
	lineChartObj['labels'] 				 = styleData.labels;

	lineChartObj['filename'] 			  = (filename) 	  ? filename : $('#fileSelectChart').val();
	lineChartObj['xAxis'] 				  = (xAxis) 	 		? xAxis : $('#xAxisSelect').val();
	lineChartObj['yAxis'] 	  		  = (yAxis) 	 		? yAxis : $('#yAxisSelect').val();
	lineChartObj['aggregationType'] = (aggregation) ? aggregation : $('#aggregationSelect').val();

	lineChartsObjArray.push(lineChartObj);
}

//Function that adds the new created line chart to the linechart object array
function getNewDataLineGraph(elementID, chart, param1, param2){
	//if (is to update)
		var timeType = getTimeType();

		var obj = getObjWithKeyInArray(lineChartsObjArray, elementID);
		var aggregationType = getValueByKey(obj, 'aggregationType');

		if (param1 == 'brushEnd') {
			timeType = param2;
		}

		params = [obj.xAxis, obj.yAxis, aggregationType, timeType, startDate, endDate, obj.filename, obj.showTimestamp];
		getDataFromServerToRefresh(elementID, chart, 'lineChart', '/data', params, 'updateGraph');
}


//Properties = [width, height, showLegend, showXAxisLabel, showYAxisLabel, color, xAxis, yAxis]
function lineChartLoad(objData, elementID, properties, filename){
	lineChartGraphNumber = Math.max(parseInt(elementID.match(/\d+/)[0]) + 1, lineChartGraphNumber + 1); // update lineChartGraphNumber

	//create visualization
	createVisualizationGraphElements(elementID, lineChartGraphNumber, 'lineChartGraph visualization', 'visualizationsBody');
	var propertiesLineChart = [properties.width, properties.height, properties.showLegend, properties.showXAxisLabel, properties.showYAxisLabel, properties.color, properties.xAxis, properties.yAxis, properties.xAxisLabel, properties.yAxisLabel, properties.showTimestamp, filename, properties.aggregation];
	addLineGraph(JSON.parse(objData), properties.labels, properties.descriptions, elementID, propertiesLineChart, false);

	//place visualization
	if (properties.translate != 'none')
		$('#' + elementID).css('transform', properties.translate);
	if (properties.hasOwnProperty('dataX'))
		$('#' + elementID).attr('data-x', properties.dataX);
	if (properties.hasOwnProperty('dataY'))
		$('#' + elementID).attr('data-y', properties.dataY);
}
