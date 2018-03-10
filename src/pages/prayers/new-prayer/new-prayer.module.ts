import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewPrayerPage } from './new-prayer';

@NgModule({
  declarations: [
    NewPrayerPage,
  ],
  imports: [
    IonicPageModule.forChild(NewPrayerPage),
  ],
})
export class ActivitiesPageModule {}
