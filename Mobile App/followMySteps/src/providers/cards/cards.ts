import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';


@Injectable()
export class CardsProvider {
  data = "";

  constructor(public http: Http) {
  }

  //load information to suggested place and closest places cards
  load(serverUrl, lat, lng, tag, distance){
    tag = (tag == '') ? '-' : tag;
    if (this.data) {
      return Promise.resolve(this.data);
    }
    return new Promise(resolve => {
      this.http.get(serverUrl+'cards/'+lat+'/'+lng+'/'+tag+'/'+distance)//use to build ios apps
      //this.http.get('mobile/'+'cards/'+lat+'/'+lng+'/'+tag+'/'+distance)//use to build on ionic serve
        .subscribe(
          data => {
            resolve(data);
          },
           err => {console.log("Error loading cards info:"); console.log(err);}
        )
    });
  }

  //load information for last day card
  loadLifeData(serverUrl, timestamp){
    if (this.data) {
      return Promise.resolve(this.data);
    }
    return new Promise(resolve => {
      this.http.get(serverUrl+'cards/timestamp/'+timestamp)//use to build ios apps
      //this.http.get('mobile/cards/timestamp/'+timestamp)//use to build on ionic serve
        .subscribe(
          data => {
            resolve(data);
          },
           err => {console.log("Error loading LIFE cards info:"); console.log(err);}
        )
    });
  }

  //load information for photos card
  loadPhotosData(serverUrl, timestamp, imagesNumber){
    if (this.data) {
      return Promise.resolve(this.data);
    }
    return new Promise(resolve => {
      this.http.get(serverUrl+'cards/photos/'+timestamp+'/'+imagesNumber)//use to build ios apps
      //this.http.get('mobile/cards/photos/'+timestamp+'/'+imagesNumber)//use to build on ionic serve
        .subscribe(
          data => {
            resolve(data);
          },
           err => {console.log("Error loading Photos cards info:"); console.log(err);}
        )
    });
  }

}
