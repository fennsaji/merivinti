import { AuthService } from './../../../services/auth';
import { Component } from '@angular/core';
import { IonicPage, NavController, ActionSheetController, Platform, ToastController } from 'ionic-angular';
import { ChurchService } from '../../../services/church';
import { NgForm } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera';

@IonicPage()
@Component({
  selector: 'page-edit-church',
  templateUrl: 'edit-church.html',
})
export class EditChurchPage {
  churchName: string;
  proPic: string;
  isLoading: boolean;
  options: CameraOptions;

  constructor(public navCtrl: NavController,
    private churchSer: ChurchService,
    private actionSheet: ActionSheetController,
    private platform: Platform,
    private authSer: AuthService,
    private camera: Camera,
    private toastCtrl: ToastController) {
  }

  ionViewDidEnter() {
    console.log('ionViewDidLoad EditChurchPage');
    this.churchName = this.churchSer.getChurchName();
    this.proPic = this.churchSer.getProPic();
  }

  onSelectPhoto() {
    const options = this.actionSheet.create(
      {
        title: 'Select Profile Pic',
        cssClass: 'action-sheets-basic-page',
        buttons: [
          {
            text: 'Camera',
            icon: !this.platform.is('ios') ? 'camera' : null,
            handler: () => {
              this.options = {
                quality: 40,
                destinationType: this.camera.DestinationType.DATA_URL,
                encodingType: this.camera.EncodingType.JPEG,
                targetWidth: 300,
                targetHeight: 300
              }
              this.takePic();
            }
          },
          {
            text: 'Gallery',
            icon: !this.platform.is('ios') ? 'share' : null,
            handler: () => {
              this.options = {
                quality: 40,
                destinationType: this.camera.DestinationType.DATA_URL,
                encodingType: this.camera.EncodingType.JPEG,
                mediaType: this.camera.MediaType.PICTURE,
                sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
                targetWidth: 300,
                targetHeight: 300
              }
              this.takePic();
            }
          }
        ]
      }
    );
    options.present();
  }

  takePic() {
    if(this.authSer.ifonDevice()) {
      this.camera.getPicture(this.options).then((imageData) => {
        // imageData is either a base64 encoded string or a file URI
        // If it's base64:
        let base64Image = 'data:image/jpeg;base64,' + imageData;
        console.log(imageData);
        this.proPic = base64Image;
       }, (err) => {
        var toast = this.toastCtrl.create({
          message: "Could not take Pic",
          duration: 3000
        });
        toast.present();
        // Handle error
       });
    } else {
      var toast = this.toastCtrl.create({
        message: "Not yet supported in PWA",
        duration: 3000
      });
      toast.present();
    }
  }


  onUpdate(form: NgForm) {
    var updatedPro = {
      churchName: form.value.churchName,
      proPic: this.proPic
    };
    console.log(updatedPro);
    this.churchSer.updateProfile(updatedPro)
      .subscribe(d => {
        console.log('Success');
        this.navCtrl.pop();
      }, err => {
        console.log('error');
        var toast = this.toastCtrl.create({
          message: "Unable to connect to server",
          duration: 3000
        });
        toast.present();
      });
  }
}
