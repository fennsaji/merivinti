import { Component } from "@angular/core";
import { NavController, NavParams, AlertController, IonicPage, ToastController, ActionSheetController, Platform, ModalController } from "ionic-angular";
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
  isButtonDisabled = false;

  profile = {
    name: "",
    username: "",
    proPic: "",
    noOfFollowing: null,
    noOfFriends: null,
    noOfPost: null,
    churchId: ""
  };
  prayerReq: IPrayerReq[] = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public platform: Platform,
    private prayerSer: PrayerService,
    public authSer: AuthService,
    private membSer: MemberService,
    public toastCtrl: ToastController,
    public actionSheet: ActionSheetController,
    public alertCtrl: AlertController
  ) {}

  ionViewDidLoad() {
    this.isLoading = true;
    if(this.navParams.get('username')) {
      this.username = this.navParams.get('username');
      if(this.username === this.authSer.getUsername()) {
        this.isMyProfile = true;
      } else {
        this.isMyProfile = false;
      }
    } else {
      this.username = this.authSer.getUsername();
      this.isMyProfile = true;
    }
    this.getProfile(null);
  }

  getProfile(refresher) {
    var toast;
    this.isButtonDisabled = true;

    if(this.authSer.isOnline()) {
      this.membSer.getMembProfile(this.username, this.isMyProfile)
    .subscribe(doc => {
      this.isButtonDisabled = false;
      this.profile = doc.member?doc.member:this.profile;
      this.prayerReq = doc.prayerReq? doc.prayerReq.reverse(): [];
      this.isLoading = false;
      if(refresher)
        refresher.complete();

    }, err => {
      this.isButtonDisabled = false;
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
      this.isButtonDisabled = false;
      toast = this.toastCtrl.create({
        message: "No Internet Connection",
        duration: 3000
      });
      toast.present();
      this.isLoading = false;
      if(refresher)
      refresher.complete();

    } else {
      this.isButtonDisabled = false;
      toast = this.toastCtrl.create({
        message: "No Internet Connection",
        duration: 3000
      });
      toast.present();
      this.isLoading = false;
      if(refresher)
      refresher.complete();
    }
  }


  loadFromStorage() {
    this.membSer
    .getPrStorage()
    .then(Pro => {
      this.profile = Pro.member?Pro.member:this.profile;
      this.prayerReq = Pro.prayerReq? Pro.prayerReq.reverse(): [];
    })
    .catch(err => {
      var toast = this.toastCtrl.create({
        message: "Unable to read from Storage",
        duration: 3000
      });
      toast.present();
    });
  }


  createNewPrayer(): void {
    // this.navCtrl.push('NewPrayerPage');
    const modal = this.modalCtrl.create('NewPrayerPage');
    modal.present();
    modal.onDidDismiss((newPr) => {
      if(!newPr) {
        return;
      }
      this.prayerReq.unshift(newPr);
    });
  }


  gotoInfoPrayees() {
    this.navCtrl.push('ListIdPage', {type:'Friends', id: this.username})
  }


  gotoInfoFollowing() {
    this.navCtrl.push('ListIdPage', {type:'Following', id: this.username})
  }


  onLogout() {
    this.authSer.logout().subscribe(d => console.log(""), e => console.log(""));
  }


  search() {
    this.navCtrl.push("SearchPage", { profile: "people" , myChurch: false});
  }


  addAsFriend(username: string) {
    this.isButtonDisabled = true;
    this.membSer.addAsFriend(username).subscribe(
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


  cancelFriendReq(username: string) {
    this.isButtonDisabled = true;
    this.membSer.cancelFriendReq(username).subscribe(
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


  handlefriendReq(username: string, approval: boolean) {
    this.isButtonDisabled = true;
    this.membSer.handleFriendReq(username, approval).subscribe(
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


  unfriend(username: string) {
    this.isButtonDisabled = true;
    const confirm = this.alertCtrl.create({
      title: 'Are you sure?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
          }
        },
        {
          text: 'Unfriend',
          handler: () => {
            this.unfriendConfirm(username);
          }
        }
      ]
    });
    confirm.present();
  }

  unfriendConfirm(username) {
    this.membSer.unfriend(username).subscribe(
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
            }
          },
          {
            text: 'Report',
            icon: !this.platform.is('ios') ? 'alert' : null,
            handler: () => {
            }
          },
          {
            text: 'Cancel',
            role: 'cancel', // will always sort to be on the bottom
            icon: !this.platform.is('ios') ? 'close' : null,
            handler: () => {
            }
          }
        ]
      }
    );
    options.present();
  }

  sharePrayerReq(index: number) {
    var subject = "Prayer Request by " + this.prayerReq[index].username;
    var mssg = this.prayerReq[index].body;
    var url = 'https://vinti-app.herokuapp.com/vinti.apk';

    this.prayerSer.sharePr(mssg, subject, url, this.prayerReq[index].proPic);
  }

  goToChurch(churchId) {
    if(churchId === this.authSer.getChurchId()) {
      this.navCtrl.parent.select(3);
    } else {
      this.navCtrl.push('ChurchPage', {churchId});
    }
  }
}
