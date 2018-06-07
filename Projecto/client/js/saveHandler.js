///////////////////////GET FROM THE SERVER///////////////////////
//load, into the dashboard, all information saved in the server
function definitionLoadData(data){
  if(data == 'No Records') return;
  var contentData = JSON.parse(data);

  for (var visType, index = 0; index < contentData.length; index++) { //run through all the data
    if(contentData[index].type == null)
      continue;
      
    if (contentData[index].type == 'visualization')
      loadVisualizationsFromServer(contentData, visType, index);
    else
      window[contentData[index].type + 'Load'].apply(null, [JSON.parse(contentData[index].properties)]);
  }

}

//load visualizations data from the server
function loadVisualizationsFromServer(contentData, visType, index){
  visType = (contentData[index].visualizationid).replace(/Graph\d+/g, '');
  visType = visType.replace(/\d+/g, '');
  var visProperties = JSON.parse(contentData[index].properties);
  window[visType + 'Load'].apply(null, [contentData[index].data, contentData[index].visualizationid, visProperties, contentData[index].filename]);
}


///////////////////////SEND TO THE SERVER///////////////////////
//get all visualizations on the interface to send them to the server
function getAllVisualizationsObjs(){
  var visualizationsObjArray = [areaChartsObjArray, barChartsObjArray, calendarHeatmapObjArray, imagesObjArray, lineChartsObjArray, mapObjArray, pieChartsObjArray, timelineObjArray, textVisualizationObjArray];
  var objArray = [];
  for (var currentVisualizationArray, visIndex = 0; visIndex < visualizationsObjArray.length; visIndex++) {
    currentVisualizationArray = visualizationsObjArray[visIndex];
    for (var currentVisObj,currentTranslate,currentDataX,currentDataY, index = 0; index < currentVisualizationArray.length; index++) {
      if (!(currentVisualizationArray[index].id).includes('Preview')) {
        var currentObj = {}, currentProperties = {};
        currentVisObj = currentVisualizationArray[index];
        currentTranslate = $('#' + currentVisObj.id).css('transform');
        currentDataX     = $('#' + currentVisObj.id).attr('data-x');
        currentDataY     = $('#' + currentVisObj.id).attr('data-y');

        currentObj['id']        = currentVisualizationArray[index].id;
        currentObj['type']      = 'visualization';
        currentObj['filename']  = currentVisObj.filename;
        currentObj['chartData'] = JSON.stringify(currentVisObj.chartData);

        currentProperties['translate']      = currentTranslate;
        currentProperties['dataX']          = currentDataX;
        currentProperties['dataY']          = currentDataY;
        currentProperties['aggregation']    = currentVisObj.aggregationType;
        currentProperties['xAxis']          = currentVisObj.xAxis;
        currentProperties['yAxis']          = currentVisObj.yAxis;
        currentProperties['width']          = currentVisObj.width;
        currentProperties['height']         = currentVisObj.height;
        currentProperties['color']          = currentVisObj.color;
        currentProperties['showLegend']     = currentVisObj.showLegend;
        currentProperties['showXAxisLabel'] = currentVisObj.showXAxisLabel;
        currentProperties['showYAxisLabel'] = currentVisObj.showYAxisLabel;
        currentProperties['xAxisLabel']     = currentVisObj.xAxisLabel;
        currentProperties['yAxisLabel']     = currentVisObj.yAxisLabel;
        currentProperties['xAxis']          = currentVisObj.xAxis;
        currentProperties['yAxis']          = currentVisObj.yAxis;
        currentProperties['thickness']      = currentVisObj.thickness;
        currentProperties['labels']         = currentVisObj.labels;
        currentProperties['descriptions']   = currentVisObj.descriptions;
        currentProperties['showTimestamp']  = currentVisObj.showTimestamp;

        if (currentVisObj.id.includes('pieChart')) {
          currentProperties['aggregationType'] = currentVisObj.aggregationType;
          currentProperties['labelType'] 			 = currentVisObj.labelType;
          currentProperties['donutRatio']		   = currentVisObj.donutRatio;
          currentProperties['isDonut'] 				 = currentVisObj.isDonut;
          currentProperties['legend'] 				 = currentVisObj.legend;
        }else if (currentVisObj.id.includes('textVisualization')) {
          currentObj['chartData']             = currentVisObj.textContent;
          currentProperties['fontSize'] 			= currentVisObj.fontSize;
          currentProperties['fontFamily']		  = currentVisObj.fontFamily;
          currentProperties['fontTransform']  = currentVisObj.fontTransform;
        	currentProperties['textDecoration'] = currentVisObj.textDecoration;
          currentProperties['fontShadow'] 		= currentVisObj.fontShadow;
        	currentProperties['textOverflow'] 	= currentVisObj.textOverflow;
        	currentProperties['textAlign'] 		  = currentVisObj.textAlign;
        	currentProperties['letterSpacing']  = currentVisObj.letterSpacing;
        	currentProperties['alt'] 					  = currentVisObj.alt;
        }else if (currentVisObj.id.includes('timeline')) {
          currentProperties['handler1Value'] 	 	= currentVisObj.handler1Value;
          currentProperties['handler2Value'] 	  = currentVisObj.handler2Value;
          currentProperties['barColor'] 	 			= currentVisObj.barColor;
          currentProperties['fontColor'] 			  = currentVisObj.fontColor;
          currentProperties['handlerColor'] 		= currentVisObj.handlerColor;
          currentProperties['handlerFontColor'] = currentVisObj.handlerFontColor;
          currentProperties['showMonths']  			= currentVisObj.showMonths;
        }else if(currentVisObj.id.includes('calendar')){
          currentObj['chartData']                = JSON.stringify(currentVisObj.objData);
          currentProperties['maxvalue']          = currentVisObj.maxvalue;
          currentProperties['monthHighestValue'] = currentVisObj.monthHighestValue;
          currentProperties['updateData']        = currentVisObj.updateData;
          currentProperties['updateMonthData']   = currentVisObj.updateMonthData;
          currentProperties['date']              = currentVisObj.date;
          currentProperties['legendColor']       = currentVisObj.legendColor;
          currentProperties['highlightToday']    = currentVisObj.highlightToday;
          currentProperties['legend']            = currentVisObj.legend;
          currentProperties['legendPosition']    = currentVisObj.legendPosition;
          currentProperties['label']             = currentVisObj.label;
        }else if(currentVisObj.id.includes('image')){
          currentObj['chartData']      = JSON.stringify(currentVisObj.paths);
          currentProperties['content'] = JSON.stringify(currentVisObj.content);
        }else if(currentVisObj.id.includes('visualizationMap')){
          currentProperties['colorLabels']         = currentVisObj.colorLabels;
          currentProperties['mapZoomHandlerLevel'] = currentVisObj.mapZoomHandlerLevel;
          currentProperties['tileLayer']           = currentVisObj.tileLayer._url;
        }

        objArray.push([currentObj, currentProperties]);
      }
    }
  }
  sendDataToServer(objArray, '/definitions', null);
}
