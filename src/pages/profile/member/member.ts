import { Component, OnInit } from "@angular/core";
import { NavController, NavParams, IonicPage } from "ionic-angular";
import { AuthService } from "../../../services/auth";
import { MemberService } from "../../../services/member";

@IonicPage()
@Component({
  selector: "page-member",
  templateUrl: "member.html"
})
export class MemberPage implements OnInit {
  username: string;
  profile;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private authSer: AuthService,
    private membSer: MemberService
  ) {}

  ngOnInit() {
    this.profile = {
      member: {
        name: "absadsjdhdj",
        username: "sfafadfs",
        noOfFollowing: 0,
        noOfFriends: 0,
        noOfPost: 0,
        churchId: "asfasdfaf"
      },
      prayerReq: []
    };
    if(this.navParams.get('username')) {
      this.username = this.navParams.get('username');
      console.log(this.username);
    } else {
      this.username = this.authSer.getUsername();
    }
    this.membSer.getMembProfile(this.username)
      .subscribe(doc => {
        this.profile = doc;
        console.log('doc', this.profile);
      }, err => {
        console.log('Something went wrong');
      });
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad MemberPage");
  }

  onLogout() {
    this.authSer.logout().subscribe(d => console.log(d), e => console.log(e));
  }

  search() {
    this.navCtrl.push("SearchPage", { profile: "people" , myChurch: false});
  }
}
