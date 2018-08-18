import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, App } from 'ionic-angular';
import { AuthService } from '../../services/auth';
import { AppUpdate } from '@ionic-native/app-update';

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage { 
  isLeader: boolean;
  notify: boolean;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private appUpdate: AppUpdate,
    private app: App,
    private authSer: AuthService,
    public toastCtrl: ToastController) {
  }

  ionViewDidLoad() {
    this.isLeader = this.authSer.isLeader();

    if(this.authSer.ifonDevice())
    this.notify = this.authSer.isNotifyEnabled();
  }

  onOpenProfile() {
    this.navCtrl.push('MemberPage');
  }

  onLogout() {
    this.authSer.logout()
      .subscribe(() => {
        this.app.getRootNav().setRoot('HomePage');
      }, err => {
        var toast = this.toastCtrl.create({
          message: "Could not Connect to Server",
          duration: 3000
        });
        toast.present();
      });
  }

  onEditProfile() {
    this.navCtrl.push('EditProfilePage');
  }

  onEditChurch() {
    this.navCtrl.push('EditChurchPage');
  }

  onUpdate() {
    if(this.authSer.ifonDevice()) {
      const updateUrl = this.authSer.globalUrl + 'update.xml';
      this.appUpdate.checkAppUpdate(updateUrl).then(() => {});
    }
  }

  onToggleNotify() {
    if(this.notify == false) {
      this.authSer.unscheduleNotification();
    } else {
      this.authSer.scheduleNotification();
    }
  }

  onDevice() {
    return this.authSer.ifonDevice()
  }
}
