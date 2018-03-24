import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { MemberService } from '../../services/member';
import { ChurchService } from '../../services/church';
import { AuthService } from '../../services/auth';

@IonicPage()
@Component({
  selector: 'page-activities',
  templateUrl: 'activities.html',
})
export class ActivitiesPage {
  event: string = 'notification';
  requests: string[];
  followReq: any[];
  isLeader: boolean;
  noNotify: boolean;
  noFoR: boolean = true;
  noFrR: boolean;
  notifications: any[];
  isLoading: boolean;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private membSer: MemberService,
    public toastCtrl: ToastController,
    private churchSer: ChurchService,
    public authSer: AuthService) {
  }

  ionViewDidLoad() {
    this.isLoading = true;
    console.log('Enter ActivitiesPage');

    this.membSer.friendReq.subscribe((data) => {
    if(data.length == 0)
      this.noFrR = true;
    else
      this.noFrR = false;
    console.log('32',this.noFrR);
    this.requests = data.reverse();
    });

    this.churchSer.followReq.subscribe((data) => {
    if(data.length == 0)
      this.noFoR = true;
    else
      this.noFoR = false;
    console.log('45', this.noFoR, data);
    this.followReq = data;
    console.log(this.followReq);
    });

    this.membSer.notify.subscribe(doc => {
      console.log('emitt', doc);
      if(doc.length == 0)
        this.noNotify = true;
      else
        this.noNotify = false;
      console.log('123',this.noNotify);
      this.notifications = doc;
      console.log(this.notifications);
      this.isLoading = false;
    });
    this.isLeader = this.authSer.isLeader();
    this.getNotifications(null);
  }

  ionViewDidEnter() {
    this.membSer.clearNewNotify();
    this.churchSer.deleteNewNotify();
  }

  getNotifications(refresher) {
    if(this.authSer.isOnline()) {
      this.membSer.getNotifications();
      this.churchSer.getNotifications();
    } else {
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
    this.membSer.handleFriendReq(username, approval)
      .subscribe(doc => {
        console.log('success');
        this.requests.splice(i, 1);
        if(!this.requests)
        this.noFrR = true;
      },  err => {
        var toast = this.toastCtrl.create({
          message: "Could Not connect to Server",
          duration: 3000
        });
        toast.present();
        console.log('Error');
      });
  }

  handleReq(username: string, desig: string, approval: boolean, i: number) {
    if(desig == 'Follower') {
      this.churchSer.handlefollowReq(username, approval)
      .subscribe(doc => {
        console.log('success');
        this.followReq.splice(i, 1);
        if(!this.followReq)
          this.noFoR = true;
        // change icon
      },  err => {
        var toast = this.toastCtrl.create({
          message: "Could Not connect to Server",
          duration: 3000
        });
        toast.present();
        console.log('Error');
      });
    } else if(desig == 'Member') {
      this.churchSer.handleMembReq(username, approval)
      .subscribe(doc => {
        console.log('success');
        this.followReq.splice(i, 1);
        if(!this.followReq)
          this.noFoR = true;
        // change icon
      },  err => {
        var toast = this.toastCtrl.create({
          message: "Could Not connect to Server",
          duration: 3000
        });
        toast.present();
        console.log('Error');
      });
    }

  }

  goToProfile(type: string, id: string) {
    console.log(type);
    if(type === 'user')
      this.navCtrl.push('MemberPage', {username: id});
    else if(type === 'church')
      this.navCtrl.push('ChurchPage', {churchId: id});
  }

  createNewNotify() {
    this.navCtrl.push('NewNotifyPage');
  }
}
