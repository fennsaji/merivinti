import { Component, OnInit } from '@angular/core';
import { IonicPage, Events } from 'ionic-angular';
import { ChurchService } from '../../services/church';
import { MemberService } from '../../services/member';
@IonicPage()
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage implements OnInit{
  newNotify: number;
  newChurchNotify: number = 0;
  newProfileNotify: number = 0;

  tab1 = 'PrayersPage';
  tab2 = 'ActivitiesPage';
  tab3 = 'MemberPage';
  tab4 = 'ChurchPage';


  constructor(private churchSer: ChurchService,
      private membSer: MemberService,
      public events: Events) {}

  ngOnInit() {
    this.initializePages();
  }

  initializePages() {
    console.log('tabs page');
    this.events.subscribe('profileNotify:updated', data => {
      console.log('notifudap', data);
      this.newProfileNotify = data;
      this.newNotify = this.newChurchNotify + this.newProfileNotify;
    });
    this.events.subscribe('churchNotify:updated', data => {
      console.log('notifudac', data);
      this.newChurchNotify = data;
      this.newNotify = this.newChurchNotify + this.newProfileNotify;
    });

    this.churchSer.initialize();
    this.membSer.initialize();
  }
}
