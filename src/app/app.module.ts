import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from "@angular/common/http";
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { IonicStorageModule } from "@ionic/storage";
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ReactiveFormsModule } from '@angular/forms';
import { Network } from "@ionic-native/network";
import { Camera } from '@ionic-native/camera';
import { AppUpdate } from '@ionic-native/app-update';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { AppVersion } from '@ionic-native/app-version';

import { AuthService } from '../services/auth';
import { ChurchService } from '../services/church';
import { MemberService } from '../services/member';
import { PrayerService } from '../services/prayer';
import { SocialSharing } from '@ionic-native/social-sharing';
// import { ActivitiesService } from '../services/activities';

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    IonicStorageModule.forRoot(),
    IonicModule.forRoot(MyApp, {
      preloadModules: true
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    SocialSharing,
    Network,
    AppUpdate,
    Camera,
    AppVersion,
    LocalNotifications,
    AuthService,
    ChurchService,
    MemberService,
    PrayerService,
    // ActivitiesService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
