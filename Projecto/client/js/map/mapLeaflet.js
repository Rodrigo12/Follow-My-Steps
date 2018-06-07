function createMapLeaflet(mapID, viewCoordinates, zoom, isPreview){
	 return L.map(mapID,
		 						{zoomDelta: 0.25,
        				 zoomSnap: 0,
								 doubleClickZoom: false,
								 minZoom:2,
								 zoomControl:!isPreview,
								 zoomAnimationThreshold:20,
								 maxBounds: [[100,-170],[-100,220]]
							  }).setView(viewCoordinates, zoom);
}

function createTileLayer(mapTile, maxZoom){
	return L.tileLayer(mapTile, {
						maxZoom: maxZoom,
					});
}

function createLayerGroup(layerArray){
  return L.layerGroup(layerArray);
}

function createFeatureGroup(layerArray){
  return L.featureGroup(layerArray);
}

function createIconClassLeaflet(iconShadowUrl){
	return L.Icon.extend({
				    options: {
				        shadowUrl: iconShadowUrl,
				        iconSize:     [38, 38],
				        shadowSize:   [30, 30],
				        iconAnchor:   [22, 42],
				        shadowAnchor: [4, 30],
				        popupAnchor:  [-0, -40]
				    }
				});
}

function createMarkerFromIconClass(latLng, classIcon){
  return L.marker(latLng, {icon: classIcon});
}

function createCircle(center, color, fillColor, fillOpacity, radius){
	return L.circle(center, {
    color: color,
    fillOpacity: fillOpacity,
    radius: radius
	});
}

function bindPopup(currentElement, elementType, elementChild, elementProperties){
	currentElement.bindPopup(createHtml(elementType, elementChild, elementProperties));
}

function changeTileURL(map, tileURL){
	map.setUrl(tileURL);
}


function addTileLayer(map, mapTile){
	map.addLayer(mapTile);
}

function removeTileLayer(map, mapTile){
	map.removeLayer(mapTile);
}

function changeTileLayer(map, mapTileAdd, mapTileRemove){
	map.removeLayer(mapTileRemove);
	map.addLayer(mapTileAdd);
}

function createNewPoint(lat, lng){
	return L.LatLng(lat, lng);
}

function createPolyLine(pointsList){
	return L.polyline(pointsList, {
		color: 'blue',
		weight: 3,
		opacity: 0.5,
		smoothFactor: 1
	});
}
