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
  members: string[] = [];
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
    if(this.authSer.isLeader())
    this.getbasicinfo().subscribe();
    this.getNotifications();
  }

  getbasicinfo() {
    if(this.authSer.isLeader()) {
      console.log('church initilizes leader');
      return this.http.get<any>(this.url + 'getbasicinfo', this.httpOptions)
        .map(res => {
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

  getChurchProfile(churchId: string, isMyChurch: boolean): Observable<any> {
    return this.http.post<any>(this.url + 'getDetails', {churchId}, this.httpOptions)
      .map(Pro => {
        if(isMyChurch) {
          this.churchName = Pro.church.churchName;
          this.proPic = Pro.church.proPic;
          this.storage.set('myChurch', Pro);
          console.log('saved');
          if(this.authSer.isLeader())
          this.getbasicinfo().subscribe();
        }
        Pro.prayerReq = this.prayerSer.mapInfoPr(Pro.prayerReq, Pro.basicInfo).reverse();
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
        this.getbasicinfo();
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
      .flatMap(res => {
        return this.membSer.getbasicinfo()
          .map(doc => {
            return res;
          }, err => {
            return res;
          });
      });
  }

  unfollowChurch(churchId: string) {
    return this.http.post<any>(this.url + 'unfollow', {churchId}, this.httpOptions)
      .flatMap(res => {
        return this.membSer.getbasicinfo()
        .map(doc => {
          return res;
        }, err => {
          return res;
        });
        // return res;
      });
  }

  handlefollowReq(username: string, approval: boolean) {
    // var ind = this.requests.findIndex(obj => obj.username === username);
    return this.http.post<any>(this.url + 'handlefollowReq', {username, approval}, this.httpOptions)
      .flatMap(res => {
        return this.getbasicinfo()
          .map(doc => {
            return res;
          }, err => {
            return res;
          });
        // if(approval) {
        //   this.requests.slice(ind, 1);
        //   this.followers.push(username);
        // } else {
        //   this.requests.slice(ind, 1);
        // }
        // return res;
      });
  }

  cancelfollowReq(churchId: string) {
    return this.http.post<any>(this.url + 'cancelfollowReq', {churchId}, this.httpOptions)
      .flatMap(res => {
        return this.membSer.getbasicinfo()
        .map(doc => {
          return res;
        }, err => {
          return res;
        });
        // return res;
      });
  }

  removefollower(username: string) {
    // var ind = this.followers.indexOf(username);
    return this.http.post<any>(this.url + 'removefollower', {username}, this.httpOptions)
    .flatMap(res => {
      return this.getbasicinfo()
      .map(doc => {
        return res;
      }, err => {
        return res;
      });
      // this.followers.slice(ind, 1);
      // return res;
    });
  }

  // Member
  sendMembReq(churchId: string) {
    return this.http.post<any>(this.url + 'sendMembReq', {churchId}, this.httpOptions)
    .flatMap(res => {
      return this.membSer.getbasicinfo()
      .map(doc => {
        return res;
      }, err => {
        return res;
      });
      // return res;
    });
  }

  handleMembReq(username: string, approval: boolean) {
    // var ind = this.requests.findIndex(obj => obj.username === username);
    return this.http.post<any>(this.url + 'handleMembReq', {username, approval}, this.httpOptions)
    .flatMap(res => {
      return this.getbasicinfo()
      .map(doc => {
        return res;
      }, err => {
        return res;
      });
      // if(approval) {
      //   this.requests.slice(ind, 1);
      //   this.members.push(username);
      // } else {
      //   this.requests.slice(ind, 1);
      // }
      // return res;
    });
  }

  cancelMembReq(churchId: string) {
    return this.http.post<any>(this.url + 'cancelMembReq', {churchId}, this.httpOptions)
      .flatMap(res => {
        return this.membSer.getbasicinfo()
        .map(doc => {
          return res;
        }, err => {
          return res;
        });
        // return res;
      });
  }

  unmember() {
    return this.http.delete<any>(this.url + 'unmember', this.httpOptions)
    .flatMap(res => {
      return this.membSer.getbasicinfo()
      .map(doc => {
        return res;
      }, err => {
        return res;
      });
      // return res;
    });
  }

  removeMember(username: string) {
    // var ind = this.members.indexOf(username);
    return this.http.post<any>(this.url + 'removeMember', {username}, this.httpOptions)
      .flatMap(res => {
        return this.getbasicinfo()
        .map(doc => {
          return res;
        }, err => {
          return res;
        });
        // this.members.slice(ind, 1);
        // return res;
      });
  }

  // Leader
  addAsLeader(username: string) {
    // var ind = this.members.indexOf(username);
    return this.http.post<any>(this.url + 'addAsLeader', {username}, this.httpOptions)
      .flatMap(res => {
        return this.getbasicinfo()
        .map(doc => {
          return res;
        }, err => {
          return res;
        });
        // this.members.slice(ind,1);
        // this.leaders.push({leadId: username, type: "Secondary"});
        // return res;
      });
  }

  removeLeader(username: string) {
    // var ind = this.leaders.findIndex(obj => obj.leadId === username && obj.type !== 'main');
    return this.http.post<any>(this.url + 'removeLeader', {username}, this.httpOptions)
      .flatMap(res => {
        return this.getbasicinfo()
        .map(doc => {
          return res;
        }, err => {
          return res;
        });
        // this.leaders.slice(ind, 1);
        // return res;
      });
  }

  promoteLeader(username: string) {
    return this.http.post<any>(this.url + 'promoteLeader', {username}, this.httpOptions)
      .flatMap(res => {
        return this.getbasicinfo()
        .map(doc => {
          return res;
        }, err => {
          return res;
        });
        // return res;
      });
  }

  addFamiliy(newfly) {
    return this.http.post<any>(this.url + 'addFamiliy', {newfly}, this.httpOptions)
      .do(res => {
        if(this.authSer.isLeader())
        this.getbasicinfo().subscribe();
        return res;
      });
  }
}
