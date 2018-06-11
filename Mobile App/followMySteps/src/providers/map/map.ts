import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class MapProvider {
  data      = '';

  constructor(public http: Http) {  }

  load(serverUrl, myPosition, distanceToLocation) {
    //console.log('load: ' + serverUrl + ' params: '+ [myPosition, distanceToLocation]);
    if (this.data) {
      return Promise.resolve(this.data);
    }
    return new Promise(resolve => {
      this.http.get(serverUrl+'map/'+[myPosition, distanceToLocation])//use to build ios apps
      //this.http.get('mobile/'+'map/'+[myPosition, distanceToLocation])//use to build on ionic serve
        .map(res => res.json())
        .subscribe(
          data => { resolve(data);},
          err => {console.log(err);}
        )
    });
  }

  loadMyLocationInfo(serverUrl, lat, lng) {
    //console.log('loadMyLocationInfo: ' + serverUrl + ' params: '+ [lat, lng]);
    if (this.data) {
      return Promise.resolve(this.data);
    }
    return new Promise(resolve => {
      this.http.get(serverUrl+'popup/'+['myLocation', lat,lng])//use to build ios apps
      //this.http.get('mobile/'+'popup/'+['myLocation', lat,lng])//use to build on ionic serve
        .map(res => res.json())
        .subscribe(
          data => {resolve(data);},
          err =>  {console.log(err);}
        )
    });
  }

}
