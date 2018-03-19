import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage, ModalController, ActionSheetController, Platform } from 'ionic-angular';
import { IPrayerReq } from '../../models/prayerReq.model';
import { PrayerService } from '../../services/prayer';

@IonicPage()
@Component({
  selector: 'page-prayers',
  templateUrl: 'prayers.html',
})
export class PrayersPage {
  prayerReq : IPrayerReq[] = [];
  isLoading: boolean;

  constructor(public navCtrl: NavController,
      public navParams: NavParams,
      private prayerSer: PrayerService,
      private modalCtrl: ModalController,
      public platform: Platform,
      public actionSheet: ActionSheetController) {}

  ionViewDidLoad() {
    this.isLoading = true;
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
        console.log('error loading old pr');
      });
  }

  loadPrayers(refresher): void {
    this.prayerSer.loadPrayerReq()
      .subscribe(doc => {
        console.log('fromdB', doc);
        this.prayerReq = [...doc];
        if(refresher) {
          refresher.complete();
        }
      }, err => {
        console.log('unable to refresh');
        if(refresher) {
          refresher.complete();
        }
      });
  }

  loadOldPrayers(infinitescroll): void {
    var date = this.prayerReq[this.prayerReq.length-1].date;
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

  loadPrayerOptions(prayerId: string) {
    const options = this.actionSheet.create(
      {
        title: 'Albums',
        cssClass: 'action-sheets-basic-page',
        buttons: [
          {
            text: 'Delete',
            role: 'destructive',
            icon: !this.platform.is('ios') ? 'trash' : null,
            handler: () => {
              console.log('Delete clicked');
            }
          },
          {
            text: 'Share',
            icon: !this.platform.is('ios') ? 'share' : null,
            handler: () => {
              console.log('Share clicked');
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
}
