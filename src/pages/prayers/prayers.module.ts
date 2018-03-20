import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PrayersPage } from './prayers';
import { safeHtml } from '../../pipes/safe-html';

@NgModule({
  declarations: [
    PrayersPage,
    safeHtml
  ],
  imports: [
    IonicPageModule.forChild(PrayersPage),
  ],
})
export class PrayersPageModule {}
