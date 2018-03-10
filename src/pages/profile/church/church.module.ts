import { NgModule } from '@angular/core';
import { ChurchPage } from './church';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
    ChurchPage,
  ],
  imports: [
    IonicPageModule.forChild(ChurchPage)
  ],
})
export class ChurchPageModule {}
