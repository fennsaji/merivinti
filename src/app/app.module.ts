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

import { AuthService } from '../services/auth';
import { ChurchService } from '../services/church';
// import { ActivitiesService } from '../services/activities';
import { MemberService } from '../services/member';
import { PrayerService } from '../services/prayer';
import { SocialSharing } from '@ionic-native/social-sharing';

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
    Camera,
    AuthService,
    ChurchService,
    // ActivitiesService,
    MemberService,
    PrayerService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
