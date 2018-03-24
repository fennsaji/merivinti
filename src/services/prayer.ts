import { Injectable } from "@angular/core";
import { IPrayerReq } from "../models/prayerReq.model";
import { Storage } from "@ionic/storage";
import { Observable } from "rxjs/Observable";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AuthService } from "./auth";
import "rxjs/add/operator/map";

@Injectable()
export class PrayerService {
  prayerReq : IPrayerReq[];
  token: string;
  httpOptions: Object;
  url: string = 'http://192.168.1.35:8080/prayer/';

  constructor(private storage: Storage, private http: HttpClient, private auth: AuthService) {}

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
