import { HttpHeaders, HttpClient } from "@angular/common/http";
import { Injectable, EventEmitter } from "@angular/core";
// import { FormControl } from "@angular/forms";
import { Storage } from "@ionic/storage";
import { AuthService } from "./auth";
import "rxjs/add/operator/map";
import "rxjs/add/operator/do";
import "rxjs/Rx";
import "rxjs/add/observable/of";
import { PrayerService } from "./prayer";
import { Events } from "ionic-angular";

@Injectable()
export class MemberService {
  token: string;
  username: string;
  isLeader: boolean;
  name: string;
  proPic: string;
  churchId: string;
  httpOptions : Object;
  friends: string[] = [];
  pendingReq: any[] = [];
  pendingMemb: string;
  requests: string[] = [];
  following: string[] = [];
  newNotifications: number;
  notifications: any[] = [];

  public notify = new EventEmitter<any[]>();
  public friendReq = new EventEmitter<string[]>();

  url : string = 'http://192.168.1.35:8080/member/';


  constructor(private authSer: AuthService,
    private http: HttpClient,
    public events: Events,
    private storage: Storage) {}

  initialize() {
    this.token = this.authSer.getToken();
    this.httpOptions = {
      headers : new HttpHeaders({
        'x-auth': this.token,
        'Content-type': 'application/json'
      })
    }
    this.username = this.authSer.getUsername();
    this.getbasicinfo();
    this.getNotifications();
    console.log('initiated member');
  }

  getPrStorage() {
    return this.storage.ready()
    .then(() => {
      return this.storage.get('myProfile')
    })
    .then((Pro) => {
      console.log('1', Pro);
      // this.prayerReq = [...pr];
      // return pr;
      if(Pro) {
        return Pro;
      } else {
        return [];
      }
    });
  }

  getbasicinfo() {
    this.http.get<any>(this.url + 'getbasicinfo', this.httpOptions)
      .subscribe(res => {
        console.log('list', res);
        this.name = res.list.name;
        this.proPic = res.list.proPic;
        this.friends = res.list.friends;
        this.pendingReq = res.list.pendingReq;
        this.churchId = res.list.churchId;
        this.pendingMemb = res.list.pendingMemb;
        this.isLeader = res.list.isLeader;
        this.requests = res.list.requests;
        this.following = res.list.following;
        this.newNotifications = res.list.newNotifications;
        this.friendReq.emit(this.requests);
        this.authSer.saveNewInfo(this.churchId, this.isLeader);
        this.events.publish('profileNotify:updated', this.newNotifications);
        console.log('New Not', this.newNotifications)
      }, err => {
        console.log('Errorr1');
      });
  }

  getNotifications() {
    this.http.get<any>(this.url + 'getNotifications', this.httpOptions)
    .subscribe(res => {
      this.notifications = res.list.notifications.reverse();
      this.requests = res.list.requests;
      this.friendReq.emit(this.requests);
      this.notify.emit(this.notifications);
    }, err => {
      console.log('Errorr1');
    });
  }

  clearNewNotify() {
    this.http.delete<any>(this.url + 'newNotifications', this.httpOptions)
    .subscribe(res => {
      this.newNotifications = 0;
      this.events.publish('profileNotify:updated', this.newNotifications);
      console.log('successss');
    }, err => {
      console.log('Errorr1');
    });
  }

  getInfoFriends(username: string) {
    return this.http.post<any>(this.url + 'getInfoFriends', {username}, this.httpOptions);
  }

  getProPicUser(username: string) {
    return this.http.post<string>(this.url + 'getProPic', {username}, this.httpOptions)
  }

  getInfoFollowings(username: string) {
    return this.http.post<any>(this.url + 'getInfoFollowings', {username}, this.httpOptions);
  }

  searchUsers(search: string) {
    return this.http.post<any>(this.url + 'search', {search}, this.httpOptions)
     .map(data => {
       this.getbasicinfo();
       return data.users
      });
  }

  getMembProfile(username: string, isMyProfile: boolean) {
    return this.http.post<any>(this.url + 'getDetails', {username}, this.httpOptions)
    .map(Pro => {
      console.log(Pro, this.name);
      if(isMyProfile) {
        this.isLeader = Pro.member.isLeader;
        this.storage.set('myProfile', Pro);
      }
      // Pro.prayerReq = this.prayerSer.mapInfoPr(Pro.prayerReq, [{
      //   name: this.name,
      //   proPic: this.proPic,
      //   username: this.username
      // }]);
      return Pro;
    });
  }

  updateProfile(updatedPro) {
    return this.http.put<any>(this.url + 'updatePro', {updatedPro}, this.httpOptions);
  }

  getName() {
    return this.name;
  }

  getProPic() {
    return this.proPic;
  }

  // getChurchId(): string {
  //   console.log(this.churchId, '1234');
  //   return this.churchId;
  // }

  // checkChurcId() {
  //   return this.churchId? Rx.Observable.of(this.churchId) : this.http.get(this.url+ 'getChurchId', this.httpOptions)
  // }

  // ifLeader() {
  //   console.log('isleader', this.isLeader)
  //   return this.isLeader;
  // }

  addAsFriend(username: string) {
    return this.http.post<any>(this.url + 'sendfriendReq', {username}, this.httpOptions)
      .do(doc => {
        this.getbasicinfo();
        return doc;
      });
  }

  handleFriendReq(username: string, approval: boolean) {
    console.log(username, approval);
    return this.http.post<any>(this.url + 'handleFriendReq', {username, approval}, this.httpOptions)
      .do(doc => {
        this.getbasicinfo();
        return doc;
      });
  }

  cancelFriendReq(username: string) {
    return this.http.post<any>(this.url + 'cancelFriendReq', {username}, this.httpOptions)
      .do(doc => {
        this.getbasicinfo();
        return doc;
      });
  }

  unfriend(username: string) {
    return this.http.post<any>(this.url + 'unfriend', {username}, this.httpOptions)
      .do(doc => {
        this.getbasicinfo();
        return doc;
      });
  }

  isAFriend(username: string) {
    return this.friends.indexOf(username) > -1 ? true : false;
  }

  isPendingFriend(username: string) {
    return this.pendingReq.findIndex(d => d.id === username) > -1 ? true: false;
  }

  hasRequested(username: string) {
    return this.requests.indexOf(username) > -1 ? true : false;
  }

  pendingFollowReq(churchId: string) {
    return this.pendingReq.findIndex(d => d.id === churchId) > -1 ? true: false;
  }

  iffollowing(churchId: string) {
    console.log(this.following);
    return this.following.indexOf(churchId) > -1 ? true: false;
  }

  pendingMembReq() {
    return this.pendingMemb;
  }
}
