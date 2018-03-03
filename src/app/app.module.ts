import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from "@angular/common/http";
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HomePage } from '../pages/auth/home/home';
import { LoginPage } from '../pages/auth/login/login';
import { RegisterPage } from '../pages/auth/register/register';
import { RequestsPage } from '../pages/events/requests/requests';
import { ActivitiesPage } from '../pages/events/activities/activities';
import { ChurchPage } from '../pages/profile/church/church';
import { MemberPage } from '../pages/profile/member/member';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../services/auth';
import { PrayersPage } from '../pages/prayers/prayers';

@NgModule({
  declarations: [
    MyApp,
    TabsPage,
    HomePage,
    LoginPage,
    RegisterPage,
    RequestsPage,
    ActivitiesPage,
    ChurchPage,
    MemberPage,
    PrayersPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
    HomePage,
    LoginPage,
    RegisterPage,
    RequestsPage,
    ActivitiesPage,
    ChurchPage,
    MemberPage,
    PrayersPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AuthService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
