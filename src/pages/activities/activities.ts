import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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
  notifications: any[];
  isLoading: boolean;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private membSer: MemberService,
    private churchSer: ChurchService,
    public authSer: AuthService) {
  }

  ionViewDidLoad() {
    this.isLoading = true;
    console.log('Enter ActivitiesPage');
    this.membSer.friendReq.subscribe((data) => {
      this.requests = data;
    }, err => {
      console.log('Error ActivitiesPage');
    });
    this.churchSer.followReq.subscribe((data) => {
      this.followReq = data;
    }, err => {
      console.log('Enter errorr');
    });
    this.membSer.notify.subscribe(doc => {
      this.notifications = doc;
      this.isLoading = false;
    });
    this.isLeader = this.authSer.isLeader();
    this.membSer.clearNewNotify();
    this.churchSer.deleteNewNotify();
    this.getNotifications(null);
  }

  getNotifications(refresher) {
    this.membSer.getNotifications();
    this.churchSer.getNotifications();
    if(refresher)
    refresher.complete();
  }

  ionViewDidEnter() {
    console.log('Enter');
  }

  handleFriendReq(username: string, approval: boolean, i: number) {
    this.membSer.handleFriendReq(username, approval)
      .subscribe(doc => {
        console.log('success');
        this.requests.splice(i, 1);
      },  err => {
        console.log('Error');
      });
  }

  handlefollowReq(username: string, approval: boolean, i: number) {
    this.churchSer.handlefollowReq(username, approval)
    .subscribe(doc => {
      console.log('success');
      this.followReq.splice(i, 1);
      // change icon
    },  err => {
      console.log('Error');
    });
  }

  goToProfile(type: string, id: string) {
    if(type === 'user')
      this.navCtrl.push('MemberPage', {username: id});
    else
      this.navCtrl.push('ChurchPage', {churchId: id});
  }

  createNewNotify() {
    this.navCtrl.push('NewNotifyPage');
  }
}
