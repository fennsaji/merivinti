import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
import { IPrayerReq } from '../../models/prayerReq.model';
import { PrayerService } from '../../services/prayer';

@IonicPage()
@Component({
  selector: 'page-prayers',
  templateUrl: 'prayers.html',
})
export class PrayersPage {
  prayerReq : IPrayerReq[] = [];

  constructor(public navCtrl: NavController,
      public navParams: NavParams,
      private prayerSer: PrayerService) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad PrayersPage');
    this.prayerSer.initializeAndGetPr()
      .then((pr: IPrayerReq[]) => {
        console.log('prr', pr)
        this.prayerReq = [...pr];
        this.loadPrayers(null);
        console.log('2', this.prayerReq)
      })
      .catch(e => {
        console.log('error loading old pr');
      });
  }

  getDate(date) {
    return new Date(date).getMilliseconds() - new Date().getMilliseconds();
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
    this.navCtrl.push('NewPrayerPage');
  }

  search(): void {
    console.log('clicked');
    this.navCtrl.push('SearchPage', {profile: 'people'});
  }
}
