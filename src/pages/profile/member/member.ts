import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
import { AuthService } from '../../../services/auth';

@IonicPage()
@Component({
  selector: 'page-member',
  templateUrl: 'member.html',
})
export class MemberPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private authser: AuthService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MemberPage');
  }

  onLogout() {
    this.authser.logout().subscribe(d => console.log(d), e => console.log(e));
  }
}
