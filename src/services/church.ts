import { Injectable } from "@angular/core";
import { AuthService } from "./auth";
import { Observable } from "rxjs/Observable";
import { Storage } from "@ionic/storage";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { MemberService } from "./member";

@Injectable()
export class ChurchService {
  token: string;
  httpOptions : Object;
  leaders: any[];
  requests: any[];
  members: string;
  followers: string[];
  families: any[];
  url : string = 'http://192.168.43.54:8080/church/';

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
  }

  getbasicinfo() {
    if(this.authSer.isLeader()) {
      this.http.get<any>(this.url + 'getbasicinfo', this.httpOptions)
    .subscribe(res => {
      console.log('list23', res);
      this.leaders = res.list.leaders;
      this.requests = res.list.requests;
      this.members = res.list.members;
      this.requests = res.list.requests;
      this.followers = res.list.followers;
    }, err => {
      console.log('errorrrr');
    });
    }
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

  handlefollowReq(churchId: string, approval: boolean) {
    return this.http.post<any>(this.url + 'handlefollowReq', {churchId, approval}, this.httpOptions)
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

  getRequests() {
    return this.requests.slice();
  }
}
