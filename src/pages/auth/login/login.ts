import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage, ToastController } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../../services/auth';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  username: string;
  password: string;
  isLoading: boolean;

  constructor(public navCtrl: NavController,
      public navParams: NavParams,
      private authSer: AuthService,
      public toastCtrl: ToastController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  onLogin(f: NgForm): void {
    this.isLoading = true;
    if(this.authSer.isOnline()) {
      this.authSer.login(f.value).subscribe(data => {
        console.log('data', data);
        this.isLoading = false;
        this.navCtrl.setRoot('TabsPage');
      }, err => {
        this.isLoading = false;;
        let toast;
        if(err.error.msgObj) {
          var msg;
          if(!err.error.msgObj)
            msg = 'Unknown Error';
          else
            msg = err.error.msgObj.mssg;

          if(err.error.msgObj.errNo == 7){
            this.username = '';
            this.password = '';
          }
          if(err.error.msgObj.errNo == 6)
            this.password = '';
          if(msg) {
            toast = this.toastCtrl.create({
              message: msg,
              duration: 3000
            });
          }
          else {
            toast = this.toastCtrl.create({
              message: "Something went wrong",
              duration: 3000
            });
            toast.present();
          }
        } else {
          toast = this.toastCtrl.create({
            message: "Something went wrong",
            duration: 3000
          });
          toast.present();
        }
        console.log('error', err.error, this.username);
      });
    } else {
      var toast = this.toastCtrl.create({
        message: "No internet Connection",
        duration: 3000
      });
      toast.present();
    }
    console.log('console', f.value);
  }
}
