import { Injectable } from '@angular/core';
import 'leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet.markercluster';

@Injectable()
export class MapLeafletProvider {
  LR: any;

  ////////////////CREATE LEAFLET ELEMENTS//////////////////////
  public createLeafletMap(){
    return L.map('map',
                  {zoomDelta: 2,
                   zoomSnap: 0,
                   doubleClickZoom: false,
                   minZoom:2,
                   maxBounds: [[100,-170],[-100,220]],
                   zoomControl:false
                  });
  }

  public createLeafletPolyline(pointsList, color, weight, opacity, smoothFactor){
    return L.polyline(pointsList, {
                           color: color,
                           weight: weight,
                           opacity: opacity,
                           smoothFactor: smoothFactor
                         });
  }

  public createLeafletCircle(position, color, fillOpacity, radius){
    return new L.Circle(position, {
        color: color,
        fillOpacity: fillOpacity,
        radius: radius});
  }

  public createLeafletTileLayer(url, maxZoom){
    return L.tileLayer(url, {
       maxZoom: maxZoom
     });
  }

  public createLeafletIcon(iconUrl, shadowUrl, iconSize, shadowSize, iconAnchor, shadowAnchor, popupAnchor){
    return new L.Icon({
                        iconUrl:      iconUrl,
        				        shadowUrl:    shadowUrl,
        				        iconSize:     iconSize,
        				        shadowSize:   shadowSize,
        				        iconAnchor:   iconAnchor,
        				        shadowAnchor: shadowAnchor,
        				        popupAnchor:  popupAnchor
              				});
  }

  public createLeafletLatLng(lat, lng){
    return L.latLng(parseFloat(lat), parseFloat(lng));
  }

  public createLeafletMarker(latLng, iconInstance){
    return L.marker(latLng, {icon:iconInstance});
  }

  public createLeafletLayerGroup(array){
    return L.layerGroup(array);
  }

  public createLeafletFeatureGroup(listOfMarkers){ return L.featureGroup(listOfMarkers); }

  public createLeafletRoute(initialPosition, finalPosition){
    this.LR = L;
    var router = this.LR.Routing.OSRM({ serviceUrl: '' });
    return this.LR.Routing.control({
              waypoints: [
                L.latLng(initialPosition[0], initialPosition[1]),
                L.latLng(finalPosition[0], finalPosition[1])
              ],
              autoRoute:true,
              showAlternatives:false,
              lineOptions: {
                  styles: [{color: 'blue', opacity: 0.5, weight: 3}]
               },
              router: router
          });
  }

  ////////////////ADD LEAFLET ELEMENTS//////////////////////
  public addLeafletElementToMap(map, element){
    element.addTo(map);
  }

  ////////////////SET LEAFLET ELEMENTS//////////////////////
  public setLeafletMapView(map, lat, lng, zoom){
    map.setView([lat, lng], zoom);
  }

  public setLeafletWaypoints(element, position1, position2){
    element.setWaypoints([
        L.latLng(position1[0], position1[1]),
        L.latLng(position2[0], position2[1])
      ]);
  }

  ////////////////REMOVE ELEMENTS FROM MAP//////////////////////
  //remove layer from map
  public removeLeafletElementToMap(map, layer){
    map.removeLayer(layer);
  }

  //remove polylines from map
  clearMapPolylines(map) {
    for(var index in map._layers) {
        if(map._layers[index]._path != undefined) {
            try {
                map.removeLayer(map._layers[index]);
            }
            catch(e) {
                console.log("problem with " + e + map._layers[index]);
            }
        }
    }
  }

  ////////////////COMPARISON FROM MAP//////////////////////
  isTileLayer(layer){
    return ( layer instanceof L.TileLayer ) ? true : false;
  }

  isCircleLayer(layer){
    return ( layer instanceof L.Circle ) ? true : false;
  }

  isMarkerLayer(layer){
    return ( layer instanceof L.Marker ) ? true : false;
  }

  isGroupLayer(layer){
    return ( layer instanceof L.LayerGroup ) ? true : false;
  }

}
