import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { RegisterPage } from '../register/register';
import { LoginPage } from '../login/login';

// @IonicPage()
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
    this.navCtrl.push(RegisterPage);
  }

  toLogin(): void {
    this.navCtrl.push(LoginPage);
  }
}
