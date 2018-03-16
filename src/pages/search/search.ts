import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ChurchService } from '../../services/church';
import { MemberService } from '../../services/member';

@IonicPage()
@Component({
  selector: "page-search",
  templateUrl: "search.html"
})
export class SearchPage implements OnInit {
  Churches: Array<any>;
  People: Array<any>;
  getMyChurch: boolean;
  profile: string = "people";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private churchSer: ChurchService,
    private membSer: MemberService
  ) {}

  ionViewDidLoad() {
    console.log("ionViewDidLoad SearchPage");
  }

  ngOnInit() {
    this.profile = this.navParams.get("profile");
    this.getMyChurch = this.navParams.get("myChurch");
  }

  // Add spinner
  onSearch(ev: any, profile: string) {
    let val = ev.target.value;
    console.log(val, profile);
    if (profile === "people" && val && val.trim() != "") {
      this.membSer.searchUsers(val).subscribe(
        data => {
          if (!data) {
            console.log("No hits");
          }
          this.People = data;
        },
        err => {
          console.log("Something went wrong");
        }
      );
    } else if (profile === "church" && val && val.trim() != "") {
      this.churchSer.searchChurch(val).subscribe(
        data => {
          if (!data) {
            console.log("No hits");
          }
          this.Churches = data;
        },
        err => {
          console.log("Something went wrong");
        }
      );
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
    console.log("added", username);
    this.membSer.addAsFriend(username).subscribe(
      doc => {
        console.log("success");
        // change icon
      },
      err => {
        console.log("Error");
      }
    );
  }

  cancelFriendReq(username: string) {
    this.membSer.cancelFriendReq(username).subscribe(
      doc => {
        console.log("success");
        // change icon
      },
      err => {
        console.log("Error");
      }
    );
  }

  handlefriendReq(username: string, approval: boolean) {
    console.log(approval, username);
    this.membSer.handleFriendReq(username, approval).subscribe(
      doc => {
        console.log("success");
        // change icon
      },
      err => {
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
    this.churchSer.followChurch(churchId).subscribe(
      doc => {
        console.log("success");
        // change icon
      },
      err => {
        console.log("Error");
      }
    );
  }

  cancelfollow(churchId: string) {
    this.churchSer.cancelfollowReq(churchId).subscribe(
      doc => {
        console.log("success");
        // change icon
      },
      err => {
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
  sendMembReq(churchId: string) {
    this.churchSer.sendMembReq(churchId).subscribe(
      doc => {
        console.log("success");
      },
      err => {
        console.log("Erooorr");
      }
    );
  }

  cancelMembReq(churchId: string) {
    this.churchSer.cancelMembReq(churchId).subscribe(
      doc => {
        console.log("success");
      },
      err => {
        console.log("Erooorr");
      }
    );
  }

  pendingMembReq(churchId: string) {
    return this.membSer.pendingMembReq() === churchId;
  }
}
