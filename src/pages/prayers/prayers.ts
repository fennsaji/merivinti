import { Component } from '@angular/core';
import { NavController,AlertController, NavParams, IonicPage, ModalController, ActionSheetController, Platform, ToastController } from 'ionic-angular';
import { IPrayerReq } from '../../models/prayerReq.model';
import { PrayerService } from '../../services/prayer';
import { AuthService } from '../../services/auth';
import { MemberService } from '../../services/member';

@IonicPage()
@Component({
  selector: 'page-prayers',
  templateUrl: 'prayers.html'
})
export class PrayersPage {
  prayerReq : IPrayerReq[] = [];
  isLoading: boolean;
  username: string;
  url: string;

  constructor(public navCtrl: NavController,
      public navParams: NavParams,
      private prayerSer: PrayerService,
      private modalCtrl: ModalController,
      public platform: Platform,
      public toastCtrl: ToastController,
      private authSer: AuthService,
      private membSer: MemberService,
      public alertCtrl: AlertController,
      public actionSheet: ActionSheetController) {}

  ionViewDidLoad() {
    this.isLoading = true;
    this.url = this.authSer.globalUrl + 'profile/';
    this.username = this.authSer.getUsername();
    this.prayerSer.initializeAndGetPr()
      .then((pr: IPrayerReq[]) => {
        this.prayerReq = [...pr];
        this.loadPrayers(null);
        this.isLoading = false;
      })
      .catch(e => {
        this.isLoading = false;
        var toast = this.toastCtrl.create({
          message: "Error Loading from Storage",
          duration: 3000
        });
        toast.present();
      });
  }

  loadPrayers(refresher): void {
    if(this.authSer.isOnline()) {
      this.prayerSer.loadPrayerReq()
      .subscribe((doc: IPrayerReq[]) => {
        this.prayerReq = [...doc];
        if(refresher) {
          refresher.complete();
        }
      }, err => {
        var toast = this.toastCtrl.create({
          message: "Unable to Refresh",
          duration: 3000
        });
        toast.present();
        if(refresher) {
          refresher.complete();
        }
      });
    } else {
      if(refresher) {
        refresher.complete();
      }
      var toast = this.toastCtrl.create({
        message: "No internet Connection",
        duration: 3000
      });
      toast.present();
    }
  }

  loadOldPrayers(infinitescroll): void {
    var date = this.prayerReq[this.prayerReq.length-1].date;
    if(this.authSer.isOnline()) {
      this.prayerSer.loadOldPr(date)
      .subscribe(doc => {
        if(doc) {
          this.prayerReq.push(...doc);
        } 
        infinitescroll.complete();
      }, err => {
        infinitescroll.complete();
      });
    } else {
      infinitescroll.complete();
    }
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

  search(): void {
    this.navCtrl.push('SearchPage', {profile: 'people'});
  }

  getProPicUser(username: string) {
    return this.membSer.getProPicUser(username)
      .subscribe(proPic => {
        return proPic;
      });
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
              this.presentAlert(prayerId, index);
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

  deletePRConfirm(prayerId, index) {
    this.prayerSer.deletePr(prayerId)
    .subscribe(doc => {
      this.prayerReq.splice(index, 1);
    })
  }

  presentAlert(prayerId, index) {
    const confirm = this.alertCtrl.create({
      title: 'Are you sure?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
          }
        },
        {
          text: 'Delete',
          handler: () => {
            this.deletePRConfirm(prayerId, index);
          }
        }
      ]
    });
    confirm.present();
  }

  sharePrayerReq(index: number) {
    var subject = "Prayer Request by " + this.prayerReq[index].username;
    var mssg = this.prayerReq[index].body;
    var url = 'https://vinti-app.herokuapp.com/vinti.apk';

    this.prayerSer.sharePr(mssg, subject, url, this.prayerReq[index].proPic);
  }

  goToProfile(username: string) {
    if(username === this.authSer.getUsername()) {
      this.navCtrl.push("MemberPage");
    } else {
      this.navCtrl.push("MemberPage", { username });
    }
  }

  goToChurchPro(churchId) {
    if(churchId === this.authSer.getChurchId()) {
      this.navCtrl.parent.select(2);
    } else {
      this.navCtrl.push("ChurchPage", { churchId });
    }
  }
}
