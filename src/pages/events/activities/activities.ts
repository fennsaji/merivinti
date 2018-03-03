import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

// @IonicPage()
@Component({
  selector: 'page-activities',
  templateUrl: 'activities.html',
})
export class ActivitiesPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ActivitiesPage');
  }

}
