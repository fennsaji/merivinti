import { Component, ViewChild, OnInit } from '@angular/core';
import { Platform, NavController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

// import { TabsPage } from '../pages/tabs/tabs';
import { HomePage } from '../pages/auth/home/home';
import { AuthService } from '../services/auth';
// import { PrayersPage } from '../pages/prayers/prayers';
import { MemberPage } from '../pages/profile/member/member';

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
      if(this.authser.isAuthenticated()) {
        console.log('Setting Member');
        this.navCtrl.setRoot(MemberPage);
      } else {
        console.log('Setting Home');
        this.navCtrl.setRoot(HomePage);
      }
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  ngOnInit() {
  }
}
