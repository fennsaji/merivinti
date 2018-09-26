import { HttpHeaders, HttpClient } from "@angular/common/http";
import { Injectable, EventEmitter } from "@angular/core";
// import { FormControl } from "@angular/forms";
import { Storage } from "@ionic/storage";
import { AuthService } from "./auth";
import "rxjs/add/operator/map";
import "rxjs/add/operator/do";
import "rxjs/add/operator/mergeMap";
import "rxjs/Rx";
import "rxjs/add/observable/of";
import { Events } from "ionic-angular";
// import { PrayerService } from "./prayer";

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

  // url : string = 'http://192.168.1.35:8080/member/';
  url: string;


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
    this.url = this.authSer.globalUrl + 'member/';
    this.username = this.authSer.getUsername();
    this.getbasicinfo().subscribe();
    this.getNotifications();
  }

  getMembProfile(username: string, isMyProfile: boolean) {
    return this.http.post<any>(this.url + 'getDetails', {username}, this.httpOptions)
    .map(Pro => {
      if(isMyProfile) {
        this.isLeader = Pro.member.isLeader;
        this.churchId = Pro.member.churchId;
        this.storage.set('myProfile', Pro);
        this.authSer.saveNewInfo(this.churchId, this.isLeader);
        this.getbasicinfo().subscribe();
      }
      // Pro.prayerReq = this.prayerSer.mapInfoPr(Pro.prayerReq, [{
      //   name: this.name,
      //   proPic: this.proPic,
      //   username: this.username
      // }]);
      return Pro;
    });
  }

  getPrStorage() {
    return this.storage.ready()
    .then(() => {
      return this.storage.get('myProfile')
    })
    .then((Pro) => {
      if(Pro) {
        return Pro;
      } else {
        return [];
      }
    });
  }

  getbasicinfo() {
    return this.http.get<any>(this.url + 'getbasicinfo', this.httpOptions)
      .map(res => {
        this.name = res.list.name;
        this.proPic = res.list.proPic;
        this.friends = res.list.friends;
        this.pendingReq = res.list.pendingReq;
        this.pendingMemb = res.list.pendingMemb;
        this.isLeader = res.list.isLeader;
        this.churchId = res.list.churchId;
        this.requests = res.list.requests;
        // this.requests = this.mapRequests(res.list.requests, res.basicInfo);
        this.following = res.list.following;
        this.newNotifications = res.list.newNotifications;
        // this.friendReq.emit(this.requests);
        this.authSer.saveNewInfo(this.churchId, this.isLeader);
        this.events.publish('profileNotify:updated', this.newNotifications);
      });
  }

  getNotifications() {
    if(this.authSer.isOnline()) {
      this.http.get<any>(this.url + 'getNotifications', this.httpOptions)
      .subscribe(res => {
        this.requests = res.list.requests;
        var request = this.mapRequests(res.list.requests, res.basicInfo);
        this.notifications = this.mapNotifications(res.list.notifications, res.basicInfo, res.churchInfo).reverse();
        this.friendReq.emit(request);
        this.notify.emit(this.notifications);
        this.storage.set('userEvents', {notifications: this.notifications});
        this.getbasicinfo().subscribe();
      }, err => {
        this.notificationFromStorage();
      });
    } else {
      this.notificationFromStorage();
    }
  }

  mapNotifications(notifications, basicInfo, churchInfo) {
    notifications = notifications.map(o => {
      if(o.by === 'church') {
        var ind = churchInfo.findIndex(obj => obj.churchId === o.who);
        return {...o, ...churchInfo[ind]};
      } else if(o.by === 'user') {
        var index = basicInfo.findIndex(obj => obj.username === o.who);
        return {...o, ...basicInfo[index]};
      }
    })
    return notifications;
  }

  mapRequests(requests, basicInfo) {
    requests = requests.map(o => {
      var ind = basicInfo.findIndex(obj => obj.username === o);
      var obj = {
        username: o,
        proPic: basicInfo[ind].proPic
      }
      return obj;
    })
    return requests;
  }

  notificationFromStorage() {
    this.storage.ready()
    .then(() => {
      return this.storage.get('userEvents')
    })
    .then((Notify) => {
      this.notifications = Notify.notifications;
      this.notify.emit(this.notifications);
    });
  }

  clearNewNotify() {
    this.http.delete<any>(this.url + 'newNotifications', this.httpOptions)
    .subscribe(res => {
      this.newNotifications = 0;
      this.events.publish('profileNotify:updated', this.newNotifications);
    }, err => {
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
       this.getbasicinfo().subscribe();
       return data.users
      });
  }

  updateProfile(updatedPro) {
    return this.http.put<any>(this.url + 'updatePro', {updatedPro}, this.httpOptions)
      .map(res => {
        this.proPic = updatedPro.proPic;
        this.name = updatedPro.name;
        return res;
      });
  }

  getName() {
    return this.name;
  }

  getProPic() {
    return this.proPic;
  }

  addAsFriend(username: string) {
    return this.http.post<any>(this.url + 'sendfriendReq', {username}, this.httpOptions)
      .flatMap(doc => {
        return this.getbasicinfo()
          .map(doc => {
            this.getbasicinfo().subscribe();
            return doc;
          }, err => {
            return doc;
          });
        // this.pendingReq.push({username});
        // return doc;
      });
  }

  handleFriendReq(username: string, approval: boolean) {
    // var ind = this.requests.indexOf(username);
    return this.http.post<any>(this.url + 'handleFriendReq', {username, approval}, this.httpOptions)
      .flatMap(doc => {
        return this.getbasicinfo()
          .map(doc => {
            this.getbasicinfo().subscribe();
            return doc;
          }, err => {
            return doc;
          });

      });
  }

  cancelFriendReq(username: string) {
    
    // var ind = this.pendingReq.findIndex(obj => obj.username  === username);
    return this.http.post<any>(this.url + 'cancelFriendReq', {username}, this.httpOptions)
      .flatMap(doc => {
        return this.getbasicinfo()
          .map(doc => {
            this.getbasicinfo().subscribe();
            return doc;
          }, err => {
            return doc;
        });
        // this.pendingReq.slice(ind, 1);
        // return doc;
      });
  }

  unfriend(username: string) {
    // var ind = this.friends.indexOf(username);
    return this.http.post<any>(this.url + 'unfriend', {username}, this.httpOptions)
      .flatMap(doc => {
        return this.getbasicinfo()
          .map(doc => {
            this.getbasicinfo().subscribe();
            return doc;
          }, err => {
            return doc;
          });
        // this.friends.slice(ind, 1);
        // return doc;
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
    return this.following.indexOf(churchId) > -1 ? true: false;
  }

  pendingMembReq() {
    return this.pendingMemb;
  }
}
