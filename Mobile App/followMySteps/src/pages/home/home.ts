import { Component, ViewChild } from '@angular/core';
import { Content, ToastController, LoadingController, ModalController, Platform } from 'ionic-angular';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';

import {MapClass} from '../home/map';
import {MapLeafletProvider} from '../../providers/map/mapLeaflet';
import {MobileConnectionProvider} from '../../providers/mobile-connection/mobile-connection';
import { ModalPage } from '../home/settings';
import * as $ from 'jquery'


@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [MapClass, MapLeafletProvider, MobileConnectionProvider, UniqueDeviceID]
})

export class HomePage {
  @ViewChild(Content) content: Content;
  private loading;
  private serverURL = '';

  public maxClosestPlaces = Array(15).fill(0).map((x,i)=>i);
  public showArea         = false;
  public showLocations    = true;
  public areaRadius       = 2;
  public updateTime       = 300000;//5min

  constructor(public toastCtrl: ToastController, public platform: Platform, private uniqueDeviceID: UniqueDeviceID, public mapClass : MapClass, public mobileConnectionProvider : MobileConnectionProvider, public loadingCtrl: LoadingController, public modalCtrl: ModalController){
  }

  //call code validation
  ionViewDidLoad(): void {
    this.platform.ready().then((readySource) => {
      console.log('ionViewDidLoad');
      this.uniqueDeviceID.get()//get the unique device id
        .then((uuid: any) => {
          console.log('uuid');
          console.log(uuid);
          this.getServerAddress('Server IP and Port', 'Check server IP and Port', uuid);
        })
        .catch((error: any) => {
          console.log(error);
          this.getServerAddress('Server IP and Port', 'Check server IP and Port', null);
        });
      // Platform now ready, execute any required native code
    });

    //  this.serverURL = "http://194.210.159.251:3000/mobile/";
    //   this.mapClass.drawMap(this.serverURL);  //draw map
    //   $('.leaflet-bottom').remove();  //hide leaflet link
  }

  //auto scroll to position
   scrollToPosition(position) {
     setTimeout(() => {
       //console.log('Device UUID is: ' + this.device.uuid);
        this.content.scrollTo(0, position, 1000);
     });
   }

   //pan to position
   goToMyLocation() {
      setTimeout(() => {
        this.mapClass.map.panTo(this.mapClass.myPosition);
      });
    }

  onScroll(evt){
    if (evt == null)
        return;

    if (evt.scrollTop <= 100)
      $('#scrollDown').css('display', 'block');
    else
      $('#scrollDown').css('display', 'none');
  }

  showPath(event, div){
    this.scrollToPosition(0);
    var lat = parseFloat($('#'+div.id).attr('lat'));
    var lng = parseFloat($('#'+div.id).attr('lng'));
    try{
      this.mapClass.showMarkerDistance(lat, lng);
    }catch(err){
      this.mapClass.createPolyline(lat,lng);
    }
  }

  //get server address
  getServerAddress(title, message, mobileUniqueID){
    this.mobileConnectionProvider.checkServer(title, message, mobileUniqueID)
    .then(data => {
      console.log('getServerAddress');
      console.log('title: ' + title + ' message: ' + message);
      console.log(data);
      console.log(data[0]);
      if(data != null){
        if (data[0] == 'Success') {  //if code inserted is correct
          console.log('hurray!');
          this.serverURL = 'http://'+data[1]+':'+data[2]+'/mobile/';
          console.log("serverURL: " + this.serverURL)
          this.getAuthorization('Code', 'See the code on your pc browser (and hurry, you only have one minute)', mobileUniqueID);
        }else{//if code inserted is incorrect
          this.getServerAddress('Wrong IP and/or Port', 'Unable to connect', mobileUniqueID);
        }
      }
    });
  }

  //validate code
  getAuthorization(title, message, mobileUniqueID): void {
    console.log(this.serverURL + mobileUniqueID);
    this.mobileConnectionProvider.connect(this.serverURL, title, message, mobileUniqueID)
    .then(data => {
      console.log(data);
      if(data != null){
        if (data == 'Correct') {  //if code inserted is correct
          this.runLoadingMessage("Loading data...");  //show loading
          this.mapClass.drawMap(this.serverURL);  //draw map
          $('.leaflet-bottom').remove();  //hide leaflet link
        }else{//if code inserted is incorrect
          this.getAuthorization('Wrong Code', 'Try again (Check code on the pc Browser)', mobileUniqueID);
        }
      }
    });
  }

  //run loading message
  runLoadingMessage(message){
    this.loading = this.loadingCtrl.create({
        spinner: 'crescent',
        content: message,
        duration: 5000
      });
      this.loading.present();
  }

  //settings popover (not working)
  presentPopover(myEvent) {
    let modal = this.modalCtrl.create(ModalPage, { showArea :this.showArea, showLocations :this.showLocations, areaRadius :this.areaRadius, updateTime :this.updateTime });

    modal.present({
      ev: myEvent
    });

    modal.onDidDismiss((popoverData) => {
      console.log(popoverData);
      if (popoverData == null)
        return;

      popoverData[0] = (popoverData[0] < 60000) ? 60000 : popoverData[0];//make sure that the update time is always bigger than 1 minute

      this.mapClass.updateTime(popoverData[0]);
      this.mapClass.updateAreaRadius(popoverData[1]);
      this.mapClass.updateShowArea(popoverData[2]);
      this.mapClass.updateShowLocations(popoverData[3]);

      this.updateTime    = popoverData[0];
      this.areaRadius    = popoverData[1];
      this.showArea      = popoverData[2];
      this.showLocations = popoverData[3];

      this.runLoadingMessage('Updating information...');
    });
  }

  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message
    });
    toast.present();
    setTimeout(function(){toast.dismiss();}, 6000);
  }

}
