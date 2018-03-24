import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { AuthService } from '../../services/auth';
import { MemberService } from '../../services/member';

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  isLeader: boolean;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private authSer: AuthService,
    public toastCtrl: ToastController,
    private membSer: MemberService) {
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
        var toast = this.toastCtrl.create({
          message: "Could not Connect to Server",
          duration: 3000
        });
        toast.present();
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
