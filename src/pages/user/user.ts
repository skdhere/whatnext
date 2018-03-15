import { Component } from '@angular/core';
import { NavController ,IonicPage} from 'ionic-angular';
import { Facebook } from '@ionic-native/facebook';
import { NativeStorage } from '@ionic-native/native-storage';
import { GooglePlus } from '@ionic-native/google-plus';
import { TwitterConnect } from '@ionic-native/twitter-connect';
import { Storage } from '@ionic/storage';
import { Api} from "../../providers/api";
import { Observable } from 'rxjs/Observable';

@IonicPage()
@Component({
  selector: 'page-user',
  templateUrl: 'user.html'
})

export class UserPage {

  user: any;
  userReady: boolean = false;
  loginType: string = '';
  constructor(
    public navCtrl: NavController,
    public fb: Facebook,
    public nativeStorage: NativeStorage,
    public googlePlus: GooglePlus,
    public tw: TwitterConnect,
    public api:Api,
    public storage :Storage
  ) {


      this.api.post('getInterest', '')
                .map(res => res.json())
                .subscribe( data => {
                    //store data in storage
                    if (data.success == true) {
                        this.storage.set('user_data', data.data);
                    }
                    else{
                      
                    }
                    
                    console.log(data);
                }, error => {
                    
      });
  }


  ionViewCanEnter(){
    this.nativeStorage.getItem('user')
    .then((data) => {

      if (data.loginFlag == 'google') {
         this.loginType = 'google';
      }
      else if(data.loginFlag == 'facebook')
      {
          this.loginType = 'facebook';
      }
      else
      {
          this.loginType = 'twitter';
      }
      this.user = {
        name: data.name,
        gender: data.gender,
        picture: data.picture
      };
      this.userReady = true;
    }, (error) => {
      console.log(error);
    });
  }

  doFbLogout(){
    var nav = this.navCtrl;
    this.fb.logout()
    .then((response) => {
      //user logged out so we will remove him from the NativeStorage
      this.nativeStorage.remove('user');
      nav.pop();
    }, (error) => {
      console.log(error);
    });
  }

    doGoogleLogout(){
        let nav = this.navCtrl;
        let env = this;
        this.googlePlus.logout()
            .then(function (response) {
            env.nativeStorage.remove('user');
            nav.pop();
        },function (error) {
        console.log(error);
        })
    }

    doTwLogout()
    {
        let nav = this.navCtrl;
        let env = this;
        this.tw.logout().then(function(response)
        {
            env.nativeStorage.remove('user');
            nav.pop();
        }, function (error) 
        {
            console.log(error);
        });
    }

}
