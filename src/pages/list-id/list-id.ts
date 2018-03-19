import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
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
  id: string;
  type: string;
  lists: any[];
  lists2: any[];
  isLoading: boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private churchSer: ChurchService,
    private membSer: MemberService,
    private authSer: AuthService
  ) {}

  ionViewDidLoad() {
    console.log("ionViewDidLoad ListIdPage");
  }

  ionViewDidEnter() {
    this.isLoading = true;
    this.type = this.navParams.get("type");
    this.id = this.navParams.get("id");
    this.isMyChurchAndLeader = this.authSer.isLeader() && this.id === this.authSer.getChurchId();
    this.resolveList();
    console.log(this.type, this.id);
  }

  resolveList() {
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
            console.log("error loading");
          }
        );
        break;
      case "Members":
      console.log('Members');
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
                console.log("error loading");
              }
            );
          },
          err => {
            // toast
            console.log("error loading");
          }
        );
        break;
    }
  }

  // add alert
  remove(type: string, username: string, index: number) {
    if(type === 'Member') {
      this.churchSer.removeMember(username)
        .subscribe(() => {
          this.lists.splice(index, 1);
        }, err => {
        // toast
        });
    } else if(type === 'Follower') {
      this.churchSer.removefollower(username)
        .subscribe(() => {
          this.lists.splice(index, 1);
        }, err => {
          // toast
        });
    }
  }

  goToProfile(username: string) {
    this.navCtrl.push("MemberPage", { username });
  }
}
