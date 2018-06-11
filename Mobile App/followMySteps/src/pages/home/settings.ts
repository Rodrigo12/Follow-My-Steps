import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import {MapClass} from '../home/map';
import {MapLeafletProvider} from '../../providers/map/mapLeaflet';

@Component({
  templateUrl: 'settings.html',
  providers: [MapClass, MapLeafletProvider]
})
export class ModalPage {
  showArea;
  showLocations;
  areaRadius;
  updateTime;

  constructor(public viewCtrl: ViewController, params: NavParams) {
    this.showArea      = params.get('showArea');
    this.showLocations = params.get('showLocations');
    this.areaRadius    = params.get('areaRadius');
    this.updateTime    = parseInt(params.get('updateTime'))/60000;
  }

  dismiss(){
    this.viewCtrl.dismiss();
  }

  applyChanges(){
    let outputTime = this.updateTime*60000;
    this.viewCtrl.dismiss([outputTime, this.areaRadius, this.showArea, this.showLocations]);
  }
}
