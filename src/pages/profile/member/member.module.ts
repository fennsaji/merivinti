import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MemberPage } from './member';
import { safeHtml } from '../../../pipes/safe-html';

@NgModule({
  declarations: [
    MemberPage,
    safeHtml
  ],
  imports: [
    IonicPageModule.forChild(MemberPage),
  ],
})
export class ActivitiesPageModule {}
