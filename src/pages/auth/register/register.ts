import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, IonicPage, ToastController } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth';
import { HttpClient } from '@angular/common/http';


@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage implements OnInit{
  reg: string = "member";
  churchForm: FormGroup;
  membForm: FormGroup;
  isLoading: boolean;
  url: string;

  constructor(public navCtrl: NavController,
    private http: HttpClient,
      public navParams: NavParams,
      private authSer: AuthService,
      public toastCtrl: ToastController) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
    this.url = this.authSer.globalUrl + 'auth/';
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
        'leadId': new FormControl(null,
          [Validators.required, Validators.minLength(6), Validators.pattern('^[a-zA-Z0-9]+$')],
          this.checkUsername.bind(this)),
        'password': new FormControl(null, [Validators.required,  Validators.minLength(6)])
      }),
      'churchName': new FormControl(null, Validators.required),
      'churchId': new FormControl(null,
        [Validators.required, Validators.minLength(6), Validators.pattern('^[a-zA-Z0-9]+$')],
        this.checkChurchId.bind(this)),
    });
  }

  initMember() {
    this.membForm = new FormGroup({
      'name': new FormControl(null, Validators.required),
      'username': new FormControl(null,
        [Validators.required, Validators.minLength(6), Validators.pattern('^[a-zA-Z0-9]+$')],
        this.checkUsername.bind(this)),
      'churchId': new FormControl(null),
      'password': new FormControl(null, [Validators.required, Validators.minLength(6)])
    });
  }


  checkUsername(control: FormControl): Promise<any> {
    console.log(control.value);
    return new Promise<any>(res => {
      this.http.post<any>(this.url + 'checkUname', {username: control.value})
        .subscribe((doc) =>{
          console.log(doc);
          if(doc.success) {
            let toast = this.toastCtrl.create({
              message: 'Username already exists',
              duration: 3000
            });
            toast.present();
            res({"Username already exists": true})
          } else {
            res(null)
          }
        }, err => {
          console.log(err);
        })
    })
  }

  // Async Validator
  checkChurchId(control: FormControl): Promise<any> {
    console.log(control.value);
    return new Promise<any>(res => {
      if(this.authSer.isOnline()){
        this.http.post<any>(this.url + 'checkChurch', {churchId: control.value})
        .subscribe((doc) =>{
          console.log(doc);
          if(doc.success) {
            let toast = this.toastCtrl.create({
              message: 'ChurchId already exists',
              duration: 3000
            });
            toast.present();
            res({"ChurchId already exists": true})
          } else {
            res(null);
          }
        }, err => {
          console.log(err);
          res(null);
        })
      } else {
        res(null);
        let toast = this.toastCtrl.create({
          message: 'No Internet Connection',
          duration: 3000
        });
        toast.present();
      }
    })
  }

  onRegister(type: String): void {
    this.isLoading = true;
    if(this.authSer.isOnline()) {
      if(type === 'church') {
        console.log(this.churchForm.value);
        this.authSer.regChurch(this.churchForm.value).subscribe(data => {
          console.log('data1', data);
          this.navCtrl.setRoot('TabsPage');
        }, err => {
          this.isLoading = false;
          console.log(err.error);
          let toast = this.toastCtrl.create({
            message: "Something Went Wrong",
            duration: 3000
          });
          toast.present();
        });

      } else if (type === 'memb') {
        console.log(this.membForm.value);
        this.authSer.regMember(this.membForm.value).subscribe(data => {
          console.log('data' ,data);
          this.navCtrl.setRoot('TabsPage');
        }, err => {
          this.isLoading = false;
          if(err.error.errObj) {
            let toast = this.toastCtrl.create({
              message: err.error.errObj.msg,
              duration: 3000
            });
            toast.present();
          } else {
            let toast = this.toastCtrl.create({
            message: "Something Went Wrong",
            duration: 3000
          });
          toast.present();
          }
          console.log(err.error);
        });
      }
    } else {
      this.isLoading = false;
      var toast = this.toastCtrl.create({
        message: "No internet Connection",
        duration: 3000
      });
      toast.present();
    }
  }

}
