import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth';

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage implements OnInit{
  reg: string = "member";
  churchForm: FormGroup;
  membForm: FormGroup;

  constructor(public navCtrl: NavController,
      public navParams: NavParams,
      private authSer: AuthService) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
    // this.initChurch();
    // this.initMember();
  }

  ngOnInit() {
    this.initChurch();
    this.initMember();
  }

  initChurch() {
    this.churchForm = new FormGroup({
      'leaders': new FormGroup({
        'leadName': new FormControl(null, Validators.required),
        'leadId': new FormControl(null, [Validators.required]),
        'password': new FormControl(null, Validators.required)
      }),
      'churchName': new FormControl(null, Validators.required),
      'churchId': new FormControl(null, [Validators.required]),
    });
  }

  initMember() {
    this.membForm = new FormGroup({
      'name': new FormControl(null, Validators.required),
      'username': new FormControl(null, [Validators.required]),
      'churchId': new FormControl(null),
      'password': new FormControl(null, Validators.required)
    });
  }

  onRegister(type: String): void {
    if(type === 'church') {
      console.log(this.churchForm.value);
      this.authSer.regChurch(this.churchForm.value).subscribe(data => {
        console.log('data1', data);
        this.navCtrl.setRoot('TabsPage');
      }, err => {
        console.log(err);
      });
    } else if (type === 'memb') {
      console.log(this.membForm.value);
      this.authSer.regMember(this.membForm.value).subscribe(data => {
        console.log('data' ,data);
        this.navCtrl.setRoot('TabsPage');
      }, err => {
        console.log(err);
      });
    }
  }

}
