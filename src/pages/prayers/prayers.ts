import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage, ModalController, ActionSheetController, Platform, ToastController } from 'ionic-angular';
import { IPrayerReq } from '../../models/prayerReq.model';
import { PrayerService } from '../../services/prayer';
import { AuthService } from '../../services/auth';
import { SocialSharing } from '@ionic-native/social-sharing';
import { MemberService } from '../../services/member';
import { DomSanitizer } from "@angular/platform-browser";

@IonicPage()
@Component({
  selector: 'page-prayers',
  templateUrl: 'prayers.html'
})
export class PrayersPage {
  prayerReq : IPrayerReq[] = [];
  isLoading: boolean;
  username: string;

  constructor(public navCtrl: NavController,
      public navParams: NavParams,
      private prayerSer: PrayerService,
      private modalCtrl: ModalController,
      public platform: Platform,
      public toastCtrl: ToastController,
      private authSer: AuthService,
      private membSer: MemberService,
      public actionSheet: ActionSheetController,
      private socialSharing: SocialSharing,
      public sanitizer: DomSanitizer) {}

  ionViewDidLoad() {
    this.isLoading = true;
    this.username = this.authSer.getUsername();
    console.log('ionViewDidLoad PrayersPage');
    this.prayerSer.initializeAndGetPr()
      .then((pr: IPrayerReq[]) => {
        this.isLoading = false;
        console.log('prr', pr)
        this.prayerReq = [...pr];
        this.loadPrayers(null);
        console.log('2', this.prayerReq)
      })
      .catch(e => {
        this.isLoading = false;
        var toast = this.toastCtrl.create({
          message: "Error Loading from Storage",
          duration: 3000
        });
        toast.present();
        console.log('error loading old pr');
      });
  }

  loadPrayers(refresher): void {
    if(this.authSer.isOnline()) {
      this.prayerSer.loadPrayerReq()
      .subscribe(doc => {
        console.log('fromdB', doc);
        this.prayerReq = [...doc];
        if(refresher) {
          refresher.complete();
        }
      }, err => {
        console.log('unable to refresh');
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
        } else {
          console.log('No more feed to load')
        }
        console.log('fromdB2', doc);
        infinitescroll.complete();
      }, err => {
        console.log('unable to refresh2');
        infinitescroll.complete();
      });
    } else {
      infinitescroll.complete();
      var toast = this.toastCtrl.create({
        message: "No internet Connection",
        duration: 3000
      });
      toast.present();
    }
  }

  createNewPrayer(): void {
    // this.navCtrl.push('NewPrayerPage');
    const modal = this.modalCtrl.create('NewPrayerPage');
    modal.present();
    modal.onDidDismiss((newPr) => {
      console.log(newPr);
      if(!newPr) {
        return;
      }
      this.prayerReq.unshift(newPr);
    });
  }

  search(): void {
    console.log('clicked');
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
    this.socialSharing.share(mssg, subject, null, null)
      .then(() => {
        console.log('shared');
      })
      .catch(err => {
        console.log('not shared');
      });
  }
}
