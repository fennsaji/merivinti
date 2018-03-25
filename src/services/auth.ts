import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { ILoginUser } from "../models/loginUser.model";
import { IRegChurch } from "../models/regChurch.model";
import "rxjs/add/operator/map";
// import { IChurch } from "../models/church.model";
import { Storage } from "@ionic/storage";
import { Network } from '@ionic-native/network';
import { Platform, ToastController } from "ionic-angular";
import { FormControl } from "@angular/forms";
import { LocalNotifications } from "@ionic-native/local-notifications";

@Injectable()
export class AuthService {
  // url: string = 'http://192.168.1.35:8080/auth';
  url: string = 'http://192.168.43.54:8080/auth';
  myInfo: {
    token: string,
    username: string,
    churchId: string,
    isLeader: boolean
  };
  onDevice: boolean;

  constructor(private http: HttpClient,
    private network: Network,
    private storage: Storage,
    private localNotifications: LocalNotifications,
    public platform: Platform,
    public toastCtrl: ToastController) {
      this.onDevice = this.platform.is('cordova');
  }

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
      this.scheduleNotification();
      this.saveData(this.myInfo);
      return data.memb;
    });
  }

  checkUsername(control: FormControl): Promise<any> {
    console.log(control.value);
    return new Promise<any>(res => {
      this.http.post<any>('http://192.168.1.35:8080/auth/checkUname', {username: control.value})
        .subscribe((doc) =>{
          console.log(doc);
          if(doc.success) {
            let toast = this.toastCtrl.create({
              message: 'Username already exists',
              duration: 3000
            });
            toast.present();
            res({"Username already exists": true})
          } else {
            res(null)
          }
        }, err => {
          console.log(err);
        })
    })
  }

  regChurch(regChurch: IRegChurch): Observable<any> {
    return this.http.post<any>(this.url + '/regChurch', regChurch).map(data => {
      console.log('response', data);
      this.scheduleNotification();
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
      this.scheduleNotification();
      this.myInfo = {
        token: data.token,
        username: data.username,
        churchId: data.churchId,
        isLeader: data.desig === 'Leader' ? true: false
      };
      console.log(this.myInfo);
      this.saveData(this.myInfo);
      return data.memb;
    });
  }

  scheduleNotification() {
    var date = new Date()
    date.setDate(date.getDate()+1);
    date.setHours(20);
    date.setMinutes(0);
    date.setSeconds(0);
    let notification = {
      id: 1,
      title: 'Praise the Lord!',
      text: 'Don\'t forget to pray today',
      at: date,
      every: 'day'
    };
    this.localNotifications.schedule(notification);
  }

  unscheduleNotification() {
    this.localNotifications.cancelAll()
      .then()
      .catch();
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
    this.storage.set('churchEvents', '');
    this.storage.set('userEvents', '');
    this.storage.set('myProfile', '');
    this.storage.set('myChurch', '');
  }

  saveNewInfo(churchId, isLeader) {
    this.myInfo.churchId = churchId;
    this.myInfo.isLeader = isLeader;
    var myInfo = {
      token: this.myInfo.token,
      username: this.myInfo.username,
      churchId,
      isLeader
    }
    this.storage.set('myInfo', myInfo);
  }

  logout(): Observable<any> {
    let httpOptions = {
      headers : new HttpHeaders({
        'x-auth': this.myInfo.token
      })
    }
    this.unscheduleNotification();
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

  isLeader() {
    return this.myInfo.isLeader;
  }

  getChurchId() {
    return this.myInfo.churchId;
  }

  isOnline(): boolean {
    if(this.onDevice && this.network.type) {
      return this.network.type !== 'none';
    } else {
      return navigator.onLine;
    }
  }

}
// headers.append('Content-Type', 'application/json');
