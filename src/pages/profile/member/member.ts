import { Component } from "@angular/core";
import { NavController, NavParams, IonicPage } from "ionic-angular";
import { AuthService } from "../../../services/auth";
import { MemberService } from "../../../services/member";
import { IPrayerReq } from "../../../models/prayerReq.model";

@IonicPage()
@Component({
  selector: "page-member",
  templateUrl: "member.html"
})
export class MemberPage {
  isMyProfile: boolean;
  isLoading: boolean;
  username: string;

  profile = {
    name: "",
    username: "",
    proPic: "",
    noOfFollowing: null,
    noOfFriends: null,
    noOfPost: null,
    churchId: ""
  };
  prayerReq: IPrayerReq[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private authSer: AuthService,
    private membSer: MemberService
  ) {}

  ionViewDidLoad() {
    this.isLoading = true;
    console.log('enter');
    if(this.navParams.get('username')) {
      this.username = this.navParams.get('username');
      this.isMyProfile = false;
      console.log(this.username, this.isMyProfile);
    } else {
      this.username = this.authSer.getUsername();
      this.isMyProfile = true;
    }
    this.getProfile(null);
  }

  getProfile(refresher) {
    this.membSer.getMembProfile(this.username)
    .subscribe(doc => {
      this.isLoading = false;
      this.profile = doc.member;
      this.prayerReq = doc.prayerReq;
      console.log('doc', this.profile);
      if(refresher)
        refresher.complete();
    }, err => {
      console.log('Something went wrong');
      this.isLoading = false;
      if(refresher)
        refresher.complete();
    });
  }

  gotoInfoPrayees() {
    this.navCtrl.push('ListIdPage', {type:'Friends', id: this.username})
  }

  gotoInfoFollowing() {
    this.navCtrl.push('ListIdPage', {type:'Following', id: this.username})
  }

  onLogout() {
    this.authSer.logout().subscribe(d => console.log(d), e => console.log(e));
  }

  search() {
    this.navCtrl.push("SearchPage", { profile: "people" , myChurch: false});
  }
}
