import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage, ViewController } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../../services/auth';
import { PrayerService } from '../../../services/prayer';

@IonicPage()
@Component({
  selector: 'page-new-prayer',
  templateUrl: 'new-prayer.html',
})
export class NewPrayerPage {

  constructor(public navCtrl: NavController,
      public navParams: NavParams,
      private authSer: AuthService,
      private prayerSer: PrayerService,
      private viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewPrayerPage');
  }

  // Make it modal page
  onSubmit(f: NgForm) {
    console.log(f.value);
    var newPr = f.value;
    newPr.date = new Date();
    newPr.username = this.authSer.getUsername();
    console.log(newPr);
    this.prayerSer.addNewPr(newPr)
      .subscribe(res => {
        this.viewCtrl.dismiss(res.newPr);
      }, err => {
        console.log('Error', err);
      });
  }

  ondiscard(f: NgForm) {
    // check pristine
    if(!f.pristine) {
      // alert
    }
    this.viewCtrl.dismiss();
    console.log(f.pristine);
  }
}
