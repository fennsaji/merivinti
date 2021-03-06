import { AppUpdate } from "@ionic-native/app-update";
import { Injectable } from "@angular/core";
// import { Platform, ActionSheetController } from "ionic-angular";
// import { PrayerService } from "./prayer";
import { ToastController } from "ionic-angular";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AuthService } from "./auth";
import { FCM } from "@ionic-native/fcm";

@Injectable()
export class ActivitiesService {
  token;
  url;

  constructor(
    private http: HttpClient,
    private authSer: AuthService,
    private fcm: FCM,
    private appUpdate: AppUpdate,
    public toastCtrl: ToastController // public platform: Platform, // public actionSheet: ActionSheetController, // private prayerSer: PrayerService
  ) {}

  initialize() {
    this.token = this.authSer.getToken();
    this.url = this.authSer.globalUrl;

    if(this.authSer.ifonDevice())
      this.fcmNotificationInit();

    this.onUpdate();
  }

  subFcmChurch() {
    var churchId = this.authSer.getChurchId();
    if (churchId) this.fcm.subscribeToTopic(churchId);
  }

  unSubFcmChurch() {
    var churchId = this.authSer.getChurchId();
    if (churchId) this.fcm.unsubscribeFromTopic(churchId);
  }

  fcmNotificationInit() {
    this.subFcmChurch();
    this.fcm.subscribeToTopic("All");

    this.fcm.getToken().then(token => {
      let httpOptions = {
        headers: new HttpHeaders({
          "x-auth": this.token,
          "Content-type": "application/json"
        })
      };

      this.http
        .post<any>(
          this.url + "notify/regtoken",
          { regToken: token },
          httpOptions
        )
        .subscribe(
          data => {
          },
          err => {
          }
        );
    });

    this.fcm.onNotification().subscribe(data => {
      if (data.wasTapped) {
        console.info("Received in background");
      } else {
        console.info("Received in foreground");
      }
    });

    this.fcm.onTokenRefresh().subscribe(token => {
      let httpOptions = {
        headers: new HttpHeaders({
          "x-auth": this.token,
          "Content-type": "application/json"
        })
      };
      this.http
        .post<any>(
          this.url + "notify/regtoken",
          { regToken: token },
          httpOptions
        )
        .subscribe(
          data => {
          },
          err => {
          }
        );
    });
  }

  onUpdate() {
    if (this.authSer.ifonDevice()) {
      const updateUrl = this.authSer.globalUrl + "update.xml";
      this.appUpdate.checkAppUpdate(updateUrl).then(() => {});
    }
  }
}
