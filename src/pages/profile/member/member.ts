import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

// @IonicPage()
@Component({
  selector: 'page-member',
  templateUrl: 'member.html',
})
export class MemberPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MemberPage');
  }

}
