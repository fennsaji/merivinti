import { Injectable } from "@angular/core";
import { AuthService } from "./auth";
import { Storage } from "@ionic/storage";
import "rxjs/add/operator/map";
import "rxjs/add/operator/do";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { FormControl } from "@angular/forms";

@Injectable()
export class MemberService {
  token: string;
  httpOptions : Object;
  friends: string[];
  pendingReq: any[];
  pendingMemb: string;
  requests: string[];
  following: string[];
  url : string = 'http://192.168.43.54:8080/member/';

  constructor(private authSer: AuthService,
    private http: HttpClient,
    private storage: Storage) {}

  initialize() {
    this.token = this.authSer.getToken();
    this.httpOptions = {
      headers : new HttpHeaders({
        'x-auth': this.token,
        'Content-type': 'application/json'
      })
    }
    this.getbasicinfo();
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

  getbasicinfo(){
    this.http.get<any>(this.url + 'getbasicinfo', this.httpOptions)
      .subscribe(res => {
        console.log('list', res);
        this.friends = res.list.friends;
        this.pendingReq = res.list.pendingReq;
        this.pendingMemb = res.list.pendingMemb;
        this.requests = res.list.requests;
        this.following = res.list.following;
      }, err => {
        console.log('errorrrr');
      });
  }

  searchUsers(search: string) {
    return this.http.post<any>(this.url + 'search', {search}, this.httpOptions)
     .map(data => {
       this.getbasicinfo();
       return data.users
      });
  }

  getMembProfile(username: string) {
    return this.http.post<any>(this.url + 'getDetails', {username}, this.httpOptions)
    .do(Pro => {
      this.storage.set('myProfile', Pro);
      return Pro;
    });
  }

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

  getRequests() {
    return this.requests.slice();
  }

  pendingMembReq() {
    return this.pendingMemb;
  }
}
