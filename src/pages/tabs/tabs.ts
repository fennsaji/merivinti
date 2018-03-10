import { Component, OnInit } from '@angular/core';


@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage implements OnInit{

  tab1 = 'PrayersPage';
  tab2 = 'ActivitiesPage';
  tab3 = 'MemberPage';
  tab4 = 'ChurchPage';


  constructor() {}

  ngOnInit() {

  }
}
