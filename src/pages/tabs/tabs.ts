import { Component } from '@angular/core';
import { PrayersPage } from '../prayers/prayers';
import { ActivitiesPage } from '../events/activities/activities';
import { MemberPage } from '../profile/member/member';
import { ChurchPage } from '../profile/church/church';



@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1 = PrayersPage;
  tab2 = ActivitiesPage;
  tab3 = MemberPage;
  tab4 = ChurchPage;


  constructor() {

  }
}
