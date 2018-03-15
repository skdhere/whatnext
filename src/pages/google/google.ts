import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Http, Response} from '@angular/http';
import 'rxjs/add/operator/map';
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

  constructor(public navCtrl: NavController,public http:Http, public navParams: NavParams) {

   let types =['train_station','restaurant','bar','atm','gym'];
   types.forEach(element => {
   
  	this.http.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=19.0049004,72.8236264&radius=500&type='+element+'&key=%20AIzaSyBg1KqM98DIC8TA1ngpS3luuP1A-_aQsfg').map(res => res.json()).subscribe(data => {
		    console.log(data);
		     console.log(data.status);
		      console.log(data.results);
		      Object.keys(data.results).forEach(key=> {
                console.log(data.results[key]['geometry']['location'])  ;     

                let lat ={"lat":data.results[key]['geometry']['location'].lat,"lng":data.results[key]['geometry']['location'].lng,'type':element,'name':data.results[key]['name']};

                this.locations.push(lat);
            });

		});

  		console.log(this.locations);
  		 console.log("===========================");
  		 console.log(element);
  		 console.log("===========================");
		});
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GooglePage');
  }

}
