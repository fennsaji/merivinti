import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ToastController,
  ActionSheetController,
  Platform
} from "ionic-angular";
import { MemberService } from "../../services/member";
import { ChurchService } from "../../services/church";
import { AuthService } from "../../services/auth";

@IonicPage()
@Component({
  selector: "page-list-id",
  templateUrl: "list-id.html"
})
export class ListIdPage {
  isMyChurchAndLeader: boolean;
  isMyChurchAndMainLeader: boolean;
  id: string;
  url: string;
  type: string;
  lists: any[];
  lists2: any[];
  isLoading: boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private churchSer: ChurchService,
    private membSer: MemberService,
    public actionSheet: ActionSheetController,
    public platform: Platform,
    public toastCtrl: ToastController,
    private authSer: AuthService
  ) {}

  ionViewDidLoad() {
    this.url = this.authSer.globalUrl + 'profile/';
    console.log("ionViewDidLoad ListIdPage");
  }

  ionViewDidEnter() {
    this.isLoading = true;
    this.type = this.navParams.get("type");
    this.id = this.navParams.get("id");
    this.isMyChurchAndLeader =
      this.authSer.isLeader() && this.id === this.authSer.getChurchId();
    if (this.isMyChurchAndLeader) {
      this.isMyChurchAndMainLeader = this.churchSer.isMainLeader(
        this.authSer.getUsername()
      );
    } else {
      this.isMyChurchAndMainLeader = false;
    }
    this.resolveList();
    console.log(this.type, this.id);
  }

  resolveList() {
    if (this.authSer.isOnline()) {
      switch (this.type) {
        case "Friends":
          this.membSer.getInfoFriends(this.id).subscribe(
            doc => {
              this.lists = doc.friends;
              console.log(doc);
              this.isLoading = false;
            },
            err => {
              // toast
              this.isLoading = false;
              var toast = this.toastCtrl.create({
                message: "Error Loading from Server",
                duration: 3000
              });
              toast.present();
              console.log("error loading");
            }
          );
          break;
        case "Following":
          this.membSer.getInfoFollowings(this.id).subscribe(
            doc => {
              this.lists = doc.following;
              console.log(doc);
              this.isLoading = false;
            },
            err => {
              // toast
              this.isLoading = false;
              var toast = this.toastCtrl.create({
                message: "Error Loading from Server",
                duration: 3000
              });
              toast.present();
              console.log("error loading");
            }
          );
          break;
        case "Leaders":
          this.churchSer.getInfoLeaders(this.id).subscribe(
            doc => {
              this.lists = doc.leaders;
              this.isLoading = false;
              console.log(doc);
            },
            err => {
              // toast
              this.isLoading = false;
              var toast = this.toastCtrl.create({
                message: "Error Loading from Server",
                duration: 3000
              });
              toast.present();
              console.log("error loading");
            }
          );
          break;
        case "Members":
          console.log("Members");
          this.churchSer.getInfoMembers(this.id).subscribe(
            doc => {
              this.lists = doc.members;
              console.log(doc);
              this.churchSer.getInfoFollowers(this.id).subscribe(
                doc => {
                  this.lists2 = doc.followers;
                  this.isLoading = false;
                  console.log(doc);
                },
                err => {
                  // toast
                  this.isLoading = false;
                  var toast = this.toastCtrl.create({
                    message: "Error Loading from Server",
                    duration: 3000
                  });
                  toast.present();
                  console.log("error loading");
                }
              );
            },
            err => {
              // toast
              this.isLoading = false;
              var toast = this.toastCtrl.create({
                message: "Error Loading from Server",
                duration: 3000
              });
              toast.present();
              console.log("error loading");
            }
          );
          break;
      }
    } else {
      var toast = this.toastCtrl.create({
        message: "No internet Connection",
        duration: 3000
      });
      toast.present();
      this.isLoading = false;
    }
  }

  // add alert
  options(type: string, username: string, index: number) {
    if (type === "Member") {
      if(this.isMyChurchAndMainLeader) {
        const options = this.actionSheet.create({
          title: "Member",
          cssClass: "action-sheets-basic-page",
          buttons: [
            {
              text: "Remove",
              icon: !this.platform.is("ios") ? "remove-circle" : null,
              handler: () => {
                console.log('rempving Member');
                this.removeMember(username, index);
              }
            },
            {
              text: "Add as Leader",
              icon: !this.platform.is("ios") ? "briefcase" : null,
              handler: () => {
                this.churchSer.addAsLeader(username).subscribe(
                  () => {
                    this.lists.splice(index, 1);
                    if (this.lists.length == 0) {
                      this.lists = undefined;
                    }
                  },
                  err => {
                    var toast = this.toastCtrl.create({
                      message: "Could Not Connect to Server",
                      duration: 3000
                    });
                    toast.present();
                    // toast
                  }
                );
              }
            }
          ]
        });
        options.present();
      } else {
        this.removeMember(username, index);
      }

    } else if (type === "Follower") {
      this.churchSer.removefollower(username).subscribe(
        () => {
          console.log('rempving followr');
          this.lists2.splice(index, 1);
          if (this.lists2.length == 0) {
            this.lists2 = undefined;
          }
        },
        err => {
          var toast = this.toastCtrl.create({
            message: "Could Not Connect to Server",
            duration: 3000
          });
          toast.present();
          // toast
        }
      );

    } else if (type === "Leader") {
      if(this.isMyChurchAndMainLeader) {
        const options = this.actionSheet.create({
          title: "Leader",
          cssClass: "action-sheets-basic-page",
          buttons: [
            {
              text: "Remove",
              icon: !this.platform.is("ios") ? "remove-circle" : null,
              handler: () => {
                console.log('rempving leader');
                this.removeLeader(username, index);
              }
            },
            {
              text: "Promote",
              icon: !this.platform.is("ios") ? "ribbon" : null,
              handler: () => {
                this.churchSer.promoteLeader(username).subscribe(
                  () => {
                    this.lists.splice(index, 1);
                    if (this.lists.length == 0) {
                      this.lists = undefined;
                    }
                  },
                  err => {
                    var toast = this.toastCtrl.create({
                      message: "Could Not Connect to Server",
                      duration: 3000
                    });
                    toast.present();
                    // toast
                  }
                );
              }
            }
          ]
        });
        options.present();
      }
    }
  }

  removeMember(username, index) {
    this.churchSer.removeMember(username).subscribe(
      () => {
        this.lists.splice(index, 1);
        if (this.lists.length == 0) {
          this.lists = undefined;
        }
      },
      err => {
        var toast = this.toastCtrl.create({
          message: "Could Not Connect to Server",
          duration: 3000
        });
        toast.present();
        // toast
      }
    );
  }

  removeLeader(username, index) {
    this.churchSer.removeLeader(username).subscribe(
      () => {
        this.lists.splice(index, 1);
        if (this.lists.length == 0) {
          this.lists = undefined;
        }
      },
      err => {
        var toast = this.toastCtrl.create({
          message: "Could Not Connect to Server",
          duration: 3000
        });
        toast.present();
        // toast
      }
    );
  }

  goToProfile(username: string) {
    this.navCtrl.push("MemberPage", { username });
  }

  notMe(username: string) {
    return username !== this.authSer.getUsername();
  }
}
