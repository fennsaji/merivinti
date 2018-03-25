import { Component } from "@angular/core";
import { NavController, NavParams, IonicPage, ToastController, ActionSheetController, Platform } from "ionic-angular";
import { AuthService } from "../../../services/auth";
import { MemberService } from "../../../services/member";
import { IPrayerReq } from "../../../models/prayerReq.model";
import { PrayerService } from "../../../services/prayer";

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
    public platform: Platform,
    private prayerSer: PrayerService,
    private authSer: AuthService,
    private membSer: MemberService,
    public toastCtrl: ToastController,
    public actionSheet: ActionSheetController,
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
    var toast;

    if(this.authSer.isOnline()) {
      this.membSer.getMembProfile(this.username, this.isMyProfile)
    .subscribe(doc => {
      this.isLoading = false;
      this.profile = doc.member;
      this.prayerReq = doc.prayerReq;
      console.log('doc', this.profile);
      if(refresher)
        refresher.complete();

    }, err => {
      console.log('Something went wrong');
      var toast = this.toastCtrl.create({
        message: "Unable to connect to server",
        duration: 3000
      });
      toast.present();
      this.loadFromStorage();
      this.isLoading = false;
      if(refresher)
        refresher.complete();
    });

    } else if(this.isMyProfile){
      this.loadFromStorage();
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

  loadFromStorage() {
    this.membSer
    .getPrStorage()
    .then(Pro => {
      console.log('proifil', Pro);
      this.profile = Pro.member;
      this.prayerReq = Pro.prayerReq;
    })
    .catch(err => {
      var toast = this.toastCtrl.create({
        message: "Unable to read from Storage",
        duration: 3000
      });
      toast.present();
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

  addAsFriend(username: string) {
    console.log("added", username);
    this.membSer.addAsFriend(username).subscribe(
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

  cancelFriendReq(username: string) {
    this.membSer.cancelFriendReq(username).subscribe(
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

  handlefriendReq(username: string, approval: boolean) {
    console.log(approval, username);
    this.membSer.handleFriendReq(username, approval).subscribe(
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

  unfriend(username: string) {
    this.membSer.unfriend(username).subscribe(
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

  isFriend(username: string) {
    return this.membSer.isAFriend(username);
  }

  isPendingFriend(username: string) {
    return this.membSer.isPendingFriend(username);
  }

  hasRequested(username: string) {
    return this.membSer.hasRequested(username);
  }

  goToOptions() {
    this.navCtrl.push('SettingsPage');
  }

  onEditProfile() {
    this.navCtrl.push('EditProfilePage');
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
    var url = '';

    this.prayerSer.sharePr(mssg, subject, url);
  }
}
