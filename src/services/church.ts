import { HttpHeaders, HttpClient } from "@angular/common/http";
import { Injectable, EventEmitter } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { MemberService } from "./member";
import { Storage } from "@ionic/storage";
import { AuthService } from "./auth";
import "rxjs/add/operator/map";
import "rxjs/add/operator/do";
import { Events } from "ionic-angular";
import { PrayerService } from "./prayer";

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

  url : string ;

  constructor(private authSer: AuthService,
    private http: HttpClient,
    private storage: Storage,
    private prayerSer: PrayerService,
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
    this.url = this.authSer.globalUrl + 'church/';
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
    } else {
      this.http.post<any>(this.url + 'getProfilePic', {churchId:this.authSer.getChurchId()}, this.httpOptions)
        .subscribe(d => {
          this.proPic = d.proPic;
          console.log(this.proPic, 'got the prPix');
        }, err => {
          console.log('errror getting pixcc');
        })
    }
  }

  getChurchProfile(churchId: string, isMyChurch: boolean): Observable<any> {
    return this.http.post<any>(this.url + 'getDetails', {churchId}, this.httpOptions)
      .map(Pro => {
        if(isMyChurch) {
            this.churchName = Pro.church.churchName;
            this.proPic = Pro.church.proPic;
            this.storage.set('myChurch', Pro);
            console.log('saved');
        }
        Pro.prayerReq = this.prayerSer.mapInfoPr(Pro.prayerReq, Pro.basicInfo);
        return Pro;
      });
  }

  updateProfile(updatedPro) {
    return this.http.put<any>(this.url + 'updatePro', {updatedPro}, this.httpOptions)
    .map(res => {
      this.proPic = updatedPro.proPic;
      this.churchName = updatedPro.churchName;
      return res;
    });
  }

  getNotifications() {
    if(this.authSer.isLeader()) {
      this.http.get<any>(this.url + 'getNotifications', this.httpOptions)
      .subscribe(res => {
        this.requests = this.mapRequests(res.list.requests, res.basicInfo);
        console.log(this.requests);
        this.followReq.emit(this.requests);
      }, err => {
        console.log('Errorr1');
      });
    }
  }

  mapRequests(requests, basicInfo) {
    requests = requests.map(o => {
      var ind = basicInfo.findIndex(obj => obj.username == o.username);
      o = { ...basicInfo[ind],...o}
      // console.log('pr1', o);
      return o;
    })
    console.log(requests);
    return requests;
  }

  pushNotifications(newNotify) {
    console.log(newNotify);
    newNotify.proPic = this.proPic;
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

  isMainLeader(leadId: string) {
    var index = this.leaders.findIndex(o => o.leadId === leadId && o.type === 'main');
    if(index > -1 )
      return true;
    else
      return false;
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
    return this.http.post<any>(this.url + 'handlefollowReq', {username, approval, proPic: this.proPic}, this.httpOptions)
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
    return this.http.post<any>(this.url + 'handleMembReq', {username, approval, proPic: this.proPic}, this.httpOptions)
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
    return this.http.post<any>(this.url + 'addAsLeader', {username, proPic: this.proPic}, this.httpOptions)
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
    return this.http.post<any>(this.url + 'promoteLeader', {username, proPic: this.proPic}, this.httpOptions)
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
