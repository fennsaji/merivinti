import { Component } from "@angular/core";
import {
  NavController,
  NavParams,
  IonicPage,
  ToastController
} from "ionic-angular";
import { ChurchService } from "../../../services/church";
import { AuthService } from "../../../services/auth";
import { MemberService } from "../../../services/member";
import { IPrayerReq } from "../../../models/prayerReq.model";

@IonicPage()
@Component({
  selector: "page-church",
  templateUrl: "church.html"
})
export class ChurchPage {
  churchId: string;
  isMyChurch: boolean;
  isLeader: boolean;
  noChurch: boolean;
  isLoading: boolean;

  church = {
    churchName: "",
    churchId: "",
    proPic: "",
    noOfFollowers: null,
    noOfLeaders: null,
    noOfMembers: null,
    noOfPost: null
  };
  prayerReq: IPrayerReq[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private churchSer: ChurchService,
    public authSer: AuthService,
    private membSer: MemberService,
    private toastCtrl: ToastController
  ) {}

  ionViewDidLoad() {
    this.isLoading = true;
    console.log("ngoninit church");

    if (this.navParams.get("churchId")) {
      this.churchId = this.navParams.get("churchId");
      this.isMyChurch = false;
      this.noChurch = false;
      console.log(this.churchId);
    } else {
      console.log(this.churchId);
      if (!this.churchId) this.noChurch = true;
      else this.noChurch = false;
      this.isMyChurch = true;
      this.isLeader = this.authSer.isLeader();
    }
    this.getProfile(null);
  }

  getProfile(refresher) {
    var toast;
    if (this.isMyChurch) {
      console.log('12');
      this.churchId = this.authSer.getChurchId();
    }
    console.log(this.churchId);
    if(this.authSer.isOnline()) {
      if (this.churchId) {
        this.churchSer
          .getChurchProfile(this.churchId, this.isMyChurch)
          .subscribe(
            Pro => {
              this.church = Pro.church;
              this.prayerReq = Pro.prayerReq;
              console.log("doc", Pro);
              this.isLoading = false;
              this.noChurch = false;
              if (refresher) refresher.complete();
            },
            err => {
              console.log("Something went wrong");
              var toast = this.toastCtrl.create({
                message: "Unable to connect to server",
                duration: 3000
              });
            this.isLoading = false;
            if (refresher) refresher.complete();
          }
        );
      } else {
        this.isLoading = false;
        if (refresher) refresher.complete();
      }
    } else if(this.isMyChurch){
      this.churchSer
        .getPrStorage()
        .then(Pro => {
          console.log('from storage', Pro)
          this.church = Pro.church;
          this.prayerReq = Pro.prayerReq;
        })
        .catch(err => {});
      toast = this.toastCtrl.create({
        message: "No internet Connection",
        duration: 3000
      });
      toast.present();
    } else {
      toast = this.toastCtrl.create({
        message: "No internet Connection",
        duration: 3000
      });
      toast.present();
    }
  }

  search() {
    this.navCtrl.push("SearchPage", { profile: "church" });
  }

  gotoInfoLeaders() {
    this.navCtrl.push("ListIdPage", { type: "Leaders", id: this.churchId });
  }

  gotoInfoPrayees() {
    this.navCtrl.push("ListIdPage", { type: "Members", id: this.churchId });
  }

  // church
  followChurch() {
    this.churchSer.followChurch(this.churchId).subscribe(
      doc => {
        console.log("success");
        // change icon
      },
      err => {
        var toast = this.toastCtrl.create({
          message: "No internet Connection",
          duration: 3000
        });
        toast.present();
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
        var toast = this.toastCtrl.create({
          message: "No internet Connection",
          duration: 3000
        });
        toast.present();
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
        var toast = this.toastCtrl.create({
          message: "No internet Connection",
          duration: 3000
        });
        toast.present();
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

  hasRequested() {
    return this.membSer.pendingMembReq();
  }

  //Member
  sendMembReq() {
    this.churchSer.sendMembReq(this.churchId).subscribe(
      doc => {
        console.log("success");
      },
      err => {
        var toast = this.toastCtrl.create({
          message: "No internet Connection",
          duration: 3000
        });
        toast.present();
        console.log("Erooorr");
      }
    );
  }

  cancelMembReq() {
    this.churchSer.cancelMembReq(this.churchId).subscribe(
      doc => {
        console.log("success");
      },
      err => {
        var toast = this.toastCtrl.create({
          message: "No internet Connection",
          duration: 3000
        });
        toast.present();
        console.log("Erooorr");
      }
    );
  }

  unmember() {
    this.churchSer.unmember().subscribe(
      doc => {
        console.log("success");
      },
      err => {
        var toast = this.toastCtrl.create({
          message: "No internet Connection",
          duration: 3000
        });
        toast.present();
        console.log("Erooorr");
      }
    );
  }

  searchMyChurch() {
    this.navCtrl.push("SearchPage", { profile: "church", myChurch: true });
  }

  goToEditProfile() {
    this.navCtrl.push("EditChurchPage");
  }

  goToOptions() {
    this.navCtrl.push("SettingsPage");
  }
}
