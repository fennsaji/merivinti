import { MessagingService } from './../../services/messaging';
import { ActivitiesService } from './../../services/activities';
import { Component, OnInit } from "@angular/core";
import { IonicPage, Events } from "ionic-angular";
import { ChurchService } from "../../services/church";
import { MemberService } from "../../services/member";
import { Network } from "@ionic-native/network";

@IonicPage()
@Component({
  templateUrl: "tabs.html"
})
export class TabsPage implements OnInit {
  newNotify: number;
  newChurchNotify: number = 0;
  newProfileNotify: number = 0;

  tab1 = "PrayersPage";
  tab2 = "ActivitiesPage";
  tab3 = "ChurchPage";
  tab4 = "SettingsPage";

  constructor(
    private churchSer: ChurchService,
    private membSer: MemberService,
    private network: Network,
    private actSer: ActivitiesService,
    public events: Events,
    private messSer: MessagingService
  ) {}

  ngOnInit() {
    this.initializePages();
  }

  initializePages() {
    this.events.subscribe("profileNotify:updated", data => {
      this.newProfileNotify = data;
      this.newNotify = this.newChurchNotify + this.newProfileNotify;
    });

    this.events.subscribe("churchNotify:updated", data => {
      this.newChurchNotify = data;
      this.newNotify = this.newChurchNotify + this.newProfileNotify;
    });

    this.network.onConnect().subscribe(ev => {
      this.churchSer.initialize();
      this.membSer.initialize();
    });

    this.churchSer.initialize();
    this.membSer.initialize();
    this.actSer.initialize();
    this.messSer.initMessaging();
  }
}
