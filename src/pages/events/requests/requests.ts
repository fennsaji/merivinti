import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';


// @IonicPage()
@Component({
  selector: 'page-requests',
  templateUrl: 'requests.html',
})
export class RequestsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RequestsPage');
  }

}
