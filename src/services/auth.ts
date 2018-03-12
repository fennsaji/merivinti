import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { ILoginUser } from "../models/loginUser.model";
import { IRegChurch } from "../models/regChurch.model";
import { IMembers } from "../models/member.model";
import "rxjs/add/operator/map";
// import { IChurch } from "../models/church.model";
import { Storage } from "@ionic/storage";

@Injectable()
export class AuthService {
  url: string = 'http://192.168.43.54:8080/auth';
  myInfo: {
    token: string,
    username: string,
    churchId: string,
    isLeader: boolean
  };

  constructor(private http: HttpClient, private storage: Storage) {}

  login(loginUser: ILoginUser): Observable<any> {
    return this.http.post<any>(this.url + '/login', loginUser).map(data => {
      console.log('response', data);
      console.log('myInfo', this.myInfo);
      this.myInfo = {
        token: data.token,
        username: data.username,
        churchId: data.churchId,
        isLeader: data.desig === 'Leader' ? true: false
      };
      this.saveData(this.myInfo);
      return data.memb;
    });
  }

  regChurch(regChurch: IRegChurch): Observable<any> {
    return this.http.post<any>(this.url + '/regChurch', regChurch).map(data => {
      console.log('response', data);
      this.myInfo = {
        token: data.token,
        username: data.username,
        churchId: data.churchId,
        isLeader: data.desig === 'Leader' ? true: false
      };
      this.saveData(this.myInfo);
      return data;
    });
  }

  regMember(regMemb: IRegChurch): Observable<any> {
    return this.http.post<any>(this.url + '/regMemb', regMemb).map(data => {
      console.log('response', data);
      this.myInfo = {
        token: data.token,
        username: data.username,
        churchId: data.churchId,
        isLeader: data.desig === 'Leader' ? true: false
      };
      this.saveData(this.myInfo);
      return data.memb;
    });
  }

  isAuthenticated(): Promise<boolean> {
    return this.storage.ready().then(() => {
      return this.storage.get('myInfo').then(data => {
        console.log('isAUth', data);
        this.myInfo = data;
        console.log('isAUth', this.myInfo);
        return data? true: false;
      }).catch(err => {
        console.log('errror', err);
        return false;
      });
    });
  }

  saveData(myInfo) {
    console.log('myInfo ', myInfo);
    this.storage.set('myInfo', myInfo);
    this.storage.set('prayerReq', '');
    this.storage.set('events', '');
    this.storage.set('myProfile', '');
    this.storage.set('myChurch', '');
  }

  logout(): Observable<any> {
    let httpOptions = {
      headers : new HttpHeaders({
        'x-auth': this.myInfo.token
      })
    }
    this.removeData();
    if(this.myInfo.isLeader) {
      return this.http.delete(this.url + '/logoutLead', httpOptions);
    } else {
      return this.http.delete(this.url + '/logoutMemb', httpOptions);
    }
  }

  removeData(): void {
    this.myInfo = {
      token: '',
      username: '',
      churchId: '',
      isLeader: false
    };
    this.storage.remove('myInfo');
    this.storage.remove('prayerReq');
    this.storage.remove('events');
    this.storage.remove('myProfile');
    this.storage.remove('myChurch');
  }

  getToken(): string {
    return this.myInfo.token;
  }

  getUsername(): string {
    return this.myInfo.username;
  }

  getChurchId(): string {
    return this.myInfo.churchId;
  }

  isLeader(): boolean {
    return this.myInfo.isLeader;
  }
}
// headers.append('Content-Type', 'application/json');
