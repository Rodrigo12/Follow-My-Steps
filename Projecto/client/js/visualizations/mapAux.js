var currentMyLocation	  = '';

///////////////////////////ADD ELEMENTS TO MAP///////////////////////////
//Return a Layer group with the markers to insert in the map
function addMarkers(markersObjsArray, markerType){
	var markersArray = [];
	//console.log(markersObjsArray);

	var iconClass = createIconClassLeaflet('/static/imgs/markers/markerShadow.png');
	var iconClassInstance = new iconClass({iconUrl: '/static/imgs/markers/'+markerType+'.png'});

	for (var routePoints = [], routeLastName = '', routeLastTimestamp = '',currentMarker, currentLatLng, index = 0; index < markersObjsArray.length; index++) {
    if (markerType == 'photo')
      currentMarker = photoInfoMarker(markersObjsArray[index], iconClassInstance);
    else if (markerType == 'location')
      currentMarker = locationInfoMarker(markersObjsArray[index], iconClassInstance);
		else if (markerType == 'youAreHerePhoneMarker' || markerType == 'youAreHerePCMarker')
			currentMarker = myLocationInfoMarker(markersObjsArray, iconClassInstance);
		else if (markerType == 'routes'){
			if (index != markersObjsArray.length - 1 && (routeLastName == markersObjsArray[index][0] || routeLastName.length == 0)) {				//if it is the same track or route
				routePoints.push([parseFloat(markersObjsArray[index][2]), parseFloat(markersObjsArray[index][3])]);	//add new point to the vector and continue loop
				routeLastName 		 = markersObjsArray[index][0];
				routeLastTimestamp = markersObjsArray[index][1];
				continue;
			}else{
				currentMarker = routeLine(routeLastTimestamp, routeLastName, routePoints);
				routeLastName = markersObjsArray[index][0];
				routePoints = [];
				routePoints.push([parseFloat(markersObjsArray[index][2]), parseFloat(markersObjsArray[index][3])]);	//add new point to the vector and continue loop
			}
		}

		markersArray.push(currentMarker);
	//	console.log(markersArray);

	}
	return createLayerGroup(markersArray);
}


//parse photos marker information
function photoInfoMarker(markersObj, iconClassInstance){
  var latLng = [markersObj[1],markersObj[2]];
  var marker = createMarkerFromIconClass(latLng, iconClassInstance);
	marker['location'] = markersObj[0];//ex: Lisboa
	var loadingDiv = loadingPhotosMessage('');
  bindPopup(marker, "div", loadingDiv, "");
  return marker;
}

//parse location marker information
function locationInfoMarker(markersObj, iconClassInstance){
  var latLng 	= [parseFloat(markersObj[1]), parseFloat(markersObj[2])];
  var marker = createMarkerFromIconClass(latLng, iconClassInstance);
  bindPopup(marker, "h3", markersObj[0], "class='popupLocation' style='max-width:300px;max-height:200px;'");
  return marker;
}

//parse my location marker information
function myLocationInfoMarker(markersObj, iconClassInstance){
	var latLng 	= [parseFloat(markersObj[0]), parseFloat(markersObj[1])];
	var marker = createMarkerFromIconClass(latLng, iconClassInstance);
	var title = createHtml('h1', "You are here!", 'style="text-align:center;"');
	var image = createHtml('img', '', 'src="./imgs/markers/youAreHerePCMarker.png" style="position:absolute; opacity:0.1; z-index:0;height:100px;top:62%; right:-25px;overflow: hidden; "')
	bindPopup(marker, "div", title + image, " class='popupMyLocation' style='width:280px;height:230px;margin-left:50%;transform: translate(-50%, 0%);'");
  return marker;
}

function routeLine(routeLastTimestamp, routeName, routePoints){
	var line  = createPolyLine(routePoints);
	var title = createHtml('h3', routeName, 'style="text-align:center;"');
	var image = createHtml('img', '', 'src="./imgs/markers/routes.png" style="position:absolute; opacity:0.1; z-index:0;height:100px;top:61%; right:-2%;overflow: hidden; "')
	bindPopup(line, "div", title + image , "class='popupRoute' style='width:300px;height:220px;' firstPoint='"+routePoints[0]+"' lastPoint='"+routePoints[routePoints.length-1]+"' timestamp='"+routeLastTimestamp+"' ");
	return line;
}

//parse cicles information
function addCircles(circlesElements){	//Return a Layer group with the circles to insert in the map
	var circlesArray = [];
	for (var currentCircle, index = 0; index < circlesElements.length; index++) {
		currentCircle = createCircle(circlesElements[index].getLatLng(), 'red', '#f53', 0.2, 100);
		bindPopup(currentCircle, 'h5', "The marker includes photos from this area", "class='popupCircle'");
		circlesArray.push(currentCircle);
	}
	return createLayerGroup(circlesArray);
}

//Function that sort info sent from the server
//The first array as the data of the photos, the second has information about the photos metadata, life data and gps
//EX: [["Ficheiro_000.jpeg","data:image/jpeg;base64,<data>"],[{"id":5,"source":"/Users/rodrigofranca/Documents/Tese/Dissertação/Projecto/samples/imgs/Ficheiro_000.jpeg","filename":"Ficheiro_000.jpeg","timestamp":"2017:04:23 12:31:13, photosnumber:"39"","latitude":"N|38,43,35.94","longitude":"W|9,10,5.98","description":"-"},{"id":17,"source":"/Users/rodrigofranca/Documents/Tese/Dissertação/Projecto/samples/johnDoe.life","filename":"johnDoe.life","day":null,"utc":null,"initialhour":null,"finalhour":null,"hour":null,"minutes":null,"activity":null,"type":"Canonical Locations","parent":null,"tags":null,"descriptions":"work , 32.4343534,-9.54353"}]]
function getImagesArray(dataContent){
	var propertiesObj = mapResponseWithProperty(dataContent);
	var imagesArray 		= [];

	for (var index = 0; index < propertiesObj.photosLength; index++) {		//Loop through images information only (event if it has more)
		imagesArray.push([dataContent[index].location, dataContent[index].latavg, dataContent[index].lngavg ]);
	}

	return imagesArray;
}

//Function that gets location information from life files
function getLocationArray(dataContent){
	var propertiesObj = mapResponseWithProperty(dataContent);
	var locationsArray 	= [];

	//console.log(dataContent);

	var locationsSize = propertiesObj.locationsStartIndex + propertiesObj.locationsLength;
	for (var currentLat, currentLng, index = propertiesObj.locationsStartIndex; index < locationsSize; index++) {		//Start where the images end [here we only have photos or life files information]
		//console.log(index);
		//console.log(dataContent[index]);

		currentDate = dataContent[index].descriptions.split(',')[0].trim();
		currentLat  = dataContent[index].descriptions.split(',')[1].trim();
		currentLng 	= dataContent[index].descriptions.split(',')[2].trim();
		locationsArray.push([currentDate, currentLat, currentLng]);
	}


	return locationsArray;
}

//Function that gets location information from life files
function getRoutesArray(dataContent){
	var propertiesObj = mapResponseWithProperty(dataContent);
	var routesArray 	= [];
	var routesSize = propertiesObj.routesStartIndex + propertiesObj.routesLength;

	for (var currentName, currentDate, currentLat, currentLng, index = propertiesObj.routesStartIndex; index < routesSize; index++) {		//Start where the images end [here we only have photos or life files information]
		currentName = dataContent[index].trackname;
		currentDate	= dataContent[index].timestamp;
		currentLat  = dataContent[index].latitude;
		currentLng  = dataContent[index].longitude;
		routesArray.push([currentName, currentDate, currentLat, currentLng]);
	}

	return routesArray;
}

//function that receives the server response data and checks if it has photos, locations and routes
function mapResponseWithProperty(dataContent){
	var mapWithPropertiesObj = {photos:false,    photosStartIndex:0,    photosLength:0,
															locations:false, locationsStartIndex:0, locationsLength:0,
															routes:false,    routesStartIndex:0,    routesLength:0};

     for (var index = 0, firstLocation = false, firstPhotos = false, firstRoute = false; index < dataContent.length; index++) {
     	if (dataContent[index].hasOwnProperty('photos')) {
				if (!firstPhotos) {
					firstPhotos 													= true;
					mapWithPropertiesObj.photos	 					= true;
					mapWithPropertiesObj.photosLength 		= parseInt(dataContent[index].photosnumber);
					mapWithPropertiesObj.photosStartIndex = index;
				}
     	}else if(dataContent[index].hasOwnProperty('locationnumber')){
				if (!firstLocation) {
					firstLocation 												= true;
					mapWithPropertiesObj.locations	 				 = true;
					mapWithPropertiesObj.locationsStartIndex = parseInt(dataContent[index].locationnumber);
					mapWithPropertiesObj.locationsStartIndex = index;
				}
     	}else if(dataContent[index].hasOwnProperty('routesnumber')){
				if (!firstRoute) {
					firstRoute 													  = true;
					mapWithPropertiesObj.routes	 					= true;
					mapWithPropertiesObj.routesLength 		= parseInt(dataContent[index].routesnumber);
					mapWithPropertiesObj.routesStartIndex = index;
				}
     	}
     }


	// //check if has photos
	// if (objectHasKey(dataContent[0], 'photosnumber')){
	// 	mapWithPropertiesObj.photos	 			= true;
	// 	mapWithPropertiesObj.photosLength = parseInt(dataContent[0].photosnumber);
	// }
	//
	// //check if has locations
	// if (objectHasKey(dataContent[mapWithPropertiesObj.photosLength], 'locationnumber')){
	// 	mapWithPropertiesObj.locations					 = true;
	// 	mapWithPropertiesObj.locationsStartIndex = mapWithPropertiesObj.photosLength;
	// 	mapWithPropertiesObj.locationsLength     = parseInt(dataContent[mapWithPropertiesObj.locationsStartIndex].locationnumber);
	// }
	//
	// //check if has routes
	// if (objectHasKey(dataContent[mapWithPropertiesObj.photosLength + mapWithPropertiesObj.locationsLength], 'routesnumber')){
	// 	mapWithPropertiesObj.routes					  = true;
	// 	mapWithPropertiesObj.routesStartIndex = mapWithPropertiesObj.locationsLength + mapWithPropertiesObj.photosLength;
	// 	mapWithPropertiesObj.routesLength     = parseInt(dataContent[mapWithPropertiesObj.routesStartIndex].routesnumber);
	// }

	return mapWithPropertiesObj;
}

///////////////////////////ADD/REMOVE MAPS///////////////////////////
//add new created map
function addMap(objData, mapID, viewCoordinates, zoom, mapTile, isPreview){
	var map = createMapLeaflet(mapID, viewCoordinates, zoom, isPreview);

	var tileLayer = createTileLayer(mapTile, 19);
	currentTileLayerMap = tileLayer;
	addTileLayer(map, tileLayer);

	if (!isPreview) {
		var mapObject = {};

		mapObject[mapID] 			 	 				 			  = map;
		mapObject['id'] 			 	 				 			  = mapID;
		mapObject['tileLayer'] 	 				 			  = tileLayer;
		mapObject['colorLabels'] 				 			  = getMapColorLabels();
		mapObject['currentOpenPopupMap'] 			  = null;
		mapObject['mapZoomHandlerLevel'] 			  = 'street';
		mapObject['currentMyLocation'] 	 			  = [];
		mapObject['currentPhotosLayerMap'] 	 		= '';
		mapObject['currentLocationsLayerMap'] 	= '';
		mapObject['currentMyLocationsLayerMap'] = '';
		mapObject['currentRoutesLayerMap'] 	 		= '';
		mapObject['width'] 	 										= $('#'+mapID).css('width');
		mapObject['height'] 	 									= $('#'+mapID).css('height');

		mapObjArray.push(mapObject);
	}
}

function getMapColorLabels(){
	var placeLabels = [], colorLabels = [];
	var currentPlace, currentColor;
	$('.colorLabelDiv').each(function() {
		currentPlace = $(this).find('.specialSelect')[0].value;
		currentColor = $(this).find('.colorMapLegendPicker')[0].value;
		placeLabels.push(currentPlace);
		colorLabels.push(currentColor);
	})
	return [placeLabels, colorLabels];
}

//Create html element to append a leaflet map
function createMapElement(parentID, option, size, centerPoint, zoom, layerTile, isPreview, isLoadedData){
	var mapButtons = "", inputLayers = "", inputsVisualizationDetails, mapID = 'visualizationMap'+option;
	if (!isPreview){
		mapButtons  			= createVisualizationButtons(mapID);
		inputsVisualizationDetails = $('#visualizationDetails').find('input[type=checkbox]');
		if (isLoadedData)
			inputLayers = createMapLayersInput(false, mapID, option, [78, 95], 'checked', [83, 94], 'checked', [93, 94], 'checked');
		else
			inputLayers = createMapLayersInput(false, mapID, option, [78, 95], inputChecked(inputsVisualizationDetails[0]), [83, 94], inputChecked(inputsVisualizationDetails[1]), [93, 94], inputChecked(inputsVisualizationDetails[2]));
	}

	var mapClasses = (isPreview) ? "map" : "map visualization" ;
	var map = createHtml("div", mapButtons + inputLayers, 'id="'+mapID+'" class="'+mapClasses+'" style="position:relative; top:0%; width:'+ size[0] + 'px; height: ' + size[1] + 'px; border-radius: 10px; z-index:0;"');

	if (parentID == '#visualizationHeaderPreview')
		$(parentID).html(map);
	else
		$(parentID).append(map);

	if (isPreview){
		$('#'+mapID).on('click', function(){
			if ($(this)[0].id != 'visualizationMapPreview')
		 		selectMapPreview($(this)[0]);
		});
	}

	addMap("", mapID, centerPoint, zoom, layerTile, isPreview);

	if (!isPreview){
		var inputs = $('#'+mapID).find('input[type=checkbox]');
		var currentMapObj = getObjWithKeyInArray(mapObjArray, mapID);
		var currentMap    = currentMapObj[mapID];

		$('#' + inputs[0].id).on( "click", function() { toogleLayer(currentMap, inputs[0].checked, currentMapObj.currentPhotosLayerMap); });
		$('#' + inputs[1].id).on( "click", function() { toogleLayer(currentMap, inputs[1].checked, currentMapObj.currentLocationsLayerMap); });
		$('#' + inputs[2].id).on( "click", function() { toogleLayer(currentMap, inputs[2].checked, currentMapObj.currentMyLocationsLayerMap); });
		$('#' + inputs[3].id).on( "click", function() { toogleLayer(currentMap, inputs[3].checked, currentMapObj.currentRoutesLayerMap); });
	}

	//remove leaflet link from map
	$('.leaflet-control-attribution').remove();

	$('#' + mapID).on('time',
									function (evt, param1){
										//console.log(param1);
										var updateButton = $('#'+mapID).find('.updateVisualizationButton')[0];
										var updateVis 	 = ($(updateButton).attr('src').includes('updateBlocked')) ? false : true;
										if (updateAllVisualizations && updateVis && param1 != 'popupTimeEvent'){
											var params = ['city', '', 'location, photo, route', '', startDate, endDate];
											if (params.length == 0)
												return
											removeAllLayers(mapID);
											getDataFromServerToRefresh(mapID, null, 'map', '/data', params, 'updateMapLayers');
										}
						});

}

function selectMapPreview(mapElement){
	var parentElement = $(mapElement).parent();
	var key = ($(mapElement)[0].id).replace("visualizationMap", "");
	currentTileLayerMap = getValueByKey(mapObjectType, key);

	$('#mapVisualizationsContainer .map').each(function(){
		$($(this)[0]).css('border', '0px solid rgb(0,0,0)');
		$($(this)[0]).css({ boxShadow: ' 0px 0px 0px #444' });
		$($(this)[0]).css('cursor', 'pointer');
	});

	$(mapElement).css('border', '2px solid rgb(255,255,255)');
	$(mapElement).css( { boxShadow: ' 1px 3px 6px #444' } );
	$(mapElement).css('cursor', 'pointer');

	var img = document.getElementById('selectedMapPreviewCheck');
	var created = (img == null) ? false : true;
	img = (!created) ? createHtml('img', '', 'src="./imgs/checkmarkBlockIcon.gif" id="selectedMapPreviewCheck" style="position:absolute; top:10%; left:95%; width:20px;"') : $('#selectedMapPreviewCheck').detach();
	$(parentElement).append(img);

	if (created) {
		$('#visualizationMapPreview').remove();
		createMapElement("#visualizationHeaderPreview", 'Preview', [490, 100],[51.505, -0.09], 1, currentTileLayerMap, true, false);
	}
}

function toogleLayer(currentMap, checked, layer){
	if (checked)
		currentMap.addLayer(layer);
	else
		currentMap.removeLayer(layer);
}


function removeAllLayers(mapID){
	var currentMapObj = getObjWithKeyInArray(mapObjArray, mapID);
	var currentMap    = currentMapObj[mapID];
	try{
		currentMap.removeLayer(currentMapObj.currentPhotosLayerMap);
		currentMap.removeLayer(currentMapObj.currentLocationsLayerMap);
		currentMap.removeLayer(currentMapObj.currentRoutesLayerMap);
		currentMap.removeLayer(currentMapObj.currentMyLocationsLayerMap);
	}catch(err){}
}

function inputChecked(input){
	if(input.checked)
    return "checked";
	else
    return "";
}

//Remove map from visualizations details
function removeMapElement(){
	$("#visualizationDetails .map").remove();
}


//////////////////MAP HANDLERS//////////////////

//////ZOOM HANDLER//////
//Function that add layers according with the zoom
function mapZoomHandler(e, map, currentMapObj, photoCirclesLayer){
	var params = [], zoomLevel;

	if(e.target._zoom > 14){
	 	zoomLevel = 'street';
		params = ['street', '', 'location, photo', '', startDate, endDate];
	}else if(e.target._zoom > 9){
		zoomLevel = 'city';
		params = ['city', '', 'location, photo', '', startDate, endDate];
	}else{
		zoomLevel = 'country';
		params = ['country', '', 'location, photo', '', startDate, endDate];
	}

	if (currentMapObj.mapZoomHandlerLevel != zoomLevel) {
		currentMapObj.mapZoomHandlerLevel = zoomLevel;
		getDataFromServerToRefresh(e.target._container.id, map, 'map', '/data', params, 'updateMapLayers');
	}

	if(e.target._zoom > 16)								//if zoom is greater than 16 add the circles to the map
		map.addLayer(photoCirclesLayer);
	else																	//otherwise remove them
		map.removeLayer(photoCirclesLayer);
}

//////POPUPS HANDLER//////
//triggered every time a popup is open
function mapPopupHandler(evt, mapObjID){
	var currentMapObj = getObjWithKeyInArray(mapObjArray, mapObjID);
	currentMapObj.currentOpenPopupMap = evt.popup;
	var popupContent = evt.popup._content;

	if (popupContent.includes('popupDivLocationContent')) {

	}else if(popupContent.substring(1,3) == 'h3'){
		createLocationPopup(evt.popup, currentMapObj);
	}else if(popupContent.includes('loadingPhotosPopup')){			//check if it has loadingPhotosPopup class name (if true create photos popup)
		createPhotosPopup(evt.popup, currentMapObj);
	}else if(popupContent.includes('popupMyLocation')) {
		createMyLocationPopup(evt.popup, currentMapObj);
	}else if(popupContent.includes('popupRoute')) {
		createRoutesPopup(evt.popup);
	}else if(popupContent.includes('popupCircle') || popupContent.includes('popupRoute') || popupContent.includes('popupMyLocation')) {
//		return;
	}
}

function createLocationPopup(popup, mapObj){
	var popupDescription = getLocationDescriptionByElement(popup._content);
	var params 					 = [popupDescription, popup.getLatLng(), 'location', mapObj.mapZoomHandlerLevel, popup._source.location, 0];
	getDataFromServer('popup', '/map', params, 'MapUpdate');
}

function getLocationDescriptionByElement(element){
	return (element.match(/>.*</g))[0].replace(/(>)|(<)/g, "");
}

function createPhotosPopup(popup, mapObj){
	var popupDescription = '';
	var params = [popupDescription, popup.getLatLng(), 'photos', mapObj.mapZoomHandlerLevel, popup._source.location, 0];
	getDataFromServer('popup', '/map', params, 'MapPhotosUpdate');
}

function createMyLocationPopup(popup, mapObj){
	var popupDescription = '';
	var params = [popupDescription, popup.getLatLng(), 'myLocation', mapObj.mapZoomHandlerLevel, popup._source.location, 0];
	getDataFromServer('popup', '/map', params, 'MapMyLocationUpdate');
}

function createRoutesPopup(popup){
	var popupDescription = '';

	if(popup._content.match(/Origin:/) != null)
		return;

	var startPosition	= {}, lastPosition = {};
	var points = popup._content.match(/-*[0-9]+\.*[0-9]*,-*[0-9]+\.*[0-9]*/g);
	startPosition['latitude']  = parseFloat(points[0].split(',')[0]);
	startPosition['longitude'] = parseFloat(points[0].split(',')[1]);
	lastPosition['latitude']   = parseFloat(points[1].split(',')[0]);
	lastPosition['longitude']  = parseFloat(points[1].split(',')[1]);

	var timestamp = popup._content.match(/[0-9]+:[0-9]+:[0-9]+/g);

	getLocationStreet([startPosition, lastPosition], popupMapRoutesUpdate);

	var movementText = popup._content.match(/<h3.*>.*->.*</g); //ex: <h3 style="text-align:center;">Home->Rodas</h3><img src="./imgs/markers/routes.png" style="position:absolute; opacity:0.1; z-index:0;height:100px;top:57%; left:63%;overflow: hidden; "></img><
	movementText  	 = movementText[0].split('<');//[, h3 style="text-align:center;">Home->Rodas, ...]
	movementText  	 = movementText[1].split('>');//[h3 style="text-align:center;", Home-, Rodas, ...]
 	movementText		 = movementText[1] + '>' + movementText[2];//Home->Rodas

	var params = [movementText, popup.getLatLng(), 'routes', timestamp, popup._source.location, 0];
	getDataFromServer('popup', '/map', params, 'MapRoutesUpdate');
}

//////TIME EVENT TRIGGER HANDLER//////
function triggerMapTimeEvent(eventPopupString){
	var html 		 = $.parseHTML( eventPopupString )[0];							//ex:<div><div><h6>stuff</h6></div></div>
	var timeText = $( html ).find('h6')[2].innerHTML.split('<br>');	//ex "Since 14 Jan 2017<br>until 15 Jan 2017"

	var initialTime, finalTime;
	if (timeText.length == 1){
		initialTime = timeText[0].replace('On ', "");
		finalTime   = timeText[0].replace('On ', "");
	}else {
		initialTime = timeText[0].replace('Since ', "");
		finalTime   = timeText[1].replace('until ', "");
	}

	startDate = new Date(initialTime);
	endDate   = new Date(finalTime);

	$('.visualization').trigger('time', ['popupTimeEvent']);
}

///////////GET CURRENT LOCATION///////////
//get my current location from the browser navigator
function showMyCurrentLocation(){
	if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(addMyLocationToMap);
	} else {
			alert("Geolocation is not supported by this browser.");
	}
}

//check if I'm using a mobile or pc device
function getMyLocationMarkerType(){
	if (usingMobile())
		return 'youAreHerePhoneMarker';
	else
		return 'youAreHerePCMarker';
}


///////////////////////////UPDATE MAP POPUP///////////////////////////
$(document).on('click', '.carousel-control', function(evt){
	var slider 				  = $(this).closest('.carousel');
	var visualizationID = $(this).closest('.visualization')[0].id;
	setTimeout(function(){
		var numberOfPhotos = $(slider).find('.item').length;
		//console.log('Number Of Photos: ' +numberOfPhotos);
		getPopupNextPhotos(getMapPopup(visualizationID), visualizationID, numberOfPhotos);
	}, 900);	//time that took to change slide
});

$(document).on($.support.transition.end, '.carousel-inner .active', function(event){
	var visualizationID = $(this).closest('.visualization')[0].id;
	var numberOfPhotos  = $($(this).closest('.carousel')).find('.item').length;
	//console.log('End of transition, Number Of Photos: ' +numberOfPhotos);
	getPopupNextPhotos(getMapPopup(visualizationID), visualizationID, numberOfPhotos);
});

function getPopupNextPhotos(popup, visualizationID, numberOfPhotos){
	var popupDescription = 'loadMoreFotos';
	var params = [popupDescription, popup.getLatLng(), 'photos', getMapZoom(visualizationID), popup._source.location, numberOfPhotos];
	getDataFromServer('popup', '/map', params, 'MapPhotosUpdate');
}

function getMapZoom(elementID){
	var currentMapObj = getObjWithKeyInArray(mapObjArray, elementID);
	return currentMapObj.mapZoomHandlerLevel;
}

function getMapPopup(elementID){
	var currentMapObj = getObjWithKeyInArray(mapObjArray, elementID);
	return currentMapObj.currentOpenPopupMap;
}

//Function that Updates photos popups based on the information received from the server
function popupMapPhotosUpdate(data){
	var jsonData  = JSON.parse(data);
	var elementID = $(lastClickedItem)[0].id;
	//console.log(jsonData);

	if (jsonData.length == 0)
		return;

	var imagesArray 	= [];
	var imagesContent = jsonData[0][1].split('/|/');
	var imagesData 		= jsonData[1];

	var currentMapObj = getObjWithKeyInArray(mapObjArray, elementID);

	var isUpdateSlider = (currentMapObj.currentOpenPopupMap._content.match(/mapSlider/) != null) ? true : false ;
	var isLocationWithPhotos = (currentMapObj.currentOpenPopupMap._content.match(/timesHereDiv/) != null)? true : false;

	for (var currentImage, currentFilename, currentLocation, currentTimestamp, currentDiv, index = 0; index < imagesContent.length; index++) {
		if (isLocationWithPhotos) {//if its going to update a location popup with a photo slider
			currentImage 		 = createHtml("img", "", "src='"+imagesContent[index]+"' class='popupImage' draggable='true' ondragstart='dragImage(event)' style='max-width:200px;max-height:100px;margin-left:50%;transform: translate(-50%, 0%);'");
			currentTimestamp = createHtml("h7", '⏱ ' + convertToChartDates(imagesData[index].timestamp) + ' at ' + (imagesData[index].time).slice(0, -3), "style='position:absolute; top:120px; left:50%; transform:translate(-50%, 0%);overflow:visible;'");
			currentDiv			 = createHtml("div", currentImage + currentTimestamp, "style='height:140px;'");
		}else {
			currentImage 		 = createHtml("img", "", "src='"+imagesContent[index]+"' class='popupImage' draggable='true' ondragstart='dragImage(event)' style='max-width:280px;max-height:170px;margin-left:50%;transform: translate(-50%, 0%);'");
			currentFilename  = createHtml("h4",  getSubString(imagesData[index].filename, 18), "style='margin-left:50%;transform: translate(-50%, 0%); text-overflow: ellipsis; overflow: hidden;'");
			currentLocation  = createHtml("h7",  '📍 ' + imagesData[index].street + ', ' + imagesData[index].city + ', ' + imagesData[index].country, "style='margin-left:10%; text-overflow: ellipsis; overflow: hidden;'");
			currentTimestamp = createHtml("h7",  convertToChartDates(imagesData[index].timestamp) + ' at ' + (imagesData[index].time).slice(0, -3), "style='position:absolute; top:0px; left:5px; text-align:center; border-radius:40px; width:80px; background-color:#4F93C4; color:white; border:1px solid white; padding:15px;'");
			currentDiv			 = createHtml("div", currentImage + currentFilename + currentLocation + currentTimestamp, "");
		}
		imagesArray.push(currentDiv);
	}

	var divSlider = '';
	if (isUpdateSlider) {	//updateSlider
		updateSlider(elementID, imagesArray);
	}else{//createSlider
		if (imagesArray.length > 1) {
			var slider = createSlider('mapSlider' + mapChartGraphNumber,'imageSlider', imagesArray);
			divSlider  = createHtml("div",  slider, "class='popupSliderPhotosDiv'");
		}else if(imagesArray.length == 1){
			var image = imagesArray[0];
			divSlider = createHtml("div",  image, "class='popupSliderPhotosDiv'");
		}

		var image 		 = createHtml('img', '', 'src="./imgs/markers/photo.png" style="position:absolute; opacity:0.1; z-index:0;height:100px;	top:145px; left:225px;overflow: hidden; "');
		var divContent = createHtml("div", image + divSlider, "style='height: 220px;width: 280px;'");
		currentMapObj.currentOpenPopupMap.setContent(divContent);
	}

	updateStyleAllVisualizations();
}

//update my loction popup
function popupMapMyLocationUpdate(data){
	var jsonData = JSON.parse(data);
	//console.log(jsonData);

	if ($('#herePlaceMyLocationPopup').length == 1) //check if content was already inserted
		return;

	var elementID = $(lastClickedItem)[0].id;
	var currentMapObj = getObjWithKeyInArray(mapObjArray, elementID);
	var popupContent = currentMapObj.currentOpenPopupMap.getContent();

	var coverImage = createHtml('img', '', 'src="./imgs/map.jpg" style="position:absolute;top:70px;left:20px;width:285px;height:90px;border-radius:10px;border:1px solid rgba(0,0,0,0.3);"');

	var herePlace = '', startIndex = 0;
	if ((jsonData[0].st_distance/1000).toFixed(2) < 0.06) {//less than 60 meters
		herePlace  = createHtml('h5', '🏠 ' + jsonData[0].tags, 'id="herePlaceMyLocationPopup" style="position:absolute; top:120px; right:20px; color: white; text-shadow: 0 0 4px #000000, 1px 1px 4px black;"');
		startIndex = 1;
	}

	var currentLocation = createHtml('h4', '📍 ' + currentMyLocation, 'style="position:absolute; top:70px; right:20px; font-size:2vw;text-align:right; color: white; text-shadow: 0 0 10px #000000, 1px 1px 4px black;"');
	var closestPlaces 	= createHtml('h6', 'Near Places:', 'style="position:absolute; top:155px; left:20px;"');
	var placesDiv = '';
	for (var valueToIncrement, place, img, imgTop, textTop, index = startIndex; index < startIndex+3; index++) {
		valueToIncrement = (startIndex == 0)? (index + 1) : index;
		imgTop 	= 163 + valueToIncrement * 23;
		textTop = 153 + valueToIncrement * 23;

		img 	 = createHtml('img', '', 'src="./imgs/markers/location.png" style="position:absolute;display:inline-block;width:20px; top:'+imgTop+'px; left:20px;"');
		place 	 = createHtml('h5', jsonData[index].tags + ' ('+(jsonData[index].st_distance/1000).toFixed(2)+' km)', 'style="position:absolute;display:inline-block;top:'+textTop+'px; left:45px;"');
		placesDiv +=img + place;
	}
	currentMapObj.currentOpenPopupMap.setContent(coverImage+ popupContent+currentLocation+closestPlaces+herePlace+placesDiv);

	updateStyleAllVisualizations();
}

//update routes popup
function popupMapRoutesUpdate(data){
	var originText = '', originAddress='', destinationText = '', destinationAddress = '', transportationImage = '', transportationText = '', kmText = '';
	var elementID = $(lastClickedItem)[0].id;
	var currentMapObj = getObjWithKeyInArray(mapObjArray, elementID);
	if (data.hasOwnProperty('startAddress')) {
		originText    = createHtml('h4', 'Origin: ', 'style="position:absolute; top:55px; left:2%;"');
		originAddress = createHtml('h5', '📍 ' + data.startAddress, 'style="position:absolute; top:85px; left:2%; width:150px;"');
		destinationText    = createHtml('h4', 'Destination: ', 'style="position:absolute; top:55px; right:2%;"');
		destinationAddress = createHtml('h5', '📍 ' + data.endAddress, 'style="position:absolute; top:85px; right:2%; width:150px; text-align:right;"');
	}else {
		var transportationType, dataContent = JSON.parse(data);

		//kilometers text
		var titleHeader 		 = currentMapObj.currentOpenPopupMap._content.match(/-*[0-9]+\.*[0-9]*,-*[0-9]+\.*[0-9]*/gi);
		var latLngStartArray = titleHeader[0].split(',');
		var latLngEndArray	 = titleHeader[1].split(',');
		kmText = createHtml('h1', convertLatLonToKm(latLngStartArray[0],latLngStartArray[1],latLngEndArray[0],latLngEndArray[1]).toFixed(2) + ' km', 'style="position:absolute; font-size:40px; top:59%; right:2%;"');

		try {
			transportationType  = dataContent[0].tags.replace('[', '').replace(']', '');
			transportationImage = createHtml('img', '', 'src="./imgs/icons/transportation/'+transportationType+'.png" style="position:absolute; top:60%; left:25%; transform:translate(-50%,0%); width:100px; border-radius:100px; background-color:#5B9BCA;border:1px solid rgba(0,0,0,0.5);"');
			transportationText  = createHtml('h6', transportationType.toUpperCase(), 'style="position:absolute; top:85%; width:80px;color:white;left:25%; transform:translate(-50%,0%); z-index:1; text-align:center"');
		} catch (e) {
			transportationImage = createHtml('img', '', 'src="./imgs/icons/transportation/unknownTransportation.png" style="position:absolute; top:60%; left:25%; transform:translate(-50%,0%); width:100px; border-radius:100px;  background-color:#5B9BCA;border:1px solid rgba(0,0,0,0.5);"');
			transportationText  = createHtml('h6', 'UNKNOWN', 'style="position:absolute; top:85%; width:80px; color:white; left:25%; transform:translate(-50%,0%); z-index:1; text-align:center"');
		}
	}
	currentMapObj.currentOpenPopupMap.setContent(currentMapObj.currentOpenPopupMap.getContent() + originText + originAddress + destinationText + destinationAddress + transportationImage + transportationText + kmText);

	updateStyleAllVisualizations();
}

//Function that Updates locations popups based on the information received from the server
function popupMapUpdate(data){
	var jsonData = JSON.parse(data);

	var dataContent, imagesContent, imagesArray = [], filename = '';
	var elementID = $(lastClickedItem)[0].id;
	var currentMapObj = getObjWithKeyInArray(mapObjArray, elementID);

	var divContentHeight;
	if (jsonData.length == 1) {
		divContentHeight = '200px';
		dataContent 	 	 = jsonData[0];
		filename 				 = jsonData[jsonData.length-1].filename;
	}else{
		divContentHeight= '350px';
		dataContent = jsonData[1][jsonData[1].length-1];
		imagesContent = jsonData[0][1].split('/|/');
		for (var currentImage, currentDiv, index = 0; index < imagesContent.length; index++) {
			currentImage 		 = createHtml("img", "", "src='"+imagesContent[index]+"' class='popupImage' draggable='true' ondragstart='dragImage(event)' style='max-width:200px;max-height:100px;margin-left:50%;margin-bottom:2%;transform: translate(-50%, 0%);'");
			currentTimestamp = createHtml("h7", '⏱ ' + convertToChartDates(jsonData[1][index].timestamp) + ' at ' + (jsonData[1][index].time).slice(0, -3), "style='position:absolute; top:120px; left:50%; transform:translate(-50%, 0%);overflow:visible;'");
			currentDiv 	 		 = createHtml("div", currentImage + currentTimestamp, "style='height:140px'");
			filename 				 = jsonData[1][jsonData[1].length-1].filename;
			imagesArray.push(currentDiv);
		}
	}

	var title 		= currentMapObj.currentOpenPopupMap.getContent();
	var titleText = getLocationDescriptionByElement(currentMapObj.currentOpenPopupMap.getContent());
	var mapID 		= currentMapObj.currentOpenPopupMap._map._container.id;

	//Title Header
	var textSize 					= resizeTextElement(titleText, 10, 2.5, 1.5, -0.2);
	var header 				 		= createHtml("h5", titleText, "style='font-size:"+textSize+";width: 150px;height: 100px;margin-left:48%;margin-top:40%;transform: translate(-50%, -50%);'");					//Header ex:Amoreiras or Home
	var divTitle			 		= createHtml("div", header, "id='popupDivLocationTitle' class='popupDivLocationTitle'");

	//Number of times on this place
	var timesHereTextSize = resizeTextElement(dataContent.timesthere, 1, 10, 3, -1);
	var timesHere 		 		= createHtml("h1", dataContent.timesthere, "id='timesHereNumber"+mapID+"' class='timesHereNumber' style='font-size:"+timesHereTextSize+";'");			//Number of times in a certain place ex:1
	var timeString;
	if (parseInt(dataContent.timesthere) == 1)
		timeString = ' Time here';
	else
		timeString = ' Times here';
	var timeStringElement	 	= createHtml("h6", timeString, 'id="timesHereString'+mapID+'" class="timesHereString" style="position:absolute;top:80%;left:32%;color:white;"');
	var divTimesHere 		 		= createHtml("div", timesHere + timeStringElement, "id='timesHereDiv"+mapID+"' class='timesHereDiv' style='background-color:"+getTimesHereColor(mapID)+"'");

	//Time on this place
	var hoursMinutesParagraph;
	if (dataContent.hours == null && dataContent.minutes == null)
		hoursMinutesParagraph = createHtml("h7", 'No Records', 'id="popupClockText'+mapID+'" class="popupClockText"');
	else
		hoursMinutesParagraph = createHtml("h7", getCorrectTime(dataContent.hours, dataContent.minutes), 'id="popupClockText'+mapID+'" class="popupClockText"');
	var divClock = createHtml("div", hoursMinutesParagraph, "class='popupDivLocationClock'");

	//Dates on this place
	var calendarGlyphicon = createHtml("img", '', "id= 'popupCalendarIcon"+mapID+"' class='popupCalendarIcon popupIcon' src='./imgs/icons/calendar.png'");
	var intervalParagraph;
	if (dataContent.startdate == null && dataContent.enddate == null )
		intervalParagraph = createHtml("h5", 'No Records', 'id="popupCalendarText'+mapID+'" class="popupCalendarText" style="left: 200px;"');
	else if (dataContent.startdate == dataContent.enddate)
		intervalParagraph = createHtml("h5", 'On: ' + convertDate(dataContent.startdate ), 'id="popupCalendarText'+mapID+'" class="popupCalendarText" style="left: 190px;"');
	else
		intervalParagraph = createHtml("h5", 'From: ' + convertDate(dataContent.startdate + '') + '</br>To:  ' + convertDate(dataContent.enddate + ''), 'id="popupCalendarText'+mapID+'" class="popupCalendarText" style="left: 175px;"');
	var divCalendar = createHtml("div", intervalParagraph + calendarGlyphicon, "class='popupDivLocationCalendar'");

	var divBody 	  = createHtml("div",  '', "id='popupDivLocationBody"+currentMapObj.id+"' class='popupDivLocationBody'");

	//Photos nearby
	var divSlider = '';
	if (imagesArray.length > 1) {
		var slider  = createSlider('mapSlider' + mapChartGraphNumber, 'imageSlider', imagesArray);
		divSlider 	= createHtml("div",  slider, "class='popupSliderDiv'");
	}else if(imagesArray.length == 1){
		var image = imagesArray[0];
		divSlider = createHtml("div",  image, "class='popupSliderDiv'");
	}

	var imageTop = '0%', imageLeft = '0%';
	if (divSlider == '') { imageTop  = '57%'; imageLeft = '75%'; }
	else{ imageTop  = '77%'; imageLeft = '75%';}

	var backButton = createHtml('img', '', 'src="./imgs/icons/containerIcons/arrows/back.png" class="popupBackIcon" ');

	var image 		 = createHtml('img', '', 'src="./imgs/markers/location.png" style="position:absolute; opacity:0.1; z-index:0;height:100px;top:'+imageTop+'; left:'+imageLeft+';overflow: hidden; "');
	var divContent = createHtml("div", divSlider + divTimesHere + divTitle + divBody + image + backButton + divClock + divCalendar, "class='popupDivLocationContent popupUpdated' style='height: "+divContentHeight+";' alt='"+filename+"'");
	currentMapObj.currentOpenPopupMap.setContent(divContent);

	updateStyleAllVisualizations();
}

//update popup calendar information
function updatePopupCalendar(popup, mapObj, data){
	var map 				= mapObj.currentMapObj;
	var contentData = JSON.parse(data);

	//create calendar
	calendarHeatmapNumber  += 1;
	var startCalendarDate  = contentData[contentData.length - 1].mintimestamp;
	var monthHighestValue	 = contentData[contentData.length - 1].monthHighestValue;
	var maxvalue           = contentData[contentData.length - 1].maxvalue;
  var monthHighestValue  = contentData[contentData.length - 1].monthHighestValue;
  var startCalendarDate  = contentData[contentData.length - 1].mintimestamp;
  var endCalendarDate    = contentData[contentData.length - 1].maxtimestamp;
  var todayDate          = new Date();
  var startConvertedDate = new Date(todayDate.getFullYear(), todayDate.getMonth(), 1);
  var endConvertedDate   = new Date(todayDate.getFullYear(), todayDate.getMonth() + 1, 0);

	//get data for calendarHeatmap
  var updateData = {};
	for (var currentSeconds, index = 0; index <= contentData.length - 1; index++) {
    if (contentData[index].hasOwnProperty('date')){
      currentSeconds = convertDatesToSeconds(new Date(1970, 00, 01), convertToDefaultDate(contentData[index].date));
      updateData[currentSeconds] = parseFloat(contentData[index].value);
    }else break;
  }

  var updateMonthData = {};
  for (var currentSeconds, index = contentData.length - 2; index > 0; index--) {
    if (contentData[index].hasOwnProperty('month')){
      currentSeconds = convertDatesToSeconds(new Date(1970, 00, 01), convertToDefaultDate(contentData[index].month));
      updateMonthData[currentSeconds] = parseFloat(contentData[index].value);
    }else break;
  }
	//console.log(updateMonthData);

	var objData = createCalendarProtoObject('calendarHeatmap'+ calendarHeatmapNumber, 'year', 'month', "%m", startConvertedDate, maxvalue, monthHighestValue, updateData, updateMonthData, 15);
	setTimeout(function(){	createCalendarHeatmap('calendarHeatmap'+ calendarHeatmapNumber, 'popupDivLocationBody'+mapObj.id, objData, false, 'position:absolute; width:280px; height:100px; left:-50px; top:10px; z-index:2;', true); }, ANIMATIONTIME*1.5);
}

//get the selected color for popup times here background
function getTimesHereColor(mapID){
	var currentMapObj = getObjWithKeyInArray(mapObjArray, mapID);
	var titleHeader = currentMapObj.currentOpenPopupMap._content.match(/<h[0-9].*>.*<\/h[0-9]>/gi);
	var title 			= titleHeader[0].match(/>.*</gi)[0].replace(/(>)|(<)/gi, '');
	var colorLabels = getObjWithKeyInArray(mapObjArray, mapID).colorLabels;	//get colorLabels from map ex:[['Restaurant', 'Home'], ['#fffff', '#ff000']]

	if (colorLabels[0][0] == '')
		return 'rgba(255, 179, 109, 1)';

	for (var index = 0; index < colorLabels[0].length; index++) {
		//console.log(colorLabels[0][index] + ' == ' + title);
		if (title.includes(colorLabels[0][index])) {
			return colorLabels[1][index]; //return the correspondent color
		}
	}
	return 'rgba(255, 179, 109, 1)';
}

///////////////////////////UPDATE MAP LAYERS///////////////////////////
//On zoom, change layers aggregation
function updateMapLayers(elementID, map, data){
	var dataContent = JSON.parse(data);
	var markersLocationsArray = [], markersPhotosArray = [], markersRoutesArray = [];

	var iconClass = createIconClassLeaflet('/static/imgs/markers/markerShadow.png');
	var iconClassInstance, photoType, routesInData = false;

	for (var currentMarker, currentLatLng, index = 0; index < dataContent.length; index++) {
		if (dataContent[index].photos != null){
			iconClassInstance = new iconClass({iconUrl: '/static/imgs/markers/photo.png'});
			currentMarker = photoInfoMarker([dataContent[index].location, dataContent[index].latavg, dataContent[index].lngavg], iconClassInstance);
			markersPhotosArray.push(currentMarker);
			photoType = dataContent[index].type;
		}else if(dataContent[index].location != null){
			iconClassInstance = new iconClass({iconUrl: '/static/imgs/markers/location.png'});
			currentMarker = locationInfoMarker([dataContent[index].location, dataContent[index].latavg, dataContent[index].lngavg], iconClassInstance);
			markersLocationsArray.push(currentMarker);
		}else if(dataContent[index].routesnumber != null){
			routesInData = true;
		}
	}

	var currentMapObj = getObjWithKeyInArray(mapObjArray, elementID);
	var currentMap    = currentMapObj[elementID];

	if (routesInData) {
		currentMap.removeLayer(currentMapObj.currentRoutesLayerMap);
		var routesMarker = addMarkers(getRoutesArray(dataContent), "routes");
		markersRoutesArray.push(routesMarker);
		currentMap.addLayer(createLayerGroup(markersRoutesArray));
		currentMapObj.currentRoutesLayerMap = routesMarker;
	}


	if (markersPhotosArray.length > 0) {
		var newPhotosLayer = createLayerGroup(markersPhotosArray);
		currentMap.removeLayer(currentMapObj.currentPhotosLayerMap);

		if (photoType == 'street')
			newPhotosLayer = nearbyElementAlgorithm(newPhotosLayer.getLayers(), []);

		currentMap.addLayer(newPhotosLayer);
		currentMapObj.currentPhotosLayerMap = newPhotosLayer;
	}

	if (markersLocationsArray.length > 0) {
		var newLocationLayer = createLayerGroup(markersLocationsArray);
		currentMap.removeLayer(currentMapObj.currentLocationsLayerMap);
		currentMap.addLayer(newLocationLayer);
		currentMapObj.currentLocationsLayerMap = newLocationLayer;
	}

	//hide layers if theirs respective checkbox is unchecked
	var mapNumber = elementID.match(/[0-9]+$/);
	if (!$('#checkboxIsPhoto' + mapNumber).is(':checked')) //if photos are checked
		currentMap.removeLayer(currentMapObj.currentPhotosLayerMap);
	if (!$('#checkboxIsLocation' + mapNumber).is(':checked')) //if locations are checked
		currentMap.removeLayer(currentMapObj.currentLocationsLayerMap);
	if (!$('#checkboxIsMyLocation' + mapNumber).is(':checked')) //if my location are checked
		currentMap.removeLayer(currentMapObj.currentMyLocationsLayerMap);
	if (!$('#checkboxIsRoutes' + mapNumber).is(':checked')) //if routes are checked
		currentMap.removeLayer(currentMapObj.currentRoutesLayerMap);
}

///////////////REMOVE CALENDAR ON POPUP CLOSE/////////////////
function removeCalendar(e){
	var calendarID = e.popup._container.innerHTML.match(/calendarHeatmap[0-9]*/);
	if (calendarID)//if not null
		removeVisualization(calendarID[0]);
}
