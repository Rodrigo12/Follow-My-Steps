import { Component } from '@angular/core';
import { NgModule }      from '@angular/core';
import {MapProvider} from '../../providers/map/map';
import {MapLeafletProvider} from '../../providers/map/mapLeaflet';
import {CardsProvider} from '../../providers/cards/cards';
import * as $ from 'jquery'

@NgModule({})

@Component({
  providers: [MapProvider, MapLeafletProvider, CardsProvider]
})

export class MapClass {
  public map;
  public myPosition = [];
  myPositionTag    = '';
  distanceLocation = 1500; //1.5km
  distanceRadius   = 50;
  currentRoute     = '';
  locationsLayer   = null;
  myLocationLayer  = null;
  photosTimer      = null;
  serverUrl        = '';

  intervalTimer    = null;
  showArea         = false;
  showLocations    = true;

  constructor( public mapProvider: MapProvider, public cardsProvider: CardsProvider, public mapLeafletProvider: MapLeafletProvider){
  }

  ///////////////CREATE MAP///////////////
  //draw map
  drawMap(serverUrl): void{
    this.serverUrl = serverUrl;
    this.map = this.mapLeafletProvider.createLeafletMap();
    this.mapLeafletProvider.setLeafletMapView(this.map, 51.505, -0.09, 0);

    let tile = this.mapLeafletProvider.createLeafletTileLayer("http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", 18);
    this.mapLeafletProvider.addLeafletElementToMap(this.map, tile);

    var time = 60000;//10 min
    this.insertCurrentPosition();
    this.startIntervalTimer(time);
  }

  startIntervalTimer(time){
    if (this.intervalTimer != null)
      clearInterval(this.intervalTimer);

    let _this = this;
    this.intervalTimer = setInterval(function(){ _this.insertCurrentPosition(); console.log('timer') }, time);
  }

  //insert my current location on the map
  insertCurrentPosition(){
    if (navigator.geolocation) {
        var options = {
          enableHighAccuracy: true
        };
        navigator.geolocation.getCurrentPosition(
          position=> {
            if (this.locationsLayer != null)  {
              let _thisValue = this;
              _thisValue.mapLeafletProvider.clearMapPolylines(_thisValue.map);
              this.map.eachLayer(function (layer) {
                if( _thisValue.mapLeafletProvider.isGroupLayer(layer) || _thisValue.mapLeafletProvider.isMarkerLayer(layer) || _thisValue.mapLeafletProvider.isCircleLayer(layer) )
                  _thisValue.map.removeLayer(layer);
              });
            } //remove my location layer if already exist

            if(this.showArea){
              var circle = this.mapLeafletProvider.createLeafletCircle(this.myPosition, 'blue', 0.2, this.distanceLocation);
              this.map.addLayer(circle);
            }

            console.log(this.showLocations);
            if (this.showLocations)
              this.loadMarkers([position.coords.latitude, position.coords.longitude]);

            this.updateMyLocationPopup(position.coords.latitude, position.coords.longitude);

          }, error => {
            console.log(error);
        }, options);
      }
    }

    ///////////////LOAD MARKERS///////////////
    //add markers to map
    loadMarkers(myPosition){
      this.mapProvider.load(this.serverUrl, myPosition, this.distanceLocation)
      .then(data => {
        if(data.length != 0 && data != null){
          this.loadLocations(data).addTo(this.map);
        }
      });
    }

    //load locations
    loadLocations(data){
console.log(data);
      var locationsSize  = data.length;
      var locationsArray = [], currentMarker, locationsLatAvg = 0, locationsLngAvg = 0;
      var distanceRatio = this.distanceLocation/6;
      for(var iconClassInstance, distanceIndex, index = 0; index < locationsSize; index++){
        distanceIndex    = Math.round(parseFloat(data[index]['distancetomylocation'])/distanceRatio)+1;
        iconClassInstance= this.mapLeafletProvider.createLeafletIcon('assets/imgs/locationClose'+distanceIndex+'.png', 'assets/imgs/markerShadow.png', [38, 38], [30, 30], [22, 42], [4, 30], [-0, -40]);
        locationsLatAvg += data[index]['latavg'];
        locationsLngAvg += data[index]['lngavg'];
        currentMarker = this.locationInfoMarker(data[index], iconClassInstance);
        locationsArray.push(currentMarker);
      }

      this.mapLeafletProvider.setLeafletMapView(this.map, locationsLatAvg/locationsSize, locationsLngAvg/locationsSize, 10);
      this.locationsLayer = this.mapLeafletProvider.createLeafletLayerGroup(locationsArray);
      return this.locationsLayer;
    }

    //parse location marker information
    locationInfoMarker(markersObj, iconInstance){
      console.log(markersObj);
      var distanceRatio = this.distanceLocation/6;
      var distanceIndex = Math.round(parseFloat(markersObj.distancetomylocation)/distanceRatio)+1;

      var latLng = this.mapLeafletProvider.createLeafletLatLng(markersObj['latavg'], markersObj['lngavg']);
      var marker = this.mapLeafletProvider.createLeafletMarker(latLng, iconInstance);

      var locationName = '<h3 style="position:absolute; top:0px; width:80%; text-align:center;">'+markersObj.location+'</h3>';
      var timeString   =  (markersObj.startDate == markersObj.endDate) ? 'On ' + markersObj.startdate : 'From ' + markersObj.startdate + ' until ' + markersObj.enddate;
      timeString       = '<h7 style="position:absolute; bottom:40px; width:80%; text-align:center;">🛣 '+ (markersObj.distancetomylocation/1000).toFixed(2) +' km</h7>';

      var timesHereNumber = '<h1 style="position:absolute; top:80px; left:50%; transform:translate(-50%,0%); font-size:80px; color:white;">'+markersObj.timesthere+'</h4>';
      var timesHereDiv    = '<div class="close'+distanceIndex+'" style="position:absolute; width:140px; height:140px; top:70px; left:50%; transform:translate(-50%,0%); border-radius:100px;"></div>';
      var timesHereText   = '<h7 style="position:absolute; top:180px; left:50%; transform:translate(-50%,0%); color:white;">Times Here</h7>';
      var timeText        = '<h7 style="position:absolute; width:100%; bottom:15px; left:0px; text-align:center;">'+this.getCorrectTime(markersObj.hours, markersObj.minutes)+'</h7>';

      var image    = '<img src="assets/imgs/location.png" style="position:absolute; opacity:0.1; z-index:0;height:100px;top:65%; right:-2%; overflow: hidden;" />'
      var popupDiv = '<div style="width:200px;height:250px;">'+image+locationName+timeString+timesHereDiv+timesHereNumber+timesHereText+timeText+'</div>';

      marker.bindPopup(popupDiv);
      this.myLocationLayer = marker;
      return this.myLocationLayer;
    }

    ///////////////CREATE MARKERS///////////////
    //parse my location marker information
    myLocationInfoMarker(data, iconInstance){
      //create myLocation marker
      var latLng = this.mapLeafletProvider.createLeafletLatLng(data[0].lat, data[0].lng);
      var marker = this.mapLeafletProvider.createLeafletMarker(latLng, iconInstance);

      //create myLocation popover
      var imageMapBkg  = '<img src="assets/imgs/map.jpg" style="position:absolute; z-index:0; width:220px; height:80px; top:50px; right:10px; border-radius:10px; border:1px solid black;" />';
      var popupTitle   = "<h1 style='position:absolute; top:0px; left:40px;' >You are here!</h1>";
      var popupStreet  = "<h6 style='position:absolute; top:40px; text-align:right; right:15px; max-width:220px; color:white; text-shadow: 0 0 4px #000000, 1px 1px 4px black;' >📍 "+data[0].mylocation+"</h6>";
      this.myPositionTag = (data[0].st_distance <= this.distanceRadius) ? data[0].tags : '';
      var herePlaceText= "<h7 style='position:absolute; top:100px; text-align:right; right:15px; max-width:220px; color:white; text-shadow: 0 0 4px #000000, 1px 1px 4px black;' >🏠 "+this.myPositionTag+"</h7>";
      var nearPlaces   = "<h7 style='position:absolute; top:140px; left:10px; '>Near Places:</h7>";
      var startIndex = (this.myPositionTag=='') ? 0 : 1, size = (this.myPositionTag=='') ? 3 : 4, listClosestPlaces = '<div style="position:absolute; top:160px; text-align:left;">';
      for(var index = startIndex; index < size; index++){
        listClosestPlaces += '<div style="position:relative;display:block; margin-top:5px;"><img src="assets/imgs/location.png" style="display:inline-block; width:10px;" /> <h7 style=" display:inline-block;">'+data[index].tags+' ('+(data[index].st_distance/1000).toFixed(2)+' km)</h7></div>';
      }
      listClosestPlaces += '</div>';
      var image        = '<img src="'+iconInstance.options.iconUrl+'" style="position:absolute; opacity:0.1; z-index:0;height:100px;top:57%; right:-2%;overflow: hidden;" />';
      var divContainer = "<div style='width:200px;height:200px;' >"+imageMapBkg+popupTitle+popupStreet+image+herePlaceText+nearPlaces+listClosestPlaces+ "</div>";
      marker.bindPopup(divContainer);

      return marker;
    }

    ///////////////UPDATE MARKERS POPUPS///////////////
    //update my current location popup
    updateMyLocationPopup(lat, lng){
      this.mapProvider.loadMyLocationInfo(this.serverUrl, lat, lng)
      .then(data => {
        if(data.length != 0 && data != null){
          let iconInstance = this.mapLeafletProvider.createLeafletIcon('assets/imgs/youAreHerePhoneMarker.png', 'assets/imgs/markerShadow.png', [38, 38], [30, 30], [22, 42], [4, 30], [-0, -40]);
          let myPositionMarker = this.myLocationInfoMarker(data, iconInstance);
          myPositionMarker.addTo(this.map);
          this.mapLeafletProvider.setLeafletMapView(this.map, lat, lng, 15);
          this.myPosition = [lat, lng];
          $('#findMyLocationMarker').css('visibility', 'visible');
          this.cardsProvider.load(this.serverUrl, lat, lng, this.myPositionTag, this.distanceLocation).then(data => {
            this.updateCards(data);
          });
        }
      });
    }

    ///////////////UPDATE CARDS///////////////
    //update Cards
    updateCards(data){
      var data = JSON.parse(data['_body']);

      if (data.length == 0)
        return;

      //currentPlaceCard
      var inLocation       = (data[0].st_distance < this.distanceRadius) ? true : false ;
      var currentAddress   =  data[0].mylocation;
      var myCurrentAddress = data[0].mylocation.split(',');
      var titleContent;
      if (myCurrentAddress[0]!='Unknown') {
        titleContent = (inLocation) ?  data[0].tags : myCurrentAddress[1].split(' ')[2] + ', ' + myCurrentAddress[2];
      }else{
        titleContent = 'Unknown';
      }

      var firstTimeHere = 'Never Here', lastTimeHere = '', timesHere = '';
      if (inLocation && data[data.length-1].startdate != null && data[data.length-1].enddate != null) {
        firstTimeHere    =  'From ' + this.convertDate(data[data.length-1].startdate);
        lastTimeHere     =  ' to '  + this.convertDate(data[data.length-1].enddate);
        timesHere        =  data[data.length-1].timesthere + ' Times Here';
      }


      //UPDATE data
      $('#locationSectionPlace').html(titleContent);
      $('#locationSectionAddress').html(currentAddress);
      $('#locationSectionTime').html(firstTimeHere + lastTimeHere);
      $('#locationSectionTimesHere').html(timesHere);



      //closestPlacesCard
      var size = Math.min(data.length-1, 15);
      console.log(data);
      if(data.length != 0) $('#closestPlacesNotAvailable').remove();
      for (let currentImage, currentLocation, index = (inLocation) ? 1 : 0; index < size; index++) {
        currentImage    = '<img src="assets/imgs/location.png" style="display:inline-block; width:15px;" />';
        currentLocation = '<p style="width:78%; display:inline-block;margin:4%;">'+currentImage + ' ' + data[index].tags+'</p><p style="position:absolute; right:0px; top:0px;margin:2%;">'+ ' ('+(data[index].st_distance/1000).toFixed(2)+ ' km)</p>';
        $($('.locationItem')[index]).html(currentLocation);
        $($('.locationItem')[index]).attr('lat', data[index].placelat);
        $($('.locationItem')[index]).attr('lng', data[index].placelng);
        $($('.locationItem')[index]).css('display', 'block');
        //'<div class="locationItem" style="position:relative;display:block;margin-top:15px;" lat="'+data[index].placelat+'" lng="'+data[index].placelng+'">' + currentLocation+'<img src="assets/imgs/find.png" style="position:absolute; right:0px; top:0px; width:15px;" /></div>';

        //UPDATE position
        $($('.locationItem')[index]).css('margin', '0%');
      }

      //$($('#closestPlacesCard ion-card-content p')[0]).html(list);

      this.cardsProvider.loadLifeData(this.serverUrl, data[data.length-1].enddate).then(data => {
          data = JSON.parse(data['_body']);
          console.log(data);
          if (data.length == 0)
            return;

          var hourBlocks = '<div>';
          for (let index = 0,fontType, currentInitialHour, currentFinalHour, currentActivity, currentColor, currentTextColor, currentHourSize, currentSize, currentDiv, initialMinutes, initialHours, finalHours, finalMinutes; index < data.length; index++) {
            //life color
            if (data[index]['type'] == 'Span'){        currentColor = 'rgba(255,171,86,0.5)';  currentTextColor = 'rgba(128,103,77,0.5)';}
            else if (data[index]['type'] == 'Subspan'){currentColor = 'rgba(255,227,175,0.5)'; currentTextColor = 'rgba(176,157,122,0.5)';}
            else if (data[index]['type'] == 'Trip'){   currentColor = 'rgba(183,218,0,0.5)';   currentTextColor = 'rgba(100,109,54,0.5)';}

            //life size
            currentHourSize = parseInt(data[index]['finalhour']) - parseInt(data[index]['initialhour']);

            //get initial hour
            initialHours = data[index]['initialhour'];
            if      (initialHours.toString().length == 1){ initialMinutes = '0'+initialHours; initialHours = '00';
            }else if(initialHours.toString().length == 2){ initialMinutes = initialHours.toString()[0] + initialHours.toString()[1], initialHours = '00';
            }else if(initialHours.toString().length == 3){ initialMinutes = initialHours.toString()[1] + initialHours.toString()[2]; initialHours = '0'+initialHours.toString()[0];
            }else if(initialHours.toString().length == 4){ initialMinutes = initialHours.toString()[2] + initialHours.toString()[3]; initialHours = initialHours.toString()[0] + initialHours.toString()[1];}

            //get final hour
            finalHours = data[index]['finalhour'];
            if      (finalHours.toString().length == 1){ finalMinutes = '0' + finalHours; finalHours = '00';
            }else if(finalHours.toString().length == 2){ finalMinutes = finalHours.toString()[0] + finalHours.toString()[1]; finalHours = '00';
            }else if(finalHours.toString().length == 3){ finalMinutes = finalHours.toString()[1] + finalHours.toString()[2]; finalHours = '0'+finalHours.toString()[0];
            }else if(finalHours.toString().length == 4){ finalMinutes = finalHours.toString()[2] + finalHours.toString()[3]; finalHours = finalHours.toString()[0] + finalHours.toString()[1];}

            //get div size
            currentSize = data[index]['hour'] * 35 + (data[index]['minutes']/60)*35;
            if (currentSize < 35) currentSize = 35;

            if (currentSize < 50)      { fontType = 'p'; }
            else if (currentSize < 100){ fontType = 'h2';}
            else if (currentSize > 100){ fontType = 'h1';}

            currentInitialHour = '<p style="position:absolute;color:'+currentTextColor+';top:0px;left:2px;margin:0px;">'+ initialHours + ':' + initialMinutes + '</p>';
            currentFinalHour   = '<p style="position:absolute;color:'+currentTextColor+';bottom:0px;left:2px;margin:0px;">'+ finalHours + ':' + finalMinutes + '</p>';
            currentActivity    = '<'+fontType+' style="position:absolute;left:15%;width:70%;color:'+currentTextColor+';text-align:center;top:50%;transform:translate(0%,-50%); overflow: ellipsis;margin:0px;">'+ data[index]['activity'] + '</'+fontType+'>';
            currentDiv         = '<div style="position:relative;width:100%;height:'+currentSize+'px;margin-top:3px;border-radius:5px;background-color:'+currentColor+';color:'+currentTextColor+';border:1px solid '+currentTextColor+';">'+currentInitialHour+currentFinalHour+currentActivity+'</div>';
            hourBlocks  += currentDiv;
          }
          hourBlocks += '</div>';

          //$($('#lifeDataCard ion-card-content')[0]).html(hourBlocks);
          //$($('#lifeDataCard ion-card-header')[0]).html('📅 Last Day Here '+'('+this.convertDate(data[0]['timestamp'])+')');

          $('#lastDayHereSectionDay').html(this.convertDate(data[0]['timestamp']).split(' ')[0]);
          $('#lastDayHereSectionMonth').html(this.convertDate(data[0]['timestamp']).split(' ')[1] + ' ' + this.convertDate(data[0]['timestamp']).split(' ')[2]);
          //UPDATE div
          $('#lastDayHereSectionDiv').html(hourBlocks);
      });

      this.cardsProvider.loadPhotosData(this.serverUrl, data[data.length-1].enddate, 0).then(data => {
        var contentData = JSON.parse(data['_body']);
        if(contentData.length == 0)
          return;

        var numberOfPhotos = contentData[0].split('/|/').length, imagesSrc = contentData[1].split('/|/');
        var slideShow      = '<div id="slideshow" style="margin: 10px auto;position: relative;width:100%;height:240px;">';
        for (let index = 0; index < numberOfPhotos; index++) {
          slideShow += '<img src="'+imagesSrc[index]+'" style="display:inline-block; max-width:100%; max-height:100%; border-radius:10px; position:absolute; transform:translate(-50%,0%); box-shadow: 0 0 20px rgba(0, 0, 0, 0.4);" />';
        }
        slideShow += '</div>';
        //$('#photosDataCard ion-card-content p').html(slideShow);


        //UPDATE div
        $('#photosSectionDiv').html(slideShow);
        $("#slideshow > img:gt(0)").hide();

        if(this.photosTimer != null)
          clearInterval(this.photosTimer);

        this.photosTimer = setInterval(function() {
          //console.log('change Image');
          $('#slideshow > img:first')
            .fadeOut(1000)
            .next()
            .fadeIn(1000)
            .end()
            .appendTo('#slideshow');
        }, 5000);
      });

    }


    //show markers
    showMarkerDistance(lat, lng){
      var otherPosition = [lat, lng];
      this.map.fitBounds([
        [this.myPosition[0] - 0.005, this.myPosition[1] - 0.005],
        [this.myPosition[0] - 0.005, this.myPosition[1] + 0.005],
        [this.myPosition[0] + 0.005, this.myPosition[1] - 0.005],
        [this.myPosition[0] + 0.005, this.myPosition[1] + 0.005],
        [lat + 0.005, lng + 0.005],
        [lat - 0.005, lng + 0.005],
        [lat + 0.005, lng - 0.005],
        [lat - 0.005, lng - 0.005]
      ]);

      //add new polyline
      if(this.currentRoute == '')
        this.currentRoute = this.mapLeafletProvider.createLeafletRoute(this.myPosition, otherPosition);
      else
        this.mapLeafletProvider.setLeafletWaypoints(this.currentRoute, this.myPosition, otherPosition);

      this.mapLeafletProvider.addLeafletElementToMap(this.map, this.currentRoute);
      $('.leaflet-control-container').remove();
      $('.leaflet-marker-draggable').remove();
    }

    //create map polyline
    createPolyline(lat, lng){
      this.mapLeafletProvider.clearMapPolylines(this.map);
      var line = this.mapLeafletProvider.createLeafletPolyline([this.myPosition, [lat, lng]], 'blue', 3, 0.5, 1);
      this.mapLeafletProvider.addLeafletElementToMap(this.map, line);
    }



    ////////MAP UPDATES///////////
    updateTime(time){
      this.startIntervalTimer(time);
    }

    updateAreaRadius(distance){
      this.distanceLocation = distance*1000;
      this.insertCurrentPosition();
    }

    updateShowArea(showArea){
      this.showArea = showArea;
    }

    updateShowLocations(showLocations){
      this.showLocations = showLocations;
    }



    //ex: 2017:01:31 -> 31 Jan 2017
    convertDate(date){
      var monthAbrevNames = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      var dateArray  = date.split(':');
      var year  = dateArray[0];
      var month = dateArray[1];
      var day   = dateArray[2];

      return day + " " + monthAbrevNames[parseInt(month) - 1] + " " + year;
    }



    getCorrectTime(inputHours, inputMinutes){
      var minutes = 0, hours = 0, days = 0;
      hours   = Math.floor(inputMinutes / 60) + parseInt(inputHours);
      minutes = parseInt(inputMinutes) % 60;
      days  = Math.floor(hours / 24);
      hours = hours % 24;

      return '⏱ '+ days + ' Days, '+ hours +' Hours and '+ minutes +' Minutes';
    }
}
