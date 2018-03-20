import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../services/auth';

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  isLeader: boolean;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private authSer: AuthService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
    this.isLeader = this.authSer.isLeader();
  }

  onLogout() {
    this.authSer.logout()
      .subscribe(() => {
        this.navCtrl.setRoot('HomePage');
      }, err => {
        console.log('Error');
      });
  }

  onEditProfile() {
    this.navCtrl.push('EditProfilePage');
  }

  onEditChurch() {
    this.navCtrl.push('EditChurchPage');
  }

  onUpdate() {

  }
}
