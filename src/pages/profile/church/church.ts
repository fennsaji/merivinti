import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

// @IonicPage()
@Component({
  selector: 'page-church',
  templateUrl: 'church.html',
})
export class ChurchPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChurchPage');
  }

}
