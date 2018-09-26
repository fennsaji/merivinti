import { AuthService } from './../../../services/auth';
import { Component } from '@angular/core';
import { IonicPage, Platform, ActionSheetController, NavController, ToastController } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { MemberService } from '../../../services/member';
import { Camera, CameraOptions } from '@ionic-native/camera';

@IonicPage()
@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',
})
export class EditProfilePage {
  isLoading: boolean;
  name: string;
  proPic: string;
  options: CameraOptions;

  constructor(private membSer: MemberService,
    private actionSheet: ActionSheetController,
    private platform: Platform,
    private camera: Camera,
    private navCtrl: NavController,
    private authSer: AuthService,
    private toastCtrl: ToastController) {
  }

  ionViewDidEnter() {
    this.name =  this.membSer.getName();
    this.proPic = this.membSer.getProPic();
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
      name: form.value.name,
      proPic: this.proPic
    };
    this.membSer.updateProfile(updatedPro)
      .subscribe(d => {
        this.navCtrl.pop();
      }, err => {
        var toast = this.toastCtrl.create({
          message: "Unable to connect to server",
          duration: 3000
        });
        toast.present();
      });
  }

}
