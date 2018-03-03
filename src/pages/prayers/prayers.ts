import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

// @IonicPage()
@Component({
  selector: 'page-prayers',
  templateUrl: 'prayers.html',
})
export class PrayersPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PrayersPage');
  }

}
