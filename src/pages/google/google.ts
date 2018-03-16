import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Http, Response} from '@angular/http';
import 'rxjs/add/operator/map';
import {
 GoogleMaps,
 GoogleMap,
 GoogleMapsEvent,
 GoogleMapOptions,
 CameraPosition,
 MarkerOptions,
 Marker
} from '@ionic-native/google-maps';
/**
 * Generated class for the GooglePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-google',
  templateUrl: 'google.html',
})
export class GooglePage {

  posts:any;
  locations:Array<any> = [];
  map: GoogleMap;

  constructor(public navCtrl: NavController,public http:Http, public navParams: NavParams) {

   let types =['train_station','restaurant','bar','atm','gym'];
   types.forEach(element => {
   
  	this.http.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=19.0049004,72.8236264&radius=500&type='+element+'&key=%20AIzaSyBg1KqM98DIC8TA1ngpS3luuP1A-_aQsfg').map(res => res.json()).subscribe(data => {
		    // console.log(data);
		    //  console.log(data.status);
		    //   console.log(data.results);
		      Object.keys(data.results).forEach(key=> {

                // console.log(data.results[key])  ;     

                let lat ={"lat":data.results[key]['geometry']['location'].lat,"lng":data.results[key]['geometry']['location'].lng,'type':element,'name':data.results[key]['name'],'icon':data.results[key]['icon']};

                this.locations.push(lat);
            });

		});

		});

   console.log(this.locations);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GooglePage');
    this.loadMap();
  }

  loadMap() {

    let mapOptions: GoogleMapOptions = {
      camera: {
        target: {
          lat: 19.07598,
          lng: 72.87766
        },
        zoom: 25,
        tilt: 30
      }
    };

    this.map = GoogleMaps.create('map_canvas', mapOptions);

    // Wait the MAP_READY before using any methods.
    this.map.on(GoogleMapsEvent.MAP_READY).subscribe(() => {console.log('Map is ready!')});
    this.map.one(GoogleMapsEvent.MAP_READY)
      .then(() => {
        console.log('Map is ready!');

        // Now you can use all methods safely.

        for(let k=1 ;k<this.locations.length;k++){

            let image = {
                url: this.locations[k].icon,
                size: {
                  width: 25,
                  height: 25
                }
                // This marker is 20 pixels wide by 32 pixels high.
               
              };

            let loc = this.locations[k];
            this.map.addMarker({
              title: loc.name,
              icon: image,
              animation: 'DROP',
              position: {
                lat: loc.lat,
                lng: loc.lng
              }
            })
            .then(marker => {
              marker.on(GoogleMapsEvent.MARKER_CLICK)
                .subscribe(() => {
                  alert('clicked');
                });
            });
        }
        

      });
  }

}
