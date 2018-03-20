import { Component, OnInit } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { ChurchService } from '../../services/church';
import { MemberService } from '../../services/member';
import { AuthService } from '../../services/auth';

@IonicPage()
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage implements OnInit{
  newNotify: number;
  newChurchNotify: number;

  tab1 = 'PrayersPage';
  tab2 = 'ActivitiesPage';
  tab3 = 'MemberPage';
  tab4 = 'ChurchPage';


  constructor(private churchSer: ChurchService,
      private membSer: MemberService,
      private authSer: AuthService) {}

  ngOnInit() {
    this.initializePages();
  }

  initializePages() {
    this.churchSer.initialize();
    this.membSer.initialize();
    // notifications
    this.membSer.newNotify.subscribe(data => {
      this.newNotify = data;
    });
    if(this.authSer.isLeader()) {
      this.churchSer.newNotify.subscribe(data => {
        this.newChurchNotify = data;
      });
    }
  }
}
