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
  prayerReq : IPrayerReq[] = [
    {
      _id: '1',
      // proPic: 'abc',
      // name: 'Fenn',
      username: 'fennsaji',
      churchId: 'mfbChurch',
      body: 'This is a Prayer Request',
      date: Date(),
      shareWith: 'me'
    },{
      _id: '2',
      // proPic: 'aca',
      // name: 'Fenn',
      username: 'fennsaji',
      churchId: 'mfbChurch',
      body: 'This is a Prayer Request',
      date: Date(),
      shareWith: 'me'
    }
  ];

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

  loadPrayers(refresher) {
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

  loadOldPrayers(infinitescroll) {
    var date = this.prayerReq[this.prayerReq.length-2].date;
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
}
