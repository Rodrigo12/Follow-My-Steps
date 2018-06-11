var barChartGraphNumber = 0;
var barChartsObjArray = [];
var barChartPreview;

function barChartContainerSetting(data){
	var dataContent = JSON.parse(data);

 	createBarChartPreview();

	createChartVisualizationDetails(dataContent, 'barChart');
  createChartVisualizationEditDetails('barChart');
	defaultChartValues();

	validateForm('visualizationForm', getFormValidators());
}

function createBarChartPreview(){
	if ($('#barChartPreview').length == 0) {
		createChartCommonElements('barChartPreview', 'visualizationHeaderPreview', '');

		var width 					= 400;
		var height 					= 200;
		var showLegend 			= true;
		var showXAxisLabel  = false;
		var showYAxisLabel  = false;
		var color						= '#4682b4';
		var xAxisInput 			=	true;
		var yAxisInput 			=	true;
		var thickness 			=	0.1;
		var xAxisLabel 			=	'xAxis';
		var yAxisLabel 			=	'yAxis';
		var showTimestamp 	=	'With data';
		var properties 			= [width, height, showLegend, showXAxisLabel, showYAxisLabel, color, xAxisInput, yAxisInput, thickness, xAxisLabel, yAxisLabel, showTimestamp];

		addBarGraph(barChartPreviewData, 'barChartPreview', properties, true);
	}
}

function barChartUpdateOpts(data){
  chartUpdateOpts(data, barChartPreview, 'barChart');
}

function barChartVisualizationElement(){
	barChartGraphNumber += 1;
	createVisualizationGraphElements('barChartGraph'+ barChartGraphNumber, barChartGraphNumber, 'barChartGraph visualization', 'visualizationsBody');

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
	var thickness 			=	1.0 - $('#thicknessChart').val();
	var showTimestamp   =	$('#daysSelectChart').val();
	var properties = [width, height, showLegend, showXAxisLabel, showYAxisLabel, color, xAxisInput, yAxisInput, thickness, xAxisLabel, yAxisLabel, showTimestamp];

	addBarGraph(barChartsObjArray[0].chartData, 'barChartGraph'+ barChartGraphNumber, properties, false);
	hideContainer('visualizationContainer', ANIMATIONTIME, ['16%', '95%'], hideContainerContent, hide);
}


//Properties = [width, height, showLegend, showXAxisLabel, showYAxisLabel, color, xAxisInput, yAxisInput, thickness, xAxisLabel, yAxisLabel]
function addBarGraph(objData, elementID, properties, isPreview){
	nv.addGraph(
		 function() {
			var chart = nv.models.multiBarChart()
				.width(properties[0])
				.height(properties[1])
				.x(function(d) {return d.x})   //We can modify the data accessor functions...
				.y(function(d) {return d.y})   //...in case your data is formatted differently.
				.color([properties[5]])
				.stacked(true)
				.showLegend(properties[2])
				.showYAxis(true)
        .showXAxis(true)
				.rotateLabels(0)
				.reduceXTicks(true)
				.showControls(false);

			 if (properties[3]) {
			 	chart.xAxis.axisLabel(properties[9]);
			 }
			 if (properties[4]) {
				chart.yAxis.axisLabel(properties[10])
			 }

			chart.xAxis.tickFormat(function (d) {
										return convertToChartDates(d);
									});

	   	chart.yAxis.tickFormat(function (d) {	return d;	});

			chart.tooltip.headerFormatter(function (d) {
				var obj = getObjWithValueInArray(objData[0].values, 'x', d);
				return (obj == null || obj.xvalues == null || isDate(obj.xvalues)) ? convertToChartDates(d) : convertToChartDates(d) + ' </br> ' + obj.xvalues;
			});

			chart.groupSpacing(properties[8]);

			chart.noData("No data found for this time period");

			var svg = d3.select('#' + elementID + ' svg')
				.attr('viewBox', '0 0 ' + properties[0] + ' ' + properties[1])
				.datum(objData);

			$('#' + elementID).css('width', properties[0] + 'px');
			$('#' + elementID).css('height', properties[1] + 'px');

			//create brush tool (visualizations.js)
			createBrushTool(elementID, properties[0], properties[1], svg);

			//Update the chart when window resizes.
  		//nv.utils.windowResize(function() { console.log('update graph');chart.update() });

			svg.transition().duration(0).call(chart);

			$('#' + elementID).on('time',
                      function (evt, param1, param2){
												var updateButton = $('#'+elementID).find('.updateVisualizationButton')[0];
												var updateVis 	 = ($(updateButton).attr('src').includes('updateBlocked')) ? false : true;
												if(updateAllVisualizations && updateVis)
                        	getNewDataBarGraph(elementID, chart, param1, param2);
                });

			if (isPreview)
				barChartPreview = chart;

			var styleData = {'width':properties[0], 'height':properties[1], 'thickness': properties[8], 'showLegend':properties[2], 'showXAxisLabel':properties[3], 'showYAxisLabel':properties[4], 'color':properties[5], 'xAxisLabel':properties[9], 'yAxisLabel':properties[10], 'showTimestamp':properties[11]};
			if (isPreview && barChartsObjArray.length != 0 && barChartsObjArray[0].id == 'barChartPreview')  //if ispreview and preview already added to array
				updateBarChartPreview(elementID, chart, objData, styleData);
			else
				addNewBarChartObj(elementID, chart, objData, styleData, properties[12], properties[6], properties[7], properties[13]);

			d3.selectAll("rect").attr('class', function(d){
				var currentClassName = $($(this)[0]).attr('class');

				var timeType;
				if(d.x == null)
					return currentClassName;
				if ((d.x).length == 4) {timeType = 'years';}
				else if ((d.x).length == 7) {timeType = 'months';}
				else {timeType = 'days';}
				return currentClassName + " " + timeType + 'Bar';
			});

			updateStyleAllVisualizations();	//update text on graphs after the graph update

			return chart;
		},function(){
          d3.selectAll(".nv-bar").on('click',
               function(){
								 if ($(this).closest('.preview').length > 0) {
									barChartsObjArray[0].xAxis = properties[6];
 							 		barChartsObjArray[0].yAxis = properties[7];
							 	}

								barChartElementsInteraction(this);
           });
	});
}


function updateBarChartPreview(chartID, chart, objData, styleData){
	var barChartObj 		 = barChartsObjArray[0];
	barChartObj[chartID] = chart;					//create an object property with the element chart id ex:{barChartVisualization1:chart}
	barChartObj['aggregationType'] = $('#aggregationSelect').val();
	barChartObj['chartData']			 = objData;
	barChartObj['xAxis'] 					 = $('#xAxisSelect').val();
	barChartObj['yAxis'] 					 = $('#yAxisSelect').val();
	barChartObj['xAxisLabel'] 		 = $('#xAxisInput').val();
	barChartObj['yAxisLabel'] 		 = $('#yAxisInput').val();

	barChartObj['width'] 		 			 = styleData.width;
	barChartObj['height'] 		 		 = styleData.height;
	barChartObj['thickness'] 		 	 = styleData.thickness;
	barChartObj['showLegend'] 		 = styleData.showLegend;
	barChartObj['showXAxisLabel']  = styleData.showXAxisLabel;
	barChartObj['showYAxisLabel']  = styleData.showYAxisLabel;
	barChartObj['color'] 					 = styleData.color;
	barChartObj['showTimestamp'] 	 = styleData.showTimestamp;
	barChartObj['filename'] 			 = $('#fileSelectChart').val();
}


//Function that adds the new created bar chart to the barchart object array
function addNewBarChartObj(chartID, chart, objData, styleData, filename, xAxis, yAxis, aggregation){
	var barChartObj 		 					 = {};
	barChartObj['id'] 		 				 = chartID;
	barChartObj[chartID] 					 = chart;					//create an object property with the element chart id ex:{barChartVisualization1:chart}
	barChartObj['chartData'] 			 = objData;

	barChartObj['width'] 		 			 = styleData.width;
	barChartObj['height'] 		 		 = styleData.height;
	barChartObj['thickness'] 		 	 = styleData.thickness;
	barChartObj['showLegend'] 		 = styleData.showLegend;
	barChartObj['showXAxisLabel']  = styleData.showXAxisLabel;
	barChartObj['showYAxisLabel']  = styleData.showYAxisLabel;
	barChartObj['xAxisLabel']  		 = styleData.xAxisLabel;
	barChartObj['yAxisLabel']  		 = styleData.yAxisLabel;
	barChartObj['color'] 					 = styleData.color;
	barChartObj['showTimestamp'] 	 = styleData.showTimestamp;

	barChartObj['previousYearsDate']  = '';
	barChartObj['previousMonthsDate'] = '';

	barChartObj['filename'] 			 = (filename) 	 ? filename : $('#fileSelectChart').val();
	barChartObj['xAxis'] 					 = (xAxis) 	 		 ? xAxis : $('#xAxisSelect').val();
	barChartObj['yAxis'] 	  			 = (yAxis) 	 		 ? yAxis : $('#yAxisSelect').val();
	barChartObj['aggregationType'] = (aggregation) ? aggregation : $('#aggregationSelect').val();

	barChartsObjArray.push(barChartObj);
}

//Function that adds the new created bar chart to the barchart object array
function getNewDataBarGraph(elementID, chart, param1, param2){
		//if (is to update)
			var timeType = getTimeType();

			var obj = getObjWithKeyInArray(barChartsObjArray, elementID);
			var aggregationType = getValueByKey(obj, 'aggregationType');

			if (param1 == 'brushEnd') {
				timeType = param2;
			}

			//params = ['Dia','Despesa', aggregationType, timeType, startDate, endDate, $('#fileSelectChart').val()];
			params = [obj.xAxis, obj.yAxis, aggregationType, timeType, startDate, endDate, obj.filename, obj.showTimestamp];
			getDataFromServerToRefresh(elementID, chart, 'barChart', '/data', params, 'updateGraph');
}


function barChartElementsInteraction(thisElement){
	var parentID;
	if ($(thisElement).closest('.visualization').length > 0) {
		parentID = $(thisElement).closest('.visualization')[0].id;
	}else {
		parentID = $(thisElement).closest('.preview')[0].id;
	}

	var type 				  = parentID.replace(/Graph.*|Preview/g, '');
	var parent 			  = $('#'+parentID).find('.nv-series-0')[0];
	var barIndex 		  = getElementIndexInArray($(parent).find('rect'), thisElement);
	var xLabelElement = $($('#'+parentID).find('.nv-x')[0]).find('.tick')[barIndex];
	var xLabel				= $($(xLabelElement).find('text')[0]).html();

	var objArray	= eval(type + 'sObjArray');
	var obj 			=	getObjWithKeyInArray(objArray, parentID);

	var monthNames = ["Jan", "Feb", "Mar","Apr", "May", "Jun", "Jul","Aug", "Sep", "Oct","Nov", "Dec"];
	if ($(thisElement).hasClass('daysBar')){
		startDate = new Date(xLabel);
		endDate   = new Date(xLabel);
		$('.visualization').trigger('time', ['chartTimeEvent']);
	  return;
  }

	var timeType, startTime, endTime;
	if($(thisElement).hasClass('yearsBar')){
		$(thisElement).removeClass('yearsBar');
		$(thisElement).addClass('monthsBar');
		timeType  = 'months';
		startTime = new Date(xLabel, 0, 1);
		endTime   = new Date(parseInt(xLabel)+1, 0, 0);
	}else{
		$(thisElement).removeClass('monthsBar');
		$(thisElement).addClass('daysBar');
		timeType  = 'days';
		var month = xLabel.split(' ')[0];
		var year  = xLabel.split(' ')[1];
		startTime = new Date(year, getIndexMonth(month, monthNames) - 1, 1);
		endTime   = new Date(year, getIndexMonth(month, monthNames), 0);
	}

	clickedElementIndex = barIndex;
	getDataFromServerToRefresh(parentID, obj[parentID], type, '/data', [obj.xAxis, obj.yAxis, obj.aggregationType, timeType, startTime, endTime, obj.filename, obj.showTimestamp], 'updateSpecificElementsGraph');
}

//Properties = [width, height, showLegend, showXAxisLabel, showYAxisLabel, color, xAxis, yAxis, thickness]
function barChartLoad(objData, elementID, properties, filename){
	createBarChartPreview();
	barChartGraphNumber = Math.max(parseInt(elementID.match(/\d+/)[0]) + 1, barChartGraphNumber + 1); // update barChartGraphNumber

	//create visualization
	createVisualizationGraphElements(elementID, barChartGraphNumber, 'barChartGraph visualization', 'visualizationsBody');
	var propertiesBarChart = [properties.width, properties.height, properties.showLegend, properties.showXAxisLabel, properties.showYAxisLabel, properties.color, properties.xAxis, properties.yAxis, properties.thickness, properties.xAxisLabel, properties.yAxisLabel, properties.showTimestamp, filename, properties.aggregation];
	addBarGraph(JSON.parse(objData), elementID, propertiesBarChart, false);

	//place visualization
	if (properties.translate != 'none')
		$('#' + elementID).css('transform', properties.translate);
	if (properties.hasOwnProperty('dataX'))
		$('#' + elementID).attr('data-x', properties.dataX);
	if (properties.hasOwnProperty('dataY'))
		$('#' + elementID).attr('data-y', properties.dataY);
}
