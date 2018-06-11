var pieChartGraphNumber = 0;
var pieChartsObjArray = [];
var pieChartPreview;

function pieChartContainerSetting(data){
	var dataContent = JSON.parse(data);

	if ( $('#pieChartPreview').length == 0) {
		createChartCommonElements('pieChartPreview', 'visualizationHeaderPreview', '');
		addPieGraph(pieDonutChartPreviewData, 'pieChartPreview', 400, 200, true, false);
	}

	createChartVisualizationDetails(dataContent, 'pieChart');
  createChartVisualizationEditDetails('pieChart');
	defaultChartValues();

	validateForm('visualizationForm', getFormValidators());
}

function pieChartUpdateOpts(data){
  chartUpdateOpts(data, pieChartPreview, 'pieChart');
}

function pieChartVisualizationElement(){
	pieChartGraphNumber += 1;
	createVisualizationGraphElements('pieChartGraph'+ pieChartGraphNumber, pieChartGraphNumber, 'pieChartGraph visualization', 'visualizationsBody');
	addPieGraph(pieChartsObjArray[0].chartData, 'pieChartGraph'+ pieChartGraphNumber, parseInt($('#widthChart').val()), parseInt($('#heightChart').val()), false, false);
	hideContainer('visualizationContainer', ANIMATIONTIME, ['16%', '95%'], hideContainerContent, hide);
}



function addPieGraph(objData, elementID, width, height, isPreview, isUpdate){
	//console.log(objData);
	var showLegend 			= true;
	var isDonut					= false;
	var donutRatio			= 0.35;
	var labelType				= "percent";
	var color						= '#44444';

	if (isUpdate && !isPreview) {
		var currentObj  = getObjWithKeyInArray(pieChartsObjArray, elementID);
		showLegend 			= currentObj.legend;
		width  					= currentObj.width;
		height  				= currentObj.height;
		isDonut 				= currentObj.isDonut;
		donutRatio 			= currentObj.donutRatio;
		labelType  			= currentObj.labelType;
		color 					= currentObj.color;
	}else {//is preview or firt time inserting on visualizationsbody
		if (!isPreview)
			showLegend = ($($('.nv-series')[0]).css('opacity') == 1) ? true : false;
		donutRatio = $('#donutRatioChart').val();
		labelType  = $('#labelTypeSelectChart').val();
		color 		 = $('#colorPicker').val();
		if ($('#pieDonutImg')[0])
			isDonut 			= ($('#pieDonutImg')[0].alt == 'donutChart') ? true : false;
	}

	nv.addGraph(function() {
	  var chart = nv.models.pieChart()
				.width(width)
				.height(height)
	      .x(function(d) { return isDate(d.xvalues) ? convertToChartDates(d.xvalues) : convertToChartDates(d.label) + ' </br> ' + d.xvalues; })
	      .y(function(d) { return d.value })
				.showLegend(showLegend)
				.labelThreshold(.05)  //Configure the minimum slice size for labels to show up
				.labelType(labelType) //Configure what type of data to show in the label. Can be "key", "value" or "percent"
				.donut(isDonut)          //Turn on Donut mode. Makes pie chart look tasty!
				.donutRatio(donutRatio)     //Configure how big you want the donut hole size to be.
				.color([color]);

			var svg = d3.select('#' + elementID + ' svg')
				.attr('viewBox', '0 0 ' + width + ' ' + height)
				.datum(objData);

			$('#' + elementID).css('width', width + 'px');
			$('#' + elementID).css('height', height + 'px');

			//nv.utils.windowResize(function() { chart.update() });
			svg.transition().duration(350).call(chart);

			if (isPreview)
				pieChartPreview = chart;

			if (!isUpdate){
				addNewPieChartObj(elementID, chart, objData, false, null);

				$('#' + elementID).on('time',  function (evt){
												var updateButton = $('#'+elementID).find('.updateVisualizationButton')[0];
												var updateVis 	 = ($(updateButton).attr('src').includes('updateBlocked')) ? false : true;
												if (updateAllVisualizations && updateVis)
	                        getNewDataPieGraph(elementID, chart);
	                });
			}else
				updateGraphObjsArray(elementID, chart, showLegend, isDonut, donutRatio,labelType,color );

			d3.selectAll(".nv-slice").attr('class', function(d){
				var currentClassName = $($(this)[0]).attr('class');

				var timeType;
				if(d.data.label == null)
					return currentClassName;
				if ((d.data.label).length == 4) {timeType = 'years';}
				else if ((d.data.label).length == 7) {timeType = 'months';}
				else {timeType = 'days';}
				return currentClassName + " " + timeType + 'Slice';
			}	);

			chart.dispatch.on('renderEnd', function () {
								d3.selectAll(".nv-legend text")[0].forEach(function(d){
				        d3.select(d).html($(d).html().replace(/&lt;\/br&gt;.*/, ''));
					      });
            });

			updateStyleAllVisualizations();	//update text on graphs after the graph update


	  return chart;
	},function(){
				d3.selectAll(".nv-slice").on('click',
						 function(){
							pieChartElementsInteraction(this);
				 });
	});
}

function updateGraphObjsArray(elementID, chart, showLegend, isDonut, donutRatio, labelType, color){
	var currentObj        = getObjWithKeyInArray(pieChartsObjArray, elementID);
	currentObj.legend     = showLegend;
	currentObj.isDonut    = isDonut;
	currentObj.donutRatio = donutRatio;
	currentObj.labelType  = labelType;
	currentObj.color      = color;
	currentObj[elementID] = chart;
}

//Function that adds the new created bar chart to the barchart object array
function addNewPieChartObj(chartID, chart, objData, isLoad, loadData){
	var pieChartObj 		 			= {};
	pieChartObj[chartID] 			= chart;					//create an object property with the element chart id ex:{barChartVisualization1:chart}
	pieChartObj['id'] 	 			= chartID;
	pieChartObj['chartData'] 	= objData;
	if (isLoad) {
		pieChartObj['aggregationType'] = loadData.aggregationType;
		pieChartObj['xAxis'] 					 = loadData.xAxis;
		pieChartObj['yAxis'] 			     = loadData.yAxis;
		pieChartObj['color'] 			     = loadData.color;
		pieChartObj['labelType'] 			 = loadData.labelType;
		pieChartObj['donutRatio']		   = loadData.donutRatio;
		pieChartObj['isDonut'] 				 = loadData.isDonut;
		pieChartObj['legend'] 				 = loadData.legend;
		pieChartObj['filename'] 			 = loadData.filename;
	}else {
		pieChartObj['aggregationType'] = $('#aggregationSelect').val();
		pieChartObj['xAxis'] 			= $('#xAxisSelect').val();
		pieChartObj['yAxis'] 			= $('#yAxisSelect').val();
		pieChartObj['color'] 			= $('#colorPicker').val();
		pieChartObj['labelType'] 	= $('#labelTypeSelectChart').val();
		pieChartObj['donutRatio'] = $('#donutRatioChart').val();
		pieChartObj['isDonut'] 		= ($("#pieDonutImg")[0].alt == 'donutChart') ? true : false;
		pieChartObj['legend'] 		= ($($('.nv-series')[0]).css('opacity') == 1) ? true : false;
		pieChartObj['filename'] 	= $('#fileSelectChart').val();
	}


	if (chartID.includes('Preview')) {
		pieChartObj['width']  = 400;
		pieChartObj['height'] = 200;
	}else{
		if (isLoad) {
			pieChartObj['width']  = loadData.width;
			pieChartObj['height'] = loadData.height;
		}else {
			pieChartObj['width']  = parseInt($('#widthChart').val());
			pieChartObj['height'] = parseInt($('#heightChart').val());
		}
	}

	pieChartsObjArray.push(pieChartObj);
}

//Function that adds the new created bar chart to the barchart object array
function getNewDataPieGraph(elementID, chart){
		var timeType = getTimeType();
		var obj = getObjWithKeyInArray(pieChartsObjArray, elementID);
		var aggregationType = getValueByKey(obj, 'aggregationType');
		params = [obj.xAxis, obj.yAxis, aggregationType, timeType, startDate, endDate, obj.filename];
		getDataFromServerToRefresh(elementID, chart, 'pieChart', '/data', params, 'updateGraph');
}


function pieChartElementsInteraction(thisElement){
	var parentID;
	if ($(thisElement).closest('.visualization').length > 0) {
		parentID = $(thisElement).closest('.visualization')[0].id;
	}else {
		parentID = $(thisElement).closest('.preview')[0].id;
	}

	var obj	=	getObjWithKeyInArray(pieChartsObjArray, parentID);

	//remove last tooltip created
	var length = $('.nvtooltip').length;
	$($('.nvtooltip')[length - 1]).remove();

	var type 				  = parentID.replace(/Graph.*|Preview/g, '');
	var parent 			  = $('#'+parentID).find('.nv-pie')[0];
	var sliceIndex 		= getElementIndexInArray($(parent).find('.nv-slice'), thisElement);
	var xLabel			  = obj.chartData[sliceIndex].label;

	var monthNames = ["Jan", "Feb", "Mar","Apr", "May", "Jun", "Jul","Aug", "Sep", "Oct","Nov", "Dec"];
	if ($(thisElement).hasClass('daysSlice')){
		startDate = convertToDefaultDate(xLabel);
		endDate   = startDate;

		$('.visualization').trigger('time', ['chartTimeEvent']);
	  return;
  }

	var timeType, startTime, endTime;
	if($(thisElement).hasClass('yearsSlice')){
		$(thisElement).removeClass('yearsSlice');
		$(thisElement).addClass('monthsSlice');
		timeType  = 'months';
		startTime = new Date(xLabel, 0, 1);
		endTime   = new Date(parseInt(xLabel)+1, 0, 0);
	}else{
		$(thisElement).removeClass('monthsSlice');
		$(thisElement).addClass('daysSlice');
		timeType  = 'days';
		var month = xLabel.split(':')[1];
		var year  = xLabel.split(':')[0];
		startTime = new Date(year, month-1, 1);
		endTime   = new Date(year, month, 0);
	}

	clickedElementIndex = sliceIndex;
	if (obj.xAxis == 'variableX1' || obj.yAxis == 'variableY1') {
		obj.xAxis = $('#xAxisSelect').val();
		obj.yAxis = $('#yAxisSelect').val();
	}

	getDataFromServerToRefresh(parentID, obj[parentID], type, '/data', [obj.xAxis, obj.yAxis, obj.aggregationType, timeType, startTime, endTime, obj.filename], 'updateSpecificElementsGraph');
}

//load pie chart data
function pieChartLoad(objData, elementID, properties, filename){
	objData = JSON.parse(objData);
	if(getObjWithKeyInArray(pieChartsObjArray, 'pieChartPreview') == null)
		createPieChartPreview(filename);

	pieChartGraphNumber = Math.max(parseInt(elementID.match(/\d+/)[0]) + 1, pieChartGraphNumber + 1); // update barChartGraphNumber

	//create visualization
	createVisualizationGraphElements(elementID, pieChartGraphNumber, 'pieChartGraph visualization', 'visualizationsBody');
	var loadData = {'width':properties.width, 'height':properties.height, 'xAxis':properties.xAxis, 'yAxis':properties.yAxis, 'color':properties.color, 'labelType':properties.labelType, 'donutRatio':properties.donutRatio, 'isDonut':properties.isDonut, 'legend':properties.legend, 'aggregationType':properties.aggregationType, 'filename':filename};
	addNewPieChartObj(elementID, null, objData, true, loadData);
	addPieGraph(objData, elementID, properties.width, properties.height, false, true);

	//place visualization
	if (properties.translate != 'none')
		$('#' + elementID).css('transform', properties.translate);
	if (properties.hasOwnProperty('dataX'))
		$('#' + elementID).attr('data-x', properties.dataX);
	if (properties.hasOwnProperty('dataY'))
		$('#' + elementID).attr('data-y', properties.dataY);


		var obj = getObjWithKeyInArray(pieChartsObjArray, elementID);
		$('#' + elementID).on('time',  function (evt){
										var updateButton = $('#'+elementID).find('.updateVisualizationButton')[0];
										var updateVis 	 = ($(updateButton).attr('src').includes('updateBlocked')) ? false : true;
										if (updateAllVisualizations && updateVis)
											getNewDataPieGraph(elementID, obj[elementID]);
							});
}


function createPieChartPreview(filename){
	if ($('#pieChartPreview').length == 0) {
		var pieChartObj = {};

		pieChartObj['pieChartPreview'] = null;
		pieChartObj['chartData'] 			 = null;
		pieChartObj['id'] 					   = 'pieChartPreview';
		pieChartObj['aggregationType'] = 'COUNT';
		pieChartObj['xAxis'] 					 = '';
		pieChartObj['yAxis'] 			     = '';
		pieChartObj['color'] 			     = "#4f93c4";
		pieChartObj['labelType'] 			 = 'value';
		pieChartObj['donutRatio']		   = 0.35;
		pieChartObj['isDonut'] 				 = false;
		pieChartObj['legend'] 				 = true;
		pieChartObj['filename'] 			 = filename;
		pieChartObj['width']  				 = 400;
		pieChartObj['height'] 				 = 200;

		pieChartsObjArray.push(pieChartObj);
	}
}
