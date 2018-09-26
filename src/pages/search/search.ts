import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { ChurchService } from '../../services/church';
import { MemberService } from '../../services/member';
import { AuthService } from '../../services/auth';

@IonicPage()
@Component({
  selector: "page-search",
  templateUrl: "search.html"
})
export class SearchPage implements OnInit {
  Churches: Array<any>;
  People: Array<any>;
  isLoading: boolean;
  profile: string = "people";
  isButtonDisabled = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    private churchSer: ChurchService,
    private membSer: MemberService,
    public authSer: AuthService
  ) {}

  ngOnInit() {
    this.profile = this.navParams.get("profile");
    this.membSer.getbasicinfo().subscribe();
    if(this.authSer.isLeader())
    this.churchSer.getbasicinfo().subscribe();
    if(!this.authSer.isOnline()) {
      var toast = this.toastCtrl.create({
        message: "No Internet Connection!!",
        duration: 3000
      });
      toast.present();
    }
  }

  // Add spinner
  onSearch(ev: any, profile: string) {
    this.isLoading = true;
    this.isButtonDisabled = true;
    let val = ev.target.value;
    if (profile === "people" && val && val.trim() != "") {
      this.membSer.searchUsers(val).subscribe(
        data => {
          this.isButtonDisabled = false;
          this.isLoading = false;
          if (data.length === 0) {
            var toast = this.toastCtrl.create({
              message: "No hits!!",
              duration: 3000
            });
            toast.present();
          }
          this.People = data;
        },
        err => {
          this.isButtonDisabled = false;
          this.isLoading = false;
          var toast = this.toastCtrl.create({
            message: "Unable to connect to server",
            duration: 3000
          });
          toast.present();
        }
      );
    } else if (profile === "church" && val && val.trim() != "") {
      this.churchSer.searchChurch(val).subscribe(
        data => {
          this.isButtonDisabled = false;
          this.isLoading = false;
          if (data.length === 0) {
            var toast = this.toastCtrl.create({
              message: "No hits!!",
              duration: 3000
            });
            toast.present();
          }
          this.Churches = data;
        },
        err => {
          var toast = this.toastCtrl.create({
            message: "Unable to connect to server",
            duration: 3000
          });
          toast.present();
          this.isButtonDisabled = false;
          this.isLoading = false;
        }
      );
    } else {
      this.isLoading = false;
      this.isButtonDisabled = false;
    }
  }

  onClose() {
    this.navCtrl.pop();
  }

  goToProfile(username: string) {
    this.navCtrl.push("MemberPage", { username });
  }

  goToChurch(churchId: string, isInterested: boolean) {
    this.navCtrl.push("ChurchPage", { churchId , isInterested });
  }

  // member
  addAsFriend(username: string) {
    this.isButtonDisabled = true;
    this.membSer.addAsFriend(username).subscribe(
      doc => {
        this.isButtonDisabled = false;
        // change icon
      },
      err => {
        this.isButtonDisabled = false;
        var toast = this.toastCtrl.create({
          message: "Could not connect to Server",
          duration: 3000
        });
        toast.present();
      }
    );
  }

  cancelFriendReq(username: string) {
    this.isButtonDisabled = true;
    this.membSer.cancelFriendReq(username).subscribe(
      doc => {
        this.isButtonDisabled = false;
        // change icon
      },
      err => {
        this.isButtonDisabled = false;
        var toast = this.toastCtrl.create({
          message: "Could not connect to Server",
          duration: 3000
        });
        toast.present();
      }
    );
  }

  handlefriendReq(username: string, approval: boolean) {
    this.isButtonDisabled = true;
    this.membSer.handleFriendReq(username, approval).subscribe(
      doc => {
        this.isButtonDisabled = false;
        // change icon
      },
      err => {
        this.isButtonDisabled = false;
        var toast = this.toastCtrl.create({
          message: "Could not connect to Server",
          duration: 3000
        });
        toast.present();
      }
    );
  }

  isFriend(username: string) {
    return this.membSer.isAFriend(username);
  }

  isPendingFriend(username: string) {
    return this.membSer.isPendingFriend(username);
  }

  hasRequested(username: string) {
    return this.membSer.hasRequested(username);
  }

  // church
  followChurch(churchId: string) {
    this.isButtonDisabled = true;
    this.churchSer.followChurch(churchId).subscribe(
      doc => {
        this.isButtonDisabled = false;
        // change icon
      },
      err => {
        this.isButtonDisabled = false;
        var toast = this.toastCtrl.create({
          message: "Could not connect to Server",
          duration: 3000
        });
        toast.present();
      }
    );
  }

  cancelfollow(churchId: string) {
    this.isButtonDisabled = true;
    this.churchSer.cancelfollowReq(churchId).subscribe(
      doc => {
        this.isButtonDisabled = false;
        // change icon
      },
      err => {
        this.isButtonDisabled = false;
        var toast = this.toastCtrl.create({
          message: "Could not connect to Server",
          duration: 3000
        });
        toast.present();
      }
    );
  }

  pendingFollowReq(churchId: string) {
    return this.membSer.pendingFollowReq(churchId);
  }

  following(churchId: string) {
    return this.membSer.iffollowing(churchId);
  }

  pendingMembReq(churchId: string) {
    return this.membSer.pendingMembReq() === churchId;
  }
}
