import { NgModule } from '@angular/core';
import { ChurchPage } from './church';
import { IonicPageModule } from 'ionic-angular';
import { safeHtml } from '../../../pipes/safe-html';

@NgModule({
  declarations: [
    ChurchPage,
    safeHtml
  ],
  imports: [
    IonicPageModule.forChild(ChurchPage)
  ],
})
export class ChurchPageModule {}
