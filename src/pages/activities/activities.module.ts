import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ActivitiesPage } from './activities';
import { safeHtml } from '../../pipes/safe-html';

@NgModule({
  declarations: [
    ActivitiesPage,
    safeHtml
  ],
  imports: [
    IonicPageModule.forChild(ActivitiesPage),
  ],
})
export class ActivitiesPageModule {}
