import { Component, OnInit } from "@angular/core";
import { NavController, NavParams, IonicPage } from "ionic-angular";
import { ChurchService } from "../../../services/church";
import { AuthService } from "../../../services/auth";
import { MemberService } from "../../../services/member";

@IonicPage()
@Component({
  selector: "page-church",
  templateUrl: "church.html"
})
export class ChurchPage implements OnInit {
  churchId: string;
  isMyChurch: boolean;
  isLeader: boolean;
  noChurch: boolean;
  isInterested: boolean;
  church = {
    churchName: "123",
    churchId: "123",
    noOfFollowers: 3,
    noOfLeaders: 2,
    noOfMembers: 4,
    noOfPost: 1
  };
  prayerReq: any[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private churchSer: ChurchService,
    private authSer: AuthService,
    private membSer: MemberService
  ) {}

  ionViewDidLoad() {
    console.log("ionViewDidLoad ChurchPage");
  }

  ngOnInit() {
    console.log("ngoninit church");
    if (this.navParams.get("churchId")) {
      this.churchId = this.navParams.get("churchId");
      this.isInterested = this.navParams.get("isInterested");
      this.isMyChurch = false;
      this.noChurch = false;
      console.log(this.churchId);
    } else {
      this.churchId = this.authSer.getChurchId();
      if(!this.churchId)
        this.noChurch = true;
      else
        this.noChurch = false;
      this.isMyChurch = true;
      this.isLeader = this.authSer.isLeader();
      this.isInterested = false;
      this.churchSer
        .getPrStorage()
        .then(Pro => {
          // this.church = Pro.church;
          // this.prayerReq = Pro.prayerReq;
        })
        .catch(err => {});
    }

    this.churchSer.getChurchProfile(this.churchId).subscribe(
      Pro => {
        this.church = Pro.church;
        this.prayerReq = Pro.prayerReq;
        console.log("doc", Pro);
      },
      err => {
        console.log("Something went wrong");
      }
    );
  }

  search() {
    this.navCtrl.push("SearchPage", { profile: "church" , myChurch: false});
  }

  // church
  followChurch() {
    this.churchSer.followChurch(this.churchId).subscribe(
      doc => {
        console.log("success");
        // change icon
      },
      err => {
        console.log("Error");
      }
    );
  }

  cancelfollow() {
    this.churchSer.cancelfollowReq(this.churchId).subscribe(
      doc => {
        console.log("success");
        // change icon
      },
      err => {
        console.log("Error");
      }
    );
  }

  unfollow() {
    this.churchSer.unfollowChurch(this.churchId).subscribe(
      doc => {
        console.log("success");
        // change icon
      },
      err => {
        console.log("Error");
      }
    );
  }

  pendingFollowReq(churchId: string) {
    return this.membSer.pendingFollowReq(churchId);
  }

  following(churchId: string) {
    return this.membSer.iffollowing(churchId);
  }

  //Member
  sendMembReq() {
    this.churchSer.sendMembReq(this.churchId)
      .subscribe(doc => {
        console.log('success');
      }, err => {
        console.log('Erooorr');
      });
  }

  cancelMembReq() {
    this.churchSer.cancelMembReq(this.churchId)
    .subscribe(doc => {
      console.log('success');
    }, err => {
      console.log('Erooorr');
    });
  }

  unmember() {
    this.churchSer.unmember()
    .subscribe(doc => {
      console.log('success');
    }, err => {
      console.log('Erooorr');
    });
  }

  searchMyChurch() {
    this.navCtrl.push('SearchPage', {profile: 'church', myChurch: true})
  }

  goToEditProfile() {
    this.navCtrl.push('EditChurchPage');
  }

  goToOptions() {
    this.navCtrl.push('SettingsPage');
  }
}
