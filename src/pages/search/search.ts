import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ChurchService } from '../../services/church';
import { MemberService } from '../../services/member';
import { AuthService } from '../../services/auth';

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage implements OnInit{
  Churches: Array<any>;
  People: Array<any>;
  profile: string = 'people';

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private churchSer: ChurchService,
    private membSer: MemberService,
    private authSer: AuthService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchPage');
  }

  ngOnInit() {
    this.profile = this.navParams.get('profile');
  }

  // Add spinner
  onSearch(ev: any, profile: string) {
    let val = ev.target.value;
    console.log(val, profile);
    if(profile === 'people' && val && val.trim() !='') {
      this.membSer.searchUsers(val)
      .subscribe(data => {
        if(!data) {
          console.log('No hits');
        }
        this.People = data;
      }, err => {
        console.log('Something went wrong');
      });
    } else if( profile === 'church' && val && val.trim() !='') {
      this.churchSer.searchChurch(val)
        .subscribe(data => {
          if(!data) {
            console.log('No hits');
          }
          this.Churches = data;
        }, err => {
          console.log('Something went wrong');
        });
    }
  }

  onClose() {
    this.navCtrl.pop();
  }

  goToProfile(username: string) {
    console.log('pro');
    this.navCtrl.push('MemberPage', {username})
  }

  goToChurch(churchId: string) {
    this.navCtrl.push('ChurchPage', {churchId})
  }

  addAsFriend(username: string) {
    console.log('added', username);
    this.membSer.addAsFriend(username)
      .subscribe(doc => {
        console.log('success');
        // change icon
      },  err => {
        console.log('Error');
      });
  }

  cancelFriendReq(username: string) {
    this.membSer.cancelFriendReq(username)
      .subscribe(doc => {
        console.log('success');
        // change icon
      },  err => {
        console.log('Error');
      });
  }

  handlefriendReq(username: string, approval: boolean) {
    console.log(approval,username);
    this.membSer.handleFriendReq(username, approval)
    .subscribe(doc => {
      console.log('success');
      // change icon
    },  err => {
      console.log('Error');
    });
  }

  isFriend(username: string) {
    return this.membSer.isAFriend(username);
  }

  isPendingFriend(username: string) {
    return this.membSer.isPendingFriend(username);
  }

  hasRequested(username: string) {
    return this.membSer.hasRequested(username);
  }

  followChurch(churchId: string) {
    console.log('churched');
  }

  cancelfollow(churchId: string) {

  }

  handlefollowReq(churchId: string) {

  }
}
