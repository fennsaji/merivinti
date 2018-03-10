import { Component, ViewChild, OnInit } from '@angular/core';
import { Platform, NavController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AuthService } from '../services/auth';


@Component({
  templateUrl: 'app.html'
})
export class MyApp implements OnInit{
  rootPage:any;
  @ViewChild('nav') navCtrl: NavController;

  constructor(platform: Platform,
              statusBar: StatusBar,
              splashScreen: SplashScreen,
              private authser: AuthService) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.authser.isAuthenticated().then(auth => {
        console.log(auth);
        if(auth) {
          this.navCtrl.setRoot('TabsPage');
        } else {
          this.navCtrl.setRoot('HomePage');
        }
      }).catch(e => {
        console.log('error');
      });
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  ngOnInit() {
  }
}
