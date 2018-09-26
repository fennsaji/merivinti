import { AuthService } from './auth';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { FirebaseApp } from 'angularfire2';


@Injectable()
export class MessagingService {
  token : string;
  url: string;
  private messaging;
  private unsubscribeOnTokenRefresh = () => {};

  constructor(
    private app: FirebaseApp,
    private http: HttpClient,
    private authSer : AuthService
  ) {
    this.token = this.authSer.getToken();
    this.url = this.authSer.globalUrl;
  }

  initMessaging() {
    this.messaging = this.app.messaging();
    this.messaging.usePublicVapidKey("BPGdlj1GXu_gWqy-2OJJiV9k-NFlh1rUud_A_gZsys_TNrC2HmffLtWjE-ZpeZiCts-LxsXoo1Yyc-Mu675zgKg");
    navigator.serviceWorker.register('service-worker.js').then((registration) => {
      this.messaging.useServiceWorker(registration);
      this.enableNotifications();
  });
  }

  enableNotifications() {
    return this.messaging.requestPermission().then(() => {
        // token might change - we need to listen for changes to it and update it
        this.setupOnTokenRefresh();
        return this.updateToken();
      });
  }

  disableNotifications() {
    this.unsubscribeOnTokenRefresh();
    this.unsubscribeOnTokenRefresh = () => {};
    return;
  }

  private updateToken() {
    return this.messaging.getToken().then((currentToken) => {
      if (currentToken) {
        // we've got the token from Firebase, now let's store it in the database
        // return this.storage.set('fcmToken', currentToken);
        let httpOptions = {
          headers: new HttpHeaders({
            "x-auth": this.token,
            "Content-type": "application/json"
          })
        };
    
        return this.http
          .post<any>(
            this.url + "notify/regtoken",
            { regToken: currentToken },
            httpOptions
          ).subscribe(() => {console.log("")});
          
      }
    });
  }

  private setupOnTokenRefresh(): void {
    this.unsubscribeOnTokenRefresh = this.messaging.onTokenRefresh(() => {
      this.updateToken();
    });
  }
    
}