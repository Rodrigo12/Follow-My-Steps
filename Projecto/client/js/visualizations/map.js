var mapChartGraphNumber = 0;
var currentTileLayerMap;
var mapObjArray = [];
var markerObj = {iconURL:'', location:[]};

//Function that allow to specify several features to personalize the map
function mapContainerSetting(data){
	var dataContent = JSON.parse(data);
	createMapVisualizationDetails(dataContent);
  createMapVisualizationEditDetails();
	defaultMapValues();
}

function createMapLayersInput(isPreview, currentMapID, option, photosPosition, photoChecked, locationPosition, locationChecked, routesPosition, routesChecked){
	var isPhotoImage = createHtml("img", "", 'id="imageIsPhoto'+option+'" src="/static/imgs/markers/photo.png" style="height:20px;"');
	var isPhotoInput = createHtml("input", "", 'type="checkbox" class="checkboxInput" id="checkboxIsPhoto'+option+'" value="" alt="photo" '+photoChecked);
	var photoContent = (isPreview) ? isPhotoInput + isPhotoImage + 'Photos' : isPhotoInput + isPhotoImage;
	var isPhotoLabel = createHtml("label", photoContent, 'class="checkbox-inline" style="position:absolute; top:'+photosPosition[0]+'%; left:'+photosPosition[1]+'%;z-index:1000;"');

	var isLocationImage = createHtml("img", "", 'id="imageIsLocation'+option+'" src="/static/imgs/markers/location.png" style="height:20px;"');
	var isLocationInput = createHtml("input", "", 'type="checkbox" class="checkboxInput" id="checkboxIsLocation'+option+'" value="" alt="location" '+locationChecked);
	var locationContent = (isPreview) ? isLocationInput + isLocationImage + 'Locations' : isLocationInput + isLocationImage;
	var isLocationLabel = createHtml("label", locationContent, 'class="checkbox-inline" style="position:absolute; top:'+locationPosition[0]+'%; left:'+locationPosition[1]+'%;z-index:1000;"');

	var isRoutesImage = createHtml("img", "", 'id="imageIsLocation'+option+'" src="/static/imgs/markers/routes.png" style="height:20px;"');
	var isRoutesInput = createHtml("input", "", 'type="checkbox" class="checkboxInput" id="checkboxIsRoutes'+option+'" value="" alt="route" '+ routesChecked);
	var routesContent = (isPreview) ? isRoutesInput + isRoutesImage + 'Routes' : isRoutesInput + isRoutesImage;
	var isRoutesLabel = createHtml("label", routesContent, 'class="checkbox-inline" style="position:absolute; top:'+routesPosition[0]+'%; left:'+routesPosition[1]+'%;z-index:1000;"');

	var isMyLocationImage = '', isMyLocationInput = '', isMyLocationLabel = '';
	if(!isPreview){
		var myLocationIcon = getMyLocationMarkerType();
		isMyLocationImage  = createHtml("img", "", 'id="imageIsMyLocation'+option+'" src="/static/imgs/markers/'+myLocationIcon+'.png" style="height:20px;"');
	  isMyLocationInput  = createHtml("input", "", 'type="checkbox" class="checkboxInput" id="checkboxIsMyLocation'+option+'" value="" alt="myLocation" checked');
		isMyLocationLabel  = createHtml("label", isMyLocationInput + isMyLocationImage, 'class="checkbox-inline" style="position:absolute; top:88%; left:94%;z-index:1000; overflow:visible;"');
	}

	return isPhotoLabel + isLocationLabel + isMyLocationLabel + isRoutesLabel;
}

function createMapVisualizationDetails(dataContent){
	var options = "";
	for (var currentText, currentOption, currentKey, currentDiv, index = 0; index < getObjectLength(mapObjectType); index++) {
		currentKey  = getKeyByIndex(mapObjectType, index);
		currentText	= createHtml('h7', getSubString(currentKey, 15), '');
		currentDiv  = createHtml('div', currentText, 'id="mapContainer'+index+'" class="mapOption mapContainer" style="position:relative;display:inline-block;width:105px;height:75px;margin:10px;text-align:center;"');
		options			+= currentDiv;
	}
	var mapOptions = createHtml('div', options, 'id="mapVisualizationsContainer" style="position:absolute;top:4%;height:240px;overflow:scroll;"');
	$("#visualizationDetails").css('height', '380px');
	$("#visualizationDetails").css('top', '185px');

	var currentMapID = "#visualizationMap"+mapChartGraphNumber;
	var inputsTop		 = 73.5;
	var inputs = createMapLayersInput(true, currentMapID, '', [inputsTop, 7.5], 'checked',[inputsTop, 39], 'checked', [inputsTop, 72], 'checked');
	$("#visualizationDetails").html(mapOptions + inputs);

	for (var currentOption, currentKey, currentDiv, index = 0; index < getObjectLength(mapObjectType); index++) {
		currentKey    = getKeyByIndex(mapObjectType, index);
		currentOption = getValueByKey(mapObjectType, currentKey);
		createMapElement("#mapContainer"+index, currentKey, [105, 75],[51.505, -0.09], 1, currentOption, true, false);
	}

	selectMapPreview("#visualizationMapOpenStreetMap_Mapnik");
	createMapElement("#visualizationHeaderPreview", 'Preview', [490, 100],[51.505, -0.09], 1, currentTileLayerMap, true,false);
	$('#visualizationHeaderPreview').css('zIndex', '0');
}

function createMapVisualizationEditDetails(){
	var optionsSizeInput   = ['px', '%'];
	var widthSpecialInput  = createSpecialInputText(['15%', '3%'], 'Width:______________', 'widthMapSelect', ['13%', '22%'], 'widthMap', ['7%', '5%'], 100, optionsSizeInput );
	var heightSpecialInput = createSpecialInputText(['35%', '3%'], 'Height:______________', 'heightMapSelect', ['33%', '23%'], 'heightMap', ['27%', '6.5%'], 100, optionsSizeInput );

	var optionsBorderInput   = ['none', 'solid', 'dotted', 'dashed', 'double', 'groove', 'ridge', 'inset', 'outset', 'hidden'];
	var borderRadiusSpecialInput  = createSpecialInputText(['15%', '68%'], 'Border Radius:_______', 'borderRadiusMapSelect', ['13%', '91%'], 'borderRadiusMap', ['7%', '76%'], 100, optionsSizeInput );
	var borderSpecialInput = createSpecialInputText(['35%', '68%'], 'Border:______________', 'borderMapSelect', ['33%', '88%'], 'borderMap', ['27%', '71.5%'], 100, optionsBorderInput );

	var addLabelSpan = createHtml( 'span', '', 'class="glyphicon glyphicon-plus"' );
	var addLabelText = createHtml( 'h7', '&nbsp;Add Label', 'class=""' );
	var addLabelDiv  = createHtml( 'div', addLabelSpan+addLabelText, 'id="addLabelDiv" style="cursor:pointer;position:absolute;top:83%;left:42%;z-index:6;"' );

	var colorLabel = createSpecialColorText( 'specialColorTextID0', 'mapColorInputLabel0', 'mapTextInputLabel0', [132.75/2 + 'px', '38%'] );
	var colorLabelsDiv = createHtml('div', colorLabel + addLabelDiv, 'id="colorLabelsDiv" style=position:absolute;top:55%;left:0%;width:100%;height:45%;');
	$('#visualizationEditDetails').html( colorLabelsDiv + borderRadiusSpecialInput+borderSpecialInput+widthSpecialInput + heightSpecialInput);
	$("#visualizationEditDetails").css('height', '300px');
	$("#visualizationEditDetails").css('top', '185px');
}

function addNewLabel(){
	var length = $('.colorLabelDiv').length;
	if (length>=16)
		return;
	if (length>=15) {
		$('#addLabelDiv').css('opacity', '0.3');
	}

	var colorLabel = createSpecialColorText( 'specialColorText'+length, 'mapColorInputLabel'+length, 'mapTextInputLabel'+length, ['70%', '45%'] );
	$('#colorLabelsDiv').append( colorLabel );

	$('.colorLabelDiv').each(function(index){//132.75 -> div height , 510 -> div width
		var divID = $(this)[0].id;
		var top, left = ((index)%4)*130;

		if (length < 4)
			top  = (132.75/2);
		else if(length < 8)
			top = (132.75/3) * Math.floor(index/4) ;
		else if(length < 12)
			top = (132.75/4) * Math.floor(index/4) ;
		else if(length < 16)
			top = (132.75/5) * Math.floor(index/4) ;

		moveTo(divID, ANIMATIONTIME, null, [top + 'px', left + 'px']);
	});
}

function defaultMapValues(){
	if (!$('#widthMap').val())
		$('#widthMap').val(1000);

	if (!$('#heightMap').val())
		$('#heightMap').val(500);

	if (!$('#borderRadiusMap').val())
		$('#borderRadiusMap').val(10);

	if (!$('#borderMap').val())
		$('#borderMap').val(0);
}

function updateMapProperties(divID){
	$('#'+divID).css('borderRadius', $('#borderRadiusMap').val() + $('#borderRadiusMapSelect').val());
	$('#'+divID).css('border', $('#borderMap').val() + 'px ' + $('#borderMapSelect').val());
}

//Function that adds the map to a certain div (ex: to the body or to the visualizationDetails)
function mapVisualizationElement(data){
	var optionValue = currentTileLayerMap._url;				//check the tile selected

	var width, height, isLoadedData = false;
	if ($("#widthMap").val() == '' || $("#widthMap").val() == null)
		isLoadedData = true;

	width  = (!isLoadedData) ? $("#widthMap").val()  : 1000;
	height = (!isLoadedData) ? $("#heightMap").val() : 500;

 	createMapElement('#visualizationsBody',mapChartGraphNumber, [width, height],[51.505, -0.09], 5, optionValue, false, isLoadedData);
	updateMapProperties('visualizationMap' + mapChartGraphNumber);

	var currentMapObj = getObjWithKeyInArray(mapObjArray, 'visualizationMap' + mapChartGraphNumber);
	var currentMap    = currentMapObj['visualizationMap' + mapChartGraphNumber];
	var layersInfo = mapGetLayers('visualizationMap' + mapChartGraphNumber, data);
	if(layersInfo[3] != null) //layersInfo[3] = positionCenter
		currentMap.setView(layersInfo[3], 10, {animate: true, easeLinearity: .5, duration: 2.5});

	currentMap.on('zoomend', function (e) { mapZoomHandler(e, currentMap, currentMapObj, layersInfo[4]);	}); //layersInfo[4] = photoCirclesLayer
	currentMap.on('popupopen', function (e) { mapPopupHandler(e, currentMapObj.id);});
	currentMap.on('popupclose', function (e) { removeCalendar(e); });

	hideContainer('visualizationContainer', ANIMATIONTIME, ['16%', '95%'], hideContainerContent, hide);
	mapChartGraphNumber++;
}

function addMyLocationToMap(position){
	var currentMapObj = getObjWithKeyInArray(mapObjArray, 'visualizationMap' + (mapChartGraphNumber-1));
	var currentMap    = currentMapObj['visualizationMap' + (mapChartGraphNumber-1)];

	try{ currentMap.removeLayer(currentMapObj.currentMyLocationsLayerMap); }catch(err){} //delete previus markers
	var myLocationMarkerLayer = [];	//add my current location markers to map
	currentMapObj.currentMyLocation	= [position.coords.latitude, position.coords.longitude];
	myLocationMarkerLayer = addMarkers(currentMapObj.currentMyLocation, getMyLocationMarkerType());
	currentMapObj.currentMyLocationsLayerMap = myLocationMarkerLayer;
	currentMap.addLayer(myLocationMarkerLayer);

	getLocationStreet([position.coords], null);
}


function getLocationStreet(positions, callback){
	var addresses = [];
    for(var geocoder, latLng, index = 0; index < positions.length; index++) {
        currentPosition = positions[index];
        geocoder = new google.maps.Geocoder();
				latLng 	 = new google.maps.LatLng(currentPosition.latitude, currentPosition.longitude);
        if (geocoder) {
            geocoder.geocode({'latLng':latLng}, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
									if (callback == null)
										currentMyLocation = results[0].formatted_address;
                  addresses.push(results[0].formatted_address);
                  if(addresses.length == positions.length) {
                    if( typeof callback == 'function' ) {
												var data = {};
												data['startAddress'] =  addresses[0];
												data['endAddress'] 	 =  addresses[1];
                        callback(data);
                    }
                  }
                }
                else {
                    throw('No results found: ' + status);
                }
            });
        }
     }
  }

function mapGetLayers(mapID, data){
	var dataContent 	= JSON.parse(data);

	var currentMapObj = getObjWithKeyInArray(mapObjArray, mapID);
	var currentMap    = currentMapObj[mapID];

	try{
		currentMap.removeLayer(currentMapObj.currentPhotosLayerMap);
		currentMap.removeLayer(currentMapObj.currentLocationsLayerMap);
		currentMap.removeLayer(currentMapObj.currentRoutesLayerMap);
	}catch(err){}

	var layersInfo    = createLayersToMap(mapID, dataContent);

	currentMap.addLayer(layersInfo[0]); //layersInfo[0] = photosLayer
	currentMap.addLayer(layersInfo[1]); //layersInfo[1] = locationLayer
	currentMap.addLayer(layersInfo[2]); //layersInfo[2] = routesLayer

	return layersInfo;
}

function createLayersToMap(mapID, dataContent){
	var markerToInsert = [], photoCirclesLayer = [], photoMarkersLayer = [], locationMarkerArray = [], routesMarkerArray = [], positionCenter = null;
	var currentMapObj  = getObjWithKeyInArray(mapObjArray, mapID);

	photoMarkersLayer = addMarkers(getImagesArray(dataContent), "photo");
	markerToInsert 		= nearbyElementAlgorithm(photoMarkersLayer.getLayers(), []);
	photoCirclesLayer = addCircles(markerToInsert.getLayers());

	locationMarkerArray = addMarkers(getLocationArray(dataContent), "location");
	routesMarkerArray = addMarkers(getRoutesArray(dataContent), "routes");

	positionCenter = createLayerGroup(markerToInsert.getLayers(), locationMarkerArray.getLayers(), routesMarkerArray.getLayers())

	if (positionCenter.getLayers()[0])	//if there are layers in the map
		positionCenter = positionCenter.getLayers()[0].getLatLng();	//get the first to focus the map
	else
		positionCenter = {lat:38.726111111111116, lng:-9.16855};	//otherwise get a random one (not random at all)

	currentMapObj.currentPhotosLayerMap 	 = markerToInsert;
	currentMapObj.currentLocationsLayerMap = locationMarkerArray;
	currentMapObj.currentRoutesLayerMap    = routesMarkerArray;

	showMyCurrentLocation();

	var currentMapObj = getObjWithKeyInArray(mapObjArray, mapID);
	var currentMap    = currentMapObj[mapID];

	if (!$('#checkboxIsPhoto').is(":checked")){currentMap.removeLayer(currentMapObj.currentPhotosLayerMap);}	//add images markers to map
	if (!$('#checkboxIsLocation').is(":checked")){currentMap.removeLayer(currentMapObj.currentLocationsLayerMap);}	//add location markers to map
	if (!$('#checkboxIsRoutes').is(":checked")){currentMap.removeLayer(currentMapObj.currentRoutesLayerMap);}	//add location markers to map

	return [markerToInsert, locationMarkerArray, routesMarkerArray, positionCenter, photoCirclesLayer];
}


//Recursive nearby element search
//This function is used to remove near markers (avoid having lots of photo markers in the map)
function nearbyElementAlgorithm(elementsArray, elementsToInsert){
	var nearElements = [], farElements = [], maxDistance = 0.001;
	//console.log(elementsArray);
//console.log(elementsToInsert);
	if (elementsArray.length == 0)									//if there aren't more elements to check
		return createLayerGroup(elementsToInsert);
	else
		nearElements.push(elementsArray[0]);					//otherwise insert the this element in nearElements Array

	for (var currentDistance, index = 1; index < elementsArray.length; index++) {			//Check other elements (see if they are near or far of the current marker)
		currentDistance = distanceBetweenPoints(elementsArray[index].getLatLng(), elementsArray[0].getLatLng());
		if(currentDistance < maxDistance){
			nearElements.push(elementsArray[index]);	//if it is near insert on nearElements array
		}		else{
			farElements.push(elementsArray[index]);		//otherwise in farElements array
		}
	}
	if(nearElements.length != 0)									//in the end of the loop if there are near elements put them together in the map
		elementsToInsert.push(arrayToElement(nearElements));
	nearbyElementAlgorithm(farElements, elementsToInsert);
	return createLayerGroup(elementsToInsert);
}


function arrayToElement(elementsArray){
	var finalElement = elementsArray[0], divPhotos = '';
	//console.log(elementsArray);
	// 	divPhotos = '<div class="popupImageNumberDiv"><h5 class="popupImageNumberText">'+elementsArray.length+'</h5></div>';

	var loadingDiv = loadingPhotosMessage(elementsArray.length);
	if (elementsArray.length > 1)
		finalElement._popup.setContent(loadingDiv);

	return finalElement;
}

function loadingPhotosMessage(photosLength){
	var loadingPhotosGif  = createHtml('img', "", 'src="./imgs/loading.gif"');
	var loadingPhotosDiv	= createHtml('div', loadingPhotosGif, 'class="loadingSmall"')
	var loadingPhotosText = createHtml('h5',"Loading " + photosLength + " photos..." + loadingPhotosDiv,'style="text-align:center"');
	return createHtml('div', loadingPhotosText, 'class="loadingPhotosPopup" style="width:160px;"');
}

function distanceBetweenPoints(point1, point2){
	var deltaLat = point1.lat - point2.lat;
	var deltaLng = point1.lng - point2.lng;

	return Math.sqrt( deltaLat*deltaLat + deltaLng*deltaLng );
}

function visualizationMapLoad(objData, elementID, properties, filename){
	// console.log(objData);
	// console.log(elementID);
	// console.log(properties);
	// console.log(filename);

	currentTileLayerMap = createTileLayer(properties.tileLayer, 19);
	params = ["photo", "location", "route"];
	getDataFromServer('map', '/data', params, 'VisualizationElement'); //get data from server
}
