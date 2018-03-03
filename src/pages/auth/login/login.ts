import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../../services/auth';
import { TabsPage } from '../../tabs/tabs';

// @IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  constructor(public navCtrl: NavController,
      public navParams: NavParams,
      private authSer: AuthService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  onLogin(f: NgForm): void {
    this.navCtrl.setRoot(TabsPage);
    console.log('console', f.value);
    this.authSer.login(f.value).subscribe(data => {
      console.log(data);
      this.navCtrl.setRoot(TabsPage);
    }, err => {
      console.log(err);
    });
  }
}
