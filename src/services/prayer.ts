import { Injectable } from "@angular/core";
import { IPrayerReq } from "../models/prayerReq.model";
import { Storage } from "@ionic/storage";
import { Observable } from "rxjs/Observable";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AuthService } from "./auth";
import "rxjs/add/operator/map";
import { ActionSheetController, Platform } from "ionic-angular";
import { SocialSharing } from "@ionic-native/social-sharing"

@Injectable()
export class PrayerService {
  prayerReq : IPrayerReq[];
  token: string;
  httpOptions: Object;
  // url: string = 'http://192.168.1.35:8080/prayer/';
  url: string = 'http://192.168.43.54:8080/prayer/';

  constructor(private storage: Storage,
      private http: HttpClient,
      private auth: AuthService,
      public actionSheet: ActionSheetController,
      private socialSharing: SocialSharing,
      public platform: Platform) {}

  initializeAndGetPr(): Promise<IPrayerReq[]> {
    this.token = this.auth.getToken();
    this.httpOptions = {
      headers : new HttpHeaders({
        'x-auth': this.token,
        'Content-type': 'application/json'
      })
    }
    return this.storage.ready()
      .then(() => {
        return this.storage.get('prayerReq')
      })
      .then((pr) => {
        console.log('1', pr);
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
        console.log('loading....', doc.prayers);
        // doc.prayers = this.mapInfoPr(doc.prayers, doc.basicInfo);
        this.storage.set('prayerReq', doc.prayers);
        return doc.prayers;
      })
  }


  // mapInfoPr(prayers, basicInfo) {
  //   prayers = prayers.map(pr => {
  //     var ind = basicInfo.findIndex(bu => {
  //         return pr.username === bu.username;
  //     });
  //     console.log(ind);
  //     pr = { ...basicInfo[ind],...pr}
  //     console.log('pr1', pr);
  //     return pr;
  //   });
  //   console.log('mappped', prayers);
  //   return prayers;
  // }

  sharePr(mssg, subject, url) {
    const options = this.actionSheet.create(
      {
        title: 'Prayer Request',
        cssClass: 'action-sheets-basic-page',
        buttons: [
          {
            text: 'Whatsapp',
            icon: !this.platform.is('ios') ? 'logo-whatsapp' : null,
            handler: () => {
              this.socialSharing.shareViaWhatsApp(mssg + ' : '+ subject, null, null)
              .then(() => {
                console.log('shared');
              })
              .catch(err => {
                console.log('not shared');
              });
            }
          },
          {
            text: 'Facebook',
            icon: !this.platform.is('ios') ? 'logo-facebook' : null,
            handler: () => {
              console.log('Play clicked');
              this.socialSharing.shareViaFacebook(mssg + ' : '+ subject, null, null)
              .then(() => {
                console.log('shared');
              })
              .catch(err => {
                console.log('not shared');
              });

            }
          },
          {
            text: 'Others',
            icon: !this.platform.is('ios') ? 'share' : null,
            handler: () => {
              this.socialSharing.share(mssg, subject, null, null)
              .then(() => {
                console.log('shared');
              })
              .catch(err => {
                console.log('not shared');
              });
              console.log('Play clicked');
            }
          },
          {
            text: 'Cancel',
            role: 'cancel', // will always sort to be on the bottom
            icon: !this.platform.is('ios') ? 'close' : null,
            handler: () => {
              console.log('Cancel clicked');
            }
          }
        ]
      }
    );
    options.present();
  }

  loadOldPr(date: string): Observable<IPrayerReq[]> {
    console.log('called load');
    return this.http.post<any>(this.url + 'getByDate', {date}, this.httpOptions)
    .map(doc => {
      console.log(doc);
      // doc.prayers = this.mapInfoPr(doc.prayers, doc.basicInfo);
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
