import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../../services/auth';

@IonicPage()
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
    console.log('console', f.value);
    this.authSer.login(f.value).subscribe(data => {
      console.log('data', data);
      this.navCtrl.setRoot('TabsPage');
    }, err => {
      console.log('error', err);
    });
  }
}
