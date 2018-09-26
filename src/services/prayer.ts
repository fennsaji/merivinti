import { ActionSheetController, Platform } from "ionic-angular";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { SocialSharing } from "@ionic-native/social-sharing"
import { Injectable } from "@angular/core";
import { IPrayerReq } from "../models/prayerReq.model";
import { Storage } from "@ionic/storage";
import { Observable } from "rxjs/Observable";
import { AuthService } from "./auth";
import "rxjs/add/operator/map";

@Injectable()
export class PrayerService {
  prayerReq : IPrayerReq[];
  token: string;
  httpOptions: Object;
  // url: string = 'http://192.168.1.35:8080/prayer/';
  url: string;

  constructor(private storage: Storage,
      private http: HttpClient,
      private authSer: AuthService,
      public actionSheet: ActionSheetController,
      private socialSharing: SocialSharing,
      public platform: Platform) {}

  initializeAndGetPr(): Promise<IPrayerReq[]> {
    this.token = this.authSer.getToken();
    this.httpOptions = {
      headers : new HttpHeaders({
        'x-auth': this.token,
        'Content-type': 'application/json'
      })
    }
    this.url = this.authSer.globalUrl + 'prayer/';
    return this.storage.ready()
      .then(() => {
        return this.storage.get('prayerReq')
      })
      .then((pr) => {
        // this.prayerReq = [...pr];
        // return pr;
        if(pr) {
          return pr;
        } else {
          return [];
        }
      });
  }

  loadPrayerReq(): Observable<IPrayerReq[]> {
    return this.http.get<any>(this.url + 'getAllPr', this.httpOptions)
      .map(doc => {
        doc.prayers = this.mapInfoPr(doc.prayers, doc.basicInfo);
        this.storage.set('prayerReq', doc.prayers);
        return doc.prayers;
      })
  }


  mapInfoPr(prayers, basicInfo) {
    prayers = prayers.map(pr => {
      var ind = basicInfo.findIndex(bu => {
          return pr.username === bu.username;
      });
      pr = { ...basicInfo[ind],...pr}
      return pr;
    });
    return prayers;
  }

  sharePr(mssg, subject, url, proPic) {
    const options = this.actionSheet.create(
      {
        title: 'Prayer Request',
        cssClass: 'action-sheets-basic-page',
        buttons: [
          {
            text: 'Whatsapp',
            icon: !this.platform.is('ios') ? 'logo-whatsapp' : null,
            handler: () => {
              this.socialSharing.shareViaWhatsApp(mssg + ' : '+ subject, proPic, url)
              .then(() => {
              })
              .catch(err => {
              });
            }
          },
          {
            text: 'Facebook',
            icon: !this.platform.is('ios') ? 'logo-facebook' : null,
            handler: () => {
              this.socialSharing.shareViaFacebook(mssg + ' : '+ subject, proPic, url)
              .then(() => {
              })
              .catch(err => {
              });

            }
          },
          {
            text: 'Others',
            icon: !this.platform.is('ios') ? 'share' : null,
            handler: () => {
              this.socialSharing.share(mssg, subject, proPic, url)
              .then(() => {
              })
              .catch(err => {
              });
            }
          },
          {
            text: 'Cancel',
            role: 'cancel', // will always sort to be on the bottom
            icon: !this.platform.is('ios') ? 'close' : null,
            handler: () => {
            }
          }
        ]
      }
    );
    options.present();
  }

  loadOldPr(date: string): Observable<IPrayerReq[]> {
    return this.http.post<any>(this.url + 'getByDate', {date}, this.httpOptions)
    .map(doc => {
      doc.prayers = this.mapInfoPr(doc.prayers, doc.basicInfo);
      return doc.prayers;
    })
  }

  addNewPr(newPr: IPrayerReq) {
    return this.http.post<any>(this.url + 'addNew', {newPr} ,this.httpOptions)
  }

  deletePr(id: string) {
    return this.http.post<any>(this.url + 'deletePr', {id} ,this.httpOptions)
  }
}
