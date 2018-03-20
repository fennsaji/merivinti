import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { ChurchService } from '../../../services/church';

@IonicPage()
@Component({
  selector: 'page-new-notify',
  templateUrl: 'new-notify.html',
})
export class NewNotifyPage {
  isLoading: boolean;

  constructor(public navCtrl: NavController,
    private churchSer: ChurchService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewNotifyPage');
  }

  onSubmit(form: NgForm) {
    var newNotify = {
      body: form.value.body,
      by: 'church',
      date: new Date()
    };
    this.churchSer.pushNotifications(newNotify)
      .subscribe(res => {
        this.navCtrl.pop();
      });
  }

  ondiscard(form: NgForm) {
    this.navCtrl.pop();
  }

}
