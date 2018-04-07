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
    console.log(val, profile);
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
            console.log("No hits");
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
          console.log("Something went wrong");
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
            console.log("No hits");
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
          console.log("Something went wrong");
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
    console.log("pro");
    this.navCtrl.push("MemberPage", { username });
  }

  goToChurch(churchId: string, isInterested: boolean) {
    this.navCtrl.push("ChurchPage", { churchId , isInterested });
  }

  // member
  addAsFriend(username: string) {
    this.isButtonDisabled = true;
    console.log("added", username);
    this.membSer.addAsFriend(username).subscribe(
      doc => {
        this.isButtonDisabled = false;
        console.log("success");
        // change icon
      },
      err => {
        this.isButtonDisabled = false;
        var toast = this.toastCtrl.create({
          message: "Could not connect to Server",
          duration: 3000
        });
        toast.present();
        console.log("Error");
      }
    );
  }

  cancelFriendReq(username: string) {
    this.isButtonDisabled = true;
    this.membSer.cancelFriendReq(username).subscribe(
      doc => {
        this.isButtonDisabled = false;
        console.log("success");
        // change icon
      },
      err => {
        this.isButtonDisabled = false;
        var toast = this.toastCtrl.create({
          message: "Could not connect to Server",
          duration: 3000
        });
        toast.present();
        console.log("Error");
      }
    );
  }

  handlefriendReq(username: string, approval: boolean) {
    this.isButtonDisabled = true;
    console.log(approval, username);
    this.membSer.handleFriendReq(username, approval).subscribe(
      doc => {
        this.isButtonDisabled = false;
        console.log("success");
        // change icon
      },
      err => {
        this.isButtonDisabled = false;
        var toast = this.toastCtrl.create({
          message: "Could not connect to Server",
          duration: 3000
        });
        toast.present();
        console.log("Error");
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
        console.log("success");
        // change icon
      },
      err => {
        this.isButtonDisabled = false;
        var toast = this.toastCtrl.create({
          message: "Could not connect to Server",
          duration: 3000
        });
        toast.present();
        console.log("Error");
      }
    );
  }

  cancelfollow(churchId: string) {
    this.isButtonDisabled = true;
    this.churchSer.cancelfollowReq(churchId).subscribe(
      doc => {
        this.isButtonDisabled = false;
        console.log("success");
        // change icon
      },
      err => {
        this.isButtonDisabled = false;
        var toast = this.toastCtrl.create({
          message: "Could not connect to Server",
          duration: 3000
        });
        toast.present();
        console.log("Error");
      }
    );
  }

  pendingFollowReq(churchId: string) {
    return this.membSer.pendingFollowReq(churchId);
  }

  following(churchId: string) {
    return this.membSer.iffollowing(churchId);
  }

  //Member
  // sendMembReq(churchId: string) {
  //   this.churchSer.sendMembReq(churchId).subscribe(
  //     doc => {
  //       console.log("success");
  //     },
  //     err => {
  //       console.log("Erooorr");
  //     }
  //   );
  // }

  // cancelMembReq(churchId: string) {
  //   this.churchSer.cancelMembReq(churchId).subscribe(
  //     doc => {
  //       console.log("success");
  //     },
  //     err => {
  //       console.log("Erooorr");
  //     }
  //   );
  // }

  pendingMembReq(churchId: string) {
    return this.membSer.pendingMembReq() === churchId;
  }
}
