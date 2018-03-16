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
export class ActivitiesPage implements OnInit{
  event: string = 'notification';
  requests: string[];
  followReq: any[];
  isLeader: boolean;
  notifications: any[];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private membSer: MemberService,
    private churchSer: ChurchService,
    private authSer: AuthService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ActivitiesPage');
  }

  ngOnInit() {
    this.requests = this.membSer.getRequests();
    this.followReq = this.membSer.getRequests();
    this.isLeader = this.authSer.isLeader();
  }

  handleFriendReq(username: string, approval: boolean, i: number) {
    this.membSer.handleFriendReq(username, approval)
      .subscribe(doc => {
        console.log('success');
        this.requests.splice(i, 1);
        // change icon
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
}
