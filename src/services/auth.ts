import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { ILoginUser } from "../models/loginUser.model";
import { IRegChurch } from "../models/regChurch.model";
import { IMembers } from "../models/member.model";
import "rxjs/add/operator/map";
// import { IChurch } from "../models/church.model";
import { Storage } from "@ionic/storage";
import { Platform, ToastController } from "ionic-angular";
import { FormControl } from "@angular/forms";

@Injectable()
export class AuthService {
  // url: string = 'http://192.168.1.34:8080/auth';
  url: string = 'http://192.168.43.54:8080/auth';
  myInfo: {
    token: string,
    username: string,
    churchId: string,
    isLeader: boolean
  };
  onDevice: boolean;

  constructor(private http: HttpClient,
    // private network: Network,
    private storage: Storage,
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
      this.saveData(this.myInfo);
      return data.memb;
    });
  }

  checkUsername(control: FormControl): Promise<any> {
    console.log(control.value);
    return new Promise<any>(res => {
      this.http.post<any>('http://192.168.1.34:8080/auth/checkUname', {username: control.value})
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

  checkChurchId(control: FormControl): Promise<any> {
    console.log(control.value);
    return new Promise<any>(res => {
      this.http.post<any>('http://192.168.1.34:8080/auth/checkChurch', {churchId: control.value})
        .subscribe((doc) =>{
          console.log(doc);
          if(doc.success) {
            let toast = this.toastCtrl.create({
              message: 'ChurchId already exists',
              duration: 3000
            });
            toast.present();
            res({"ChurchId already exists": true})
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

  isOnline() {
    // if(this.onDevice && Network.type)
  }
}
// headers.append('Content-Type', 'application/json');
