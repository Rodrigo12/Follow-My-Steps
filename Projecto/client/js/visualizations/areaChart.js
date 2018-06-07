var areaChartGraphNumber = 0;
var areaChartsObjArray = [];
var areaChartPreview;

function areaChartContainerSetting(data){
	var dataContent = JSON.parse(data);

	createAreaChartPreview();

	createChartVisualizationDetails(dataContent, 'areaChart');
  createChartVisualizationEditDetails('areaChart');
	defaultChartValues();

	validateForm('visualizationForm', getFormValidators());
}

function createAreaChartPreview(){
	if ($('#areaChartPreview').length == 0) {
		createChartCommonElements('areaChartPreview', 'visualizationHeaderPreview', '');

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

		addAreaGraph(areaLineChartPreviewData, areaLineChartLabelsPreviewData, areaLineChartLabelsPreviewData, 'areaChartPreview', properties, true);
	}
}

function areaChartUpdateOpts(data){
  chartUpdateOpts(data, areaChartPreview, 'areaChart');
}

function areaChartVisualizationElement(){
	areaChartGraphNumber += 1;
	createVisualizationGraphElements('areaChartGraph'+ areaChartGraphNumber, areaChartGraphNumber, 'areaChartGraph visualization', 'visualizationsBody')

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


	addAreaGraph(areaChartsObjArray[0].chartData, areaChartsObjArray[0].labels, areaChartsObjArray[0].descriptions, 'areaChartGraph'+ areaChartGraphNumber, properties, false);
	hideContainer('visualizationContainer', ANIMATIONTIME, ['16%', '95%'], hideContainerContent, hide);
}


//Properties = [width, height, showLegend, showXAxisLabel, showYAxisLabel, color, xAxisInput, yAxisInput, xAxisLabel, yAxisLabel]
function addAreaGraph(objData, labels, descriptions, elementID, properties, isPreview){
  nv.addGraph(function() {
    var chart = nv.models.stackedAreaChart()
									.width(properties[0])
									.height(properties[1])
									.color([properties[5]])
                  .x(function(d) { return d[0] })   //We can modify the data accessor functions...
                  .y(function(d) { return d[1] })   //...in case your data is formatted differently.
                  .showControls(true)       				//Allow user to choose 'Stacked', 'Stream', 'Expanded' mode.
									.showLegend(properties[2])
									.showControls(false);

		if (properties[3]) {
	 		chart.xAxis.axisLabel(properties[8]);
	  }
		if (properties[4]) {
		  chart.yAxis.axisLabel(properties[9])
		}

		chart.xAxis.tickFormat(function (d) {
				return convertToChartDates(labels[d]);
		});

		chart.yAxis.tickFormat(function (d) {	return d;	});

		chart.tooltip.headerFormatter(function (d) {
			return (descriptions == null || isDate(descriptions[d])) ? convertToChartDates(labels[d]) : convertToChartDates(labels[d]) + ' </br> ' + descriptions[d];
		});

		chart.noData("No data found for this time period");
		chart.padData(true);

		var svg = d3.select('#' + elementID + ' svg')
			.attr('viewBox', '0 0 ' + properties[0] + ' ' + properties[1])
			.datum(objData);

		$('#' + elementID).css('width', properties[0] + 'px');
		$('#' + elementID).css('height', properties[1] + 'px');

		//create brush tool (visualizations.js)
		createBrushTool(elementID, properties[0], properties[1], svg);

		svg.transition().duration(0).call(chart);

		$('#' + elementID).on('time',
										function (evt, param1, param2){
											var updateButton = $('#'+elementID).find('.updateVisualizationButton')[0];
	                    var updateVis 	 = ($(updateButton).attr('src').includes('updateBlocked')) ? false : true;
											if (updateAllVisualizations && updateVis)
												getNewDataAreaGraph(elementID, chart, param1, param2);
							});

		if (isPreview)
			areaChartPreview = chart;

		//labels = (areaChartsObjArray[0] == null) ? labels : areaChartsObjArray[0].labels ;//if preview already created
		var chartLabels = [];
		for (var index = 0; index < labels.length; index++) {
			if (labels[index] != null && !labels[index].includes('Label')) {
				chartLabels.push(labels[index]);
			}
		}
		//console.log(chartLabels);
		var styleData = {'width':properties[0], 'height':properties[1], 'showLegend':properties[2], 'showXAxisLabel':properties[3], 'showYAxisLabel':properties[4], 'color':properties[5], 'labels': chartLabels, 'xAxisLabel':properties[8], 'yAxisLabel':properties[9], 'showTimestamp':properties[10], 'descriptions':descriptions};
		if (isPreview && areaChartsObjArray != 0)  //if ispreview and preview already added to array
			updateAreaChartPreview(elementID, chart, objData, styleData);
		else
			addNewAreaChartObj(elementID, chart, objData, styleData, properties[11], properties[6], properties[7], properties[12]);

		updateAreaColor(elementID, labels, 'addAreaGraph');
		updateStyleAllVisualizations();	//update text on graphs after the graph update

    return chart;
  },function(){});
}


function updateAreaColor(elementID, previousLabels, type){
	console.log(type);
	console.log(previousLabels);
	var elementArea = $('#'+elementID).find('.nv-area')[0];
	if (type == 'brushend' || type == 'addAreaGraph' || type == 'updateGraph') {
		if (previousLabels[0].length == 4){
			console.log('years');
			$(elementArea).addClass('yearsBar');
		}else if (previousLabels[0].length == 7){
			console.log('months');
			$(elementArea).removeClass('yearsBar');
			$(elementArea).addClass('monthsBar');
		}else {
			console.log('days');
			$(elementArea).removeClass('monthsBar');
			$(elementArea).addClass('daysBar');
		}
	}else if(type == 'clearBrush'){
		if (previousLabels[0].length == 4){
			$(elementArea).addClass('yearsBar');
		}else if (previousLabels[0].length == 7){
			$(elementArea).removeClass('monthsBar');
			$(elementArea).addClass('yearsBar');
		}else {
			$(elementArea).addClass('monthsBar');
			$(elementArea).removeClass('daysBar');
		}
	}
}


function updateAreaChartPreview(chartID, chart, objData, styleData){
	var areaChartObj 		  = areaChartsObjArray[0];
	areaChartObj[chartID] = chart;					//create an object property with the element chart id ex:{areaChartVisualization1:chart}
	areaChartObj['aggregationType'] = $('#aggregationSelect').val();
	areaChartObj['chartData']			  = objData;
	areaChartObj['xAxis'] 					= $('#xAxisSelect').val();
	areaChartObj['yAxis'] 					= $('#yAxisSelect').val();
	areaChartObj['xAxisLabel'] 		  = $('#xAxisInput').val();
	areaChartObj['yAxisLabel'] 		  = $('#yAxisInput').val();

	areaChartObj['width'] 		 		 = styleData.width;
	areaChartObj['height'] 		 		 = styleData.height;
	areaChartObj['showLegend'] 		 = styleData.showLegend;
	areaChartObj['showXAxisLabel'] = styleData.showXAxisLabel;
	areaChartObj['showYAxisLabel'] = styleData.showYAxisLabel;
	areaChartObj['color'] 				 = styleData.color;
	areaChartObj['showTimestamp']  = styleData.showTimestamp;
	areaChartObj['descriptions']   = styleData.descriptions;
	areaChartObj['filename'] 			 = $('#fileSelectChart').val();
}

//Function that adds the new created area chart to the areachart object array
function addNewAreaChartObj(chartID, chart, objData, styleData, filename, xAxis, yAxis, aggregation){
	var areaChartObj 		 					 = {};
	areaChartObj['id'] 		 				 = chartID;
	areaChartObj[chartID] 				 = chart;					//create an object property with the element chart id ex:{areaChartVisualization1:chart}
	areaChartObj['chartData'] 		 = objData;

	areaChartObj['width'] 		 		 = styleData.width;
	areaChartObj['height'] 		 		 = styleData.height;
	areaChartObj['showLegend'] 		 = styleData.showLegend;
	areaChartObj['showXAxisLabel'] = styleData.showXAxisLabel;
	areaChartObj['showYAxisLabel'] = styleData.showYAxisLabel;
	areaChartObj['xAxisLabel']  	 = styleData.xAxisLabel;
	areaChartObj['yAxisLabel']  	 = styleData.yAxisLabel;
	areaChartObj['color'] 				 = styleData.color;
	areaChartObj['showTimestamp']  = styleData.showTimestamp;
	areaChartObj['descriptions']   = styleData.descriptions;
	areaChartObj['labels'] 				 = styleData.labels;

	areaChartObj['previousYearsDate']  				= '';
	areaChartObj['previousYearsDescriptions']  = '';
	areaChartObj['previousMonthsDate'] 				= '';
	areaChartObj['previousMonthsDescriptions'] = '';

	areaChartObj['filename'] 			  = (filename) 	  ? filename : $('#fileSelectChart').val();
	areaChartObj['xAxis'] 				  = (xAxis) 	 		? xAxis : $('#xAxisSelect').val();
	areaChartObj['yAxis'] 	  		  = (yAxis) 	 		? yAxis : $('#yAxisSelect').val();
	areaChartObj['aggregationType'] = (aggregation) ? aggregation : $('#aggregationSelect').val();

	areaChartsObjArray.push(areaChartObj);
}


//Function that adds the new created area chart to the areachart object array
function getNewDataAreaGraph(elementID, chart, param1, param2){
		//if (is to update)
			var timeType = getTimeType();

			var obj = getObjWithKeyInArray(areaChartsObjArray, elementID);
			var aggregationType = getValueByKey(obj, 'aggregationType');

			if (param1 == 'brushEnd') {
				timeType = param2;
			}

			params = [obj.xAxis, obj.yAxis, aggregationType, timeType, startDate, endDate, obj.filename, obj.showTimestamp];
			getDataFromServerToRefresh(elementID, chart, 'areaChart', '/data', params, 'updateGraph');
}


//Properties = [width, height, showLegend, showXAxisLabel, showYAxisLabel, color, xAxis, yAxis]
function areaChartLoad(objData, elementID, properties, filename){
	createAreaChartPreview();
	areaChartGraphNumber = Math.max(parseInt(elementID.match(/\d+/)[0]) + 1, areaChartGraphNumber + 1); // update areaChartGraphNumber

	//create visualization
	createVisualizationGraphElements(elementID, areaChartGraphNumber, 'areaChartGraph visualization', 'visualizationsBody');
	var propertiesAreaChart = [properties.width, properties.height, properties.showLegend, properties.showXAxisLabel, properties.showYAxisLabel, properties.color, properties.xAxis, properties.yAxis, properties.xAxisLabel, properties.yAxisLabel, properties.showTimestamp, filename, properties.aggregation];
	addAreaGraph(JSON.parse(objData), properties.labels, properties.descriptions, elementID, propertiesAreaChart, false);

	//place visualization
	if (properties.translate != 'none')
		$('#' + elementID).css('transform', properties.translate);
	if (properties.hasOwnProperty('dataX'))
		$('#' + elementID).attr('data-x', properties.dataX);
	if (properties.hasOwnProperty('dataY'))
		$('#' + elementID).attr('data-y', properties.dataY);
}
