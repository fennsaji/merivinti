import { Component } from "@angular/core";
import {
  NavController,
  NavParams,
  IonicPage,
  ToastController,
  ActionSheetController,
  Platform,
  AlertController 
} from "ionic-angular";
import { ChurchService } from "../../../services/church";
import { AuthService } from "../../../services/auth";
import { MemberService } from "../../../services/member";
import { IPrayerReq } from "../../../models/prayerReq.model";
import { PrayerService } from "../../../services/prayer";

@IonicPage()
@Component({
  selector: "page-church",
  templateUrl: "church.html"
})
export class ChurchPage {
  churchId: string;
  url: string;
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
  prayerReq: IPrayerReq[] = [];
  isButtonDisabled = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private churchSer: ChurchService,
    public authSer: AuthService,
    public actionSheet: ActionSheetController,
    public platform: Platform,
    private prayerSer: PrayerService,
    private membSer: MemberService,
    private toastCtrl: ToastController,
    public alertCtrl: AlertController
  ) {}

  ionViewDidLoad() {
    this.isLoading = true;
    this.url = this.authSer.globalUrl + 'profile/';
    console.log("ngoninit church");

    if (this.navParams.get("churchId")) {
      this.churchId = this.navParams.get("churchId");
      if(this.churchId === this.authSer.getChurchId()) {
        this.isMyChurch = true;
        console.log('its your church');
      } else {
        this.isMyChurch = false;
        console.log('its not your church');
      }
      this.noChurch = false;
      console.log(this.churchId);
    } else {
      console.log(this.churchId);
      this.churchId = this.authSer.getChurchId();
      if (!this.churchId) this.noChurch = true;
      else this.noChurch = false;
      this.isMyChurch = true;
      this.isLeader = this.authSer.isLeader();
    }
    this.getProfile(null);
  }

  getProfile(refresher) {
    this.isButtonDisabled = true;
    var toast;
    if (this.isMyChurch) {
      console.log('12');
      this.churchId = this.authSer.getChurchId();
      if (!this.churchId) this.noChurch = true;
    }
    console.log(this.churchId);
    if(this.authSer.isOnline()) {
      if (this.churchId) {
        console.log('church ex', this.churchId);
        this.churchSer
          .getChurchProfile(this.churchId, this.isMyChurch)
          .subscribe(
            Pro => {
              this.church = Pro.church?Pro.church:this.church;
              this.prayerReq = Pro.prayerReq? Pro.prayerReq: [];
              console.log("doc", Pro);
              this.noChurch = false;
              if (refresher) refresher.complete();
              this.isLoading = false;
              this.isButtonDisabled = false;
            },
            err => {
              this.isButtonDisabled = false;
              console.log("Something went wrong");
              var toast = this.toastCtrl.create({
                message: "Unable to connect to server",
                duration: 3000
              });
              toast.present();
              this.loadFromStorage();
              this.isLoading = false;
              if (refresher) refresher.complete();
          }
        );

      } else {
        this.isButtonDisabled = false;
        this.isLoading = false;
        if (refresher) refresher.complete();
      }

    } else if(this.isMyChurch && this.churchId){
      this.loadFromStorage();
      this.isButtonDisabled = false;
      toast = this.toastCtrl.create({
        message: "No Internet Connection",
        duration: 3000
      });
      toast.present();
      if (refresher) refresher.complete();
      this.isLoading = false;

    } else {
      this.isButtonDisabled = false;
      toast = this.toastCtrl.create({
        message: "No Internet Connection",
        duration: 3000
      });
      toast.present();
      this.isLoading = false;
      if (refresher) refresher.complete();
    }
  }

  loadFromStorage() {
    this.churchSer
        .getPrStorage()
        .then(Pro => {
          console.log('from storage', Pro)
          this.church = Pro.church?Pro.church:this.church;
          this.prayerReq = Pro.prayerReq? Pro.prayerReq: [];
          this.noChurch = false;
        })
        .catch(err => {});
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


  goToProfile(username: string) {
    console.log("pro");
    if(username == this.authSer.getUsername()) {
      this.navCtrl.parent.select(2);
    } else {
      this.navCtrl.push("MemberPage", { username });
    }
  }

  // church
  followChurch() {
    this.isButtonDisabled = true;
    this.churchSer.followChurch(this.churchId).subscribe(
      doc => {
        this.isButtonDisabled = false;
        console.log("success");
        // change icon
      },
      err => {
        this.isButtonDisabled = false;
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
    this.isButtonDisabled = true;
    this.churchSer.cancelfollowReq(this.churchId).subscribe(
      doc => {
        this.isButtonDisabled = false;
        console.log("success");
        // change icon
      },
      err => {
        this.isButtonDisabled = false;
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
    this.isButtonDisabled = true;
    
    const confirm = this.alertCtrl.create({
      title: 'Are you sure?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {}
        },
        {
          text: 'Unfollow',
          handler: () => {
            this.unfollowConfirm();
          }
        }
      ]
    });

    confirm.present();
  }

  unfollowConfirm() {
    this.churchSer.unfollowChurch(this.churchId).subscribe(
      doc => {
        this.isButtonDisabled = false;
        // change icon
      },
      err => {
        this.isButtonDisabled = false;
        var toast = this.toastCtrl.create({
          message: "No internet Connection",
          duration: 3000
        });
        toast.present();
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
    this.isButtonDisabled = true;
    this.churchSer.sendMembReq(this.churchId).subscribe(
      doc => {
        this.isButtonDisabled = false;
        console.log("success");
      },
      err => {
        this.isButtonDisabled = false;
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
    this.isButtonDisabled = true;
    this.churchSer.cancelMembReq(this.churchId).subscribe(
      doc => {
        this.isButtonDisabled = false;
        console.log("success");
      },
      err => {
        this.isButtonDisabled = false;
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
    this.isButtonDisabled = true;

    const confirm = this.alertCtrl.create({
      title: 'Do you want to leave this church?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {}
        },
        {
          text: 'Leave',
          handler: () => {
            this.unmemberConfirm();
          }
        }
      ]
    });
    confirm.present();
  }

  unmemberConfirm() {
    this.churchSer.unmember().subscribe(
      doc => {
        this.isButtonDisabled = false;
      },
      err => {
        this.isButtonDisabled = false;
        var toast = this.toastCtrl.create({
          message: "No internet Connection",
          duration: 3000
        });
        toast.present();
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

  getMyUsername() {
    return this.authSer.getUsername();
  }

  loadPrayerOptions(prayerId: string, index: number) {
    const options = this.actionSheet.create(
      {
        title: 'Prayer Request',
        cssClass: 'action-sheets-basic-page',
        buttons: [
          {
            text: 'Delete',
            role: 'destructive',
            icon: !this.platform.is('ios') ? 'trash' : null,
            handler: () => {
              console.log('Delete clicked');
              this.prayerSer.deletePr(prayerId)
                .subscribe(doc => {
                  this.prayerReq.splice(index, 1);
                })
            }
          },
          {
            text: 'Share',
            icon: !this.platform.is('ios') ? 'share' : null,
            handler: () => {
              this.sharePrayerReq(index);
            }
          },
          {
            text: 'Edit',
            icon: !this.platform.is('ios') ? 'hammer' : null,
            handler: () => {
              console.log('Play clicked');
            }
          },
          {
            text: 'Report',
            icon: !this.platform.is('ios') ? 'alert' : null,
            handler: () => {
              console.log('Play clicked');
            }
          },
          {
            text: 'Cancel',
            role: 'cancel', // will always sort to be on the bottom
            icon: !this.platform.is('ios') ? 'close' : null,
            handler: () => {
              console.log('Cancel clicked');
            }
          }
        ]
      }
    );
    options.present();
  }

  sharePrayerReq(index: number) {
    console.log(this.prayerReq[index]);
    var subject = "Prayer Request by " + this.prayerReq[index].username;
    var mssg = this.prayerReq[index].body;
    var url = 'https://vinti-app.herokuapp.com/vinti.apk';

    this.prayerSer.sharePr(mssg, subject, url, this.prayerReq[index].proPic);
  }
}
