import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { ChurchService } from '../../../services/church';
import { AuthService } from '../../../services/auth';

@IonicPage()
@Component({
  selector: 'page-new-notify',
  templateUrl: 'new-notify.html',
})
export class NewNotifyPage {
  isLoading: boolean;

  constructor(public navCtrl: NavController,
    private churchSer: ChurchService,
    private authSer: AuthService,
    public toastCtrl: ToastController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewNotifyPage');

  }

  onSubmit(form: NgForm) {
    var newNotify = {
      body: form.value.body,
      by: 'church',
      date: new Date(),
      proPic: this.churchSer.getProPic()
    };
    console.log(newNotify);
    if(this.authSer.isOnline()) {
      this.churchSer.pushNotifications(newNotify)
      .subscribe(res => {
        this.navCtrl.pop();
      }, err => {
        var toast = this.toastCtrl.create({
          message: "Unable to Connect to Server",
          duration: 3000
        });
        toast.present();
      });
    } else {
      var toast = this.toastCtrl.create({
        message: "No internet Connection",
        duration: 3000
      });
      toast.present();
    }
  }

  ondiscard(form: NgForm) {
    this.navCtrl.pop();
  }

}
