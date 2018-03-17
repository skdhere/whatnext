import { Component } from '@angular/core';
import { Facebook } from '@ionic-native/facebook';
import { NativeStorage } from '@ionic-native/native-storage';
import { NavController, LoadingController, IonicPage } from 'ionic-angular';
import { GooglePlus } from '@ionic-native/google-plus';
import { TwitterConnect } from '@ionic-native/twitter-connect';
import { Storage } from '@ionic/storage';
import { Api} from "../../providers/api";
import { Observable } from 'rxjs/Observable';

@IonicPage()
@Component({
    selector: 'page-login',
    templateUrl: 'login.html',
})
export class LoginPage {
    FB_APP_ID: number = 725261520963213;
    token : any;
    constructor(
        public navCtrl: NavController,
        public fb: Facebook,
        public loadingCtrl: LoadingController,
        public nativeStorage: NativeStorage,
        public googlePlus: GooglePlus,
        public tw: TwitterConnect,
        public storage:Storage,
        public api:Api

        ) {
        this.fb.browserInit(this.FB_APP_ID, "v2.8");
    }

    doFbLogin(){
        let permissions = new Array<string>();
        let nav = this.navCtrl;

        //the permissions your facebook app needs from the user
        permissions = ["public_profile"];

        this.fb.login(permissions)
        .then((response) => {
            let userId = response.authResponse.userID;
            let params = new Array<string>();

        //Getting name and gender properties
        this.fb.api("/me?fields=name,gender,email", params)
                .then((user) => {
                    user.picture = "https://graph.facebook.com/" + userId + "/picture?type=large";

                    console.log(user);
                    this.api.post('login',user)
                    .map(res => res.json())
                    .subscribe( data => {
                        //store data in storage
                        if (data.success == true) {

                           this.token = data.data['token'];
                        }
                        else{
                          
                        }
                    }, error => {
                     
        });

        //now we have the users info, let's save it in the NativeStorage
        this.nativeStorage.setItem('user',
        {
            name: user.name,
            gender: user.gender,
            picture: user.picture,
            loginFlag: 'facebook',
            token :this.token
        })
        .then(() => {
            nav.setRoot('InterestpagePage');
        },(error) => {
            console.log(error);
        })
        })
        }, (error) => {
            console.log(error);
        });
    }

    doGoogleLogin(){
        let nav = this.navCtrl;
        let env = this;
        let loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });
        loading.present();
        this.googlePlus.login({
            'scopes': '', // optional, space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
            'webClientId': '42861637941-32rp9dfllsod9c09j8e28f12f6qjgfb8.apps.googleusercontent.com', // optional clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
            'offline': true
        })
        .then(function (user) {
            loading.dismiss();
            console.log(user);
            env.nativeStorage.setItem('user', {
                name: user.displayName,
                email: user.email,
                picture: user.imageUrl,
                loginFlag: 'google'
            })
            .then(function(){
                nav.push('UserPage');
            }, function (error) {
                console.log(error);
            })
        }, function (error) {
            loading.dismiss();
        });
    }

    doTwLogin(){
        let nav = this.navCtrl;
        let loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });

        loading.present();
        let env = this;
        //Request for login
        this.tw.login().then(function(result) {
            //Get user data
            env.tw.showUser().then(function(user)
            {
                //Save the user data in NativeStorage
                env.nativeStorage.setItem('user',
                {
                    name: user.name,
                    userName: user.screen_name,
                    followers: user.followers_count,
                    picture: user.profile_image_url_https,
                    loginFlag: 'twitter'
                }).then(function() 
                {
                    nav.push('UserPage');
                    loading.dismiss();
                })
            }, function(error)
            {
                loading.dismiss();
            });
        });
    }
}
