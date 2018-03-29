import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  Title: String = 'Vinti';

  constructor(public navCtrl: NavController) {
  }

  toRegister(): void {
    this.navCtrl.push('RegisterPage');
  }

  toLogin(): void {
    this.navCtrl.push('LoginPage');
  }
}
