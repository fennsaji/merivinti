import { HttpHeaders, HttpClient } from "@angular/common/http";
import { Injectable, EventEmitter } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { MemberService } from "./member";
import { Storage } from "@ionic/storage";
import { AuthService } from "./auth";
import "rxjs/add/operator/map";
import "rxjs/add/operator/do";
import { PrayerService } from "./prayer";
import { Events } from "ionic-angular";

@Injectable()
export class ChurchService {
  token: string;
  httpOptions : Object;
  churchName: string;
  proPic: string;
  leaders: any[] = [];
  requests: any[] = [];
  families: any[] = [];
  members: string;
  followers: string[] = [];
  newNotifications: number;

  public notify = new  EventEmitter<any[]>();
  public followReq = new  EventEmitter<any[]>();

  // url : string = 'http://192.168.43.54:8080/church/';
  url: string = 'http://192.168.1.35:8080/church/';

  constructor(private authSer: AuthService,
    private http: HttpClient,
    private storage: Storage,
    public events: Events,
    private membSer: MemberService) {}

  initialize() {
    this.token = this.authSer.getToken();
    this.httpOptions = {
      headers : new HttpHeaders({
        'x-auth': this.token,
        'Content-type': 'application/json'
      })
    }
    console.log('church initializes');
    this.getbasicinfo();
    this.getNotifications();
  }

  getbasicinfo() {
    if(this.authSer.isLeader()) {
      console.log('church initilizes leader');
      return this.http.get<any>(this.url + 'getbasicinfo', this.httpOptions)
        .subscribe(res => {
          console.log('list23', res);
          this.leaders = res.list.leaders;
          this.requests = res.list.requests;
          this.members = res.list.members;
          this.churchName = res.list.churchName;
          this.proPic = res.list.proPic;
          this.followers = res.list.followers;
          this.newNotifications = res.list.newNotifications;
          console.log('1233', this.newNotifications);
          this.events.publish('churchNotify:updated', this.newNotifications);
          this.followReq.emit(this.requests);
          return Promise.resolve();
        }, err => {
          console.log('Errorr');
        });
    }
  }

  updateProfile(updatedPro) {
    return this.http.put<any>(this.url + 'updatePro', {updatedPro}, this.httpOptions);
  }

  getNotifications() {
    if(this.authSer.isLeader()) {
      this.http.get<any>(this.url + 'getNotifications', this.httpOptions)
      .subscribe(res => {
        this.requests = res.list.requests;
        console.log(this.requests);
        this.followReq.emit(this.requests);
      }, err => {
        console.log('Errorr1');
      });
    }
  }

  pushNotifications(newNotify) {
    console.log(newNotify);
    if(this.authSer.isLeader()) {
      return this.http.post<any>(this.url + 'pushNotifications', {newNotify}, this.httpOptions)
        .map(res => {
          console.log('successss');
          return res;
        }, err => {
          console.log('Errorr1');
        });
    }
  }

  deleteNewNotify() {
    if(this.authSer.isLeader()) {
      this.http.delete<any>(this.url + 'newNotifications', this.httpOptions)
        .subscribe(res => {
          console.log('successss');
          this.newNotifications = 0;
          this.events.publish('churchNotify:updated', this.newNotifications);
        }, err => {
          console.log('Errorr1');
        });
    }
  }

  getInfoFollowers(churchId: string) {
    return this.http.post<any>(this.url + 'getInfoFollowers', {churchId}, this.httpOptions);
  }

  getInfoMembers(churchId: string) {
    return this.http.post<any>(this.url + 'getInfoMembers', {churchId}, this.httpOptions);
  }

  getInfoLeaders(churchId: string) {
    return this.http.post<any>(this.url + 'getInfoLeaders', {churchId}, this.httpOptions);
  }

  getChurchName() {
    return this.churchName;
  }

  getProPic() {
    return this.proPic;
  }

  getPrStorage() {
    return this.storage.ready()
    .then(() => {
      return this.storage.get('myChurch')
    })
    .then((Pro) => {
      console.log('1', Pro);
      if(Pro) {
        return Pro;
      } else {
        return [];
      }
    });
  }

  searchChurch(search: string) {
    return this.http.post<any>(this.url + 'search', {search}, this.httpOptions)
      .map(data => data.churches);
  }

  getChurchProfile(churchId: string, isMyChurch: boolean): Observable<any> {
    return this.http.post<any>(this.url + 'getDetails', {churchId}, this.httpOptions)
      .map(Pro => {
        if(isMyChurch) {
            this.churchName = Pro.church.churchName;
            this.proPic = Pro.church.proPic;
            this.storage.set('myChurch', Pro);
        }
        // Pro.prayerReq = this.prayerSer.mapInfoPr(Pro.prayerReq, [...Pro.basicInfo,{
        //   // name: this.membSer.getName(),
        //   // proPic: this.membSer.getProPic(), //Leaders Info
        //   // username: this.authSer.getUsername()
        // }]);
        return Pro;
      });
  }


  // Church
  followChurch(churchId: string) {
    return this.http.post<any>(this.url + 'followReq', {churchId}, this.httpOptions)
      .do(res => {
        this.membSer.getbasicinfo();
        return res;
      });
  }

  unfollowChurch(churchId: string) {
    return this.http.post<any>(this.url + 'unfollow', {churchId}, this.httpOptions)
      .do(res => {
        this.membSer.getbasicinfo();
        return res;
      });
  }

  handlefollowReq(username: string, approval: boolean) {
    return this.http.post<any>(this.url + 'handlefollowReq', {username, approval}, this.httpOptions)
      .do(res => {
        this.getbasicinfo();
        return res;
      });
  }

  cancelfollowReq(churchId: string) {
    return this.http.post<any>(this.url + 'cancelfollowReq', {churchId}, this.httpOptions)
      .do(res => {
        this.membSer.getbasicinfo();
        return res;
      });
  }

  removefollower(username: string) {
    return this.http.post<any>(this.url + 'removefollower', {username}, this.httpOptions)
    .do(res => {
      this.getbasicinfo();
      return res;
    });
  }

  // Member
  sendMembReq(churchId: string) {
    return this.http.post<any>(this.url + 'sendMembReq', {churchId}, this.httpOptions)
    .do(res => {
      this.membSer.getbasicinfo();
      return res;
    });
  }

  handleMembReq(username: string, approval: boolean) {
    return this.http.post<any>(this.url + 'handleMembReq', {username, approval}, this.httpOptions)
    .do(res => {
      this.getbasicinfo();
      return res;
    });
  }

  cancelMembReq(churchId: string) {
    return this.http.post<any>(this.url + 'cancelMembReq', {churchId}, this.httpOptions)
      .do(res => {
        this.membSer.getbasicinfo();
        return res;
      });
  }

  unmember() {
    return this.http.delete<any>(this.url + 'unmember', this.httpOptions)
    .do(res => {
      this.membSer.getbasicinfo();
      return res;
    });
  }

  removeMember(username: string) {
    return this.http.post<any>(this.url + 'removeMember', {username}, this.httpOptions)
      .do(res => {
        this.getbasicinfo();
        return res;
      });
  }

  // Leader
  addAsLeader(username: string) {
    return this.http.post<any>(this.url + 'addAsLeader', {username}, this.httpOptions)
      .do(res => {
        this.getbasicinfo();
        return res;
      });
  }

  removeLeader(username: string) {
    return this.http.post<any>(this.url + 'removeLeader', {username}, this.httpOptions)
      .do(res => {
        this.getbasicinfo();
        return res;
      });
  }

  promoteLeader(username: string) {
    return this.http.post<any>(this.url + 'promoteLeader', {username}, this.httpOptions)
      .do(res => {
        this.getbasicinfo();
        return res;
      });
  }

  addFamiliy(newfly) {
    return this.http.post<any>(this.url + 'addFamiliy', {newfly}, this.httpOptions)
      .do(res => {
        this.getbasicinfo();
        return res;
      });
  }
}
