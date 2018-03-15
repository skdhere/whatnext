import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import { Storage } from '@ionic/storage';
import { Api} from "../../providers/api";
import { Observable } from 'rxjs/Observable';

/**
 * Generated class for the InterestpagePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-interestpage',
  templateUrl: 'interestpage.html',
})
export class InterestpagePage {

  interests:Array<any>=[];
  constructor(public navCtrl: NavController, public navParams: NavParams,public api:Api,
    public storage :Storage, public nativeStorage: NativeStorage) {
  	this.api.post('getInterest', '')
                .map(res => res.json())
                .subscribe( data => {
                    //store data in storage
                    if (data.success == true) {

                       let new_data = data.data[0];
                       for(let i=0;i<new_data.length;i++)
                       {
                       	console.log(new_data[i]['name']);
                       	 let int = {"name":new_data[i]['name'],"display_name":new_data[i]['display_name']};

                       	 this.interests.push(int);
                       }
                    		
                    }
                    else{
                      
                    }
                }, error => {
                 
      });

      console.log(this.interests);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InterestpagePage');
  }

}
