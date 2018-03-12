import { Component, OnInit } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { ChurchService } from '../../services/church';
import { MemberService } from '../../services/member';

@IonicPage()
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage implements OnInit{
  newNotifications: number;

  tab1 = 'PrayersPage';
  tab2 = 'ActivitiesPage';
  tab3 = 'MemberPage';
  tab4 = 'ChurchPage';


  constructor(private churchSer: ChurchService,
      private membSer: MemberService) {}

  ngOnInit() {
    this.initializePages();
  }

  initializePages() {
    this.churchSer.initialize();
    this.membSer.initialize();
    // notifications
  }
}
