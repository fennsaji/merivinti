import { HttpHeaders, HttpClient } from "@angular/common/http";
import { Injectable, EventEmitter } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { MemberService } from "./member";
import { Storage } from "@ionic/storage";
import { AuthService } from "./auth";
import "rxjs/add/operator/map";
import "rxjs/add/operator/do";

@Injectable()
export class ChurchService {
  token: string;
  httpOptions : Object;
  leaders: any[];
  requests: any[];
  families: any[];
  members: string;
  followers: string[];
  newNotifications: number;

  public newNotify = new  EventEmitter<number>();
  public notify = new  EventEmitter<any[]>();
  public followReq = new  EventEmitter<any[]>();

  // url : string = 'http://192.168.43.54:8080/church/';
  url: string = 'http://192.168.43.54:8080/church/';

  constructor(private authSer: AuthService,
    private http: HttpClient,
    private storage: Storage,
    private membSer: MemberService) {}

  initialize() {
    this.token = this.authSer.getToken();
    this.httpOptions = {
      headers : new HttpHeaders({
        'x-auth': this.token,
        'Content-type': 'application/json'
      })
    }
    this.getbasicinfo();
    this.getNotifications();
  }

  getbasicinfo() {
    if(this.authSer.isLeader()) {
      return this.http.get<any>(this.url + 'getbasicinfo', this.httpOptions)
        .subscribe(res => {
          console.log('list23', res);
          this.leaders = res.list.leaders;
          this.requests = res.list.requests;
          this.members = res.list.members;
          this.followers = res.list.followers;
          this.newNotifications = res.list.newNotifications;
          this.newNotify.emit(this.newNotifications);
          this.followReq.emit(this.requests);
          return Promise.resolve();
        }, err => {
          console.log('Errorr');
        });
    }
  }

  getNotifications() {
    if(this.authSer.isLeader()) {
      this.http.get<any>(this.url + 'getNotifications', this.httpOptions)
      .subscribe(res => {
        this.newNotifications = res.list.newNotifications;
        this.requests = res.list.requests;
        this.followReq.emit(this.requests);
        this.newNotify.emit(this.newNotifications);
      }, err => {
        console.log('Errorr1');
      });
    }
  }

  pushNotifications(newNotify) {
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

  getChurchProfile(churchId: string): Observable<any> {
    return this.http.post<any>(this.url + 'getDetails', {churchId}, this.httpOptions)
      .do(Pro => {
        this.storage.set('myChurch', Pro);
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

  removefollower(churchId: string) {
    return this.http.post<any>(this.url + 'removefollower', {churchId}, this.httpOptions)
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
