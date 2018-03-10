import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  Title: String = 'Upasana';

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }

  toRegister(): void {
    this.navCtrl.push('RegisterPage');
  }

  toLogin(): void {
    this.navCtrl.push('LoginPage');
  }
}
