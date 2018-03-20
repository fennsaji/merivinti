import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListIdPage } from './list-id';
import { safeHtml } from '../../pipes/safe-html';

@NgModule({
  declarations: [
    ListIdPage,
    safeHtml
  ],
  imports: [
    IonicPageModule.forChild(ListIdPage),
  ],
})
export class ListIdPageModule {}
