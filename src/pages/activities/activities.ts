import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { MemberService } from '../../services/member';
import { ChurchService } from '../../services/church';
import { AuthService } from '../../services/auth';

@IonicPage()
@Component({
  selector: 'page-activities',
  templateUrl: 'activities.html',
})
export class ActivitiesPage {
  isButtonDisabled = false;
  event: string = 'notification';
  myChurchProPic: string;
  requests: any[] = [];
  followReq: any[] =[];
  isLeader: boolean;
  noNotify: boolean;
  url: string;
  noFoR: boolean = true;
  noFrR: boolean = true;
  notifications: any[];
  isLoading: boolean;

  constructor(public navCtrl: NavController,
    private membSer: MemberService,
    public toastCtrl: ToastController,
    private churchSer: ChurchService,
    public authSer: AuthService) {
  }

  ionViewDidLoad() {
    this.isLoading = true;
    this.url = this.authSer.globalUrl + 'profile/';

    this.membSer.friendReq.subscribe((data) => {
      if(data.length == 0)
        this.noFrR = true;
      else
        this.noFrR = false;
      this.requests = data?data:[];
    });

    this.churchSer.followReq.subscribe((data) => {
      if(data.length == 0)
        this.noFoR = true;
      else
        this.noFoR = false;
      this.followReq = data? data: [];
    });

    this.membSer.notify.subscribe(doc => {
      if(doc.length == 0)
        this.noNotify = true;
      else
        this.noNotify = false;
      this.notifications = doc?doc:[];
      this.isLoading = false;
    });

    this.isLeader = this.authSer.isLeader();
    this.membSer.clearNewNotify();
    this.churchSer.deleteNewNotify();
    this.getNotifications(null);
  }

  getNotifications(refresher) {
    if(this.authSer.isOnline()) {
      this.membSer.getNotifications();
      this.churchSer.getNotifications();
    } else {
      this.membSer.notificationFromStorage();
      var toast = this.toastCtrl.create({
        message: "No internet Connection",
        duration: 3000
      });
      toast.present();
    }
    if(refresher)
    refresher.complete();
  }

  handleFriendReq(username: string, approval: boolean, i: number) {
    this.isButtonDisabled = true;
    this.membSer.handleFriendReq(username, approval)
      .subscribe(doc => {
        this.requests.splice(i, 1);
        this.isButtonDisabled = false;
        if(!this.requests)
        this.noFrR = true;
      },  err => {
        this.isButtonDisabled = false;
        var toast = this.toastCtrl.create({
          message: "Could'nt connect to Server",
          duration: 3000
        });
        toast.present();
      });
  }

  handleReq(username: string, desig: string, approval: boolean, i: number) {
    this.isButtonDisabled = true;
    if(desig == 'Follower') {
      this.churchSer.handlefollowReq(username, approval)
      .subscribe(doc => {
        this.followReq.splice(i, 1);
        this.isButtonDisabled = false;
        if(!this.followReq)
          this.noFoR = true;
        // change icon
      },  err => {
        this.isButtonDisabled = false;
        var toast = this.toastCtrl.create({
          message: "Could Not connect to Server",
          duration: 3000
        });
        toast.present();
      });
    } else if(desig == 'Member') {
      this.churchSer.handleMembReq(username, approval)
      .subscribe(doc => {
        this.followReq.splice(i, 1);
        this.isButtonDisabled = false;
        if(!this.followReq)
          this.noFoR = true;
        // change icon
      },  err => {
        this.isButtonDisabled = false;
        var toast = this.toastCtrl.create({
          message: "Could Not connect to Server",
          duration: 3000
        });
        toast.present();
      });
    }

  }

  goToProfile(type: string, id: string) {
    if(type === 'user')
      this.navCtrl.push('MemberPage', {username: id});
    else if(type === 'church') {
      if(id === this.authSer.getChurchId()) {
        this.navCtrl.parent.select(3);
      } else {
        this.navCtrl.push('ChurchPage', {churchId: id});
      }
    }
  }

  createNewNotify() {
    this.navCtrl.push('NewNotifyPage');
  }
}
