import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
import { ChurchService } from '../../../services/church';
import { AuthService } from '../../../services/auth';

@IonicPage()
@Component({
  selector: 'page-church',
  templateUrl: 'church.html',
})
export class ChurchPage implements OnInit{
  churchId: string = 'mfbchurch';
  myProfile: boolean;
  church;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private churchSer: ChurchService,
    private authSer: AuthService) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChurchPage');
  }

  ngOnInit() {
    this.church = {
      church: {
        churchName: '1',
        churchId: '2',
        noOfFollowers: 0,
        noOfLeaders: 0,
        noOfMembers: 0,
        noOfPost: 0
      },
      prayerReq: []
    };
    if(this.navParams.get('churchId')) {
      this.churchId = this.navParams.get('churchId');
      console.log(this.churchId);
    } else {
      this.churchId = this.authSer.getChurchId();
    }
    this.churchSer.getChurchProfile(this.churchId)
      .subscribe(doc => {
        this.church = doc;
        console.log('doc', doc);
      }, err => {
        console.log('Something went wrong');
      });
  }

  search() {
    this.navCtrl.push('SearchPage', {profile: 'church'});
  }
}
