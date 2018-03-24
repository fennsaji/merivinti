import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PrayersPage } from './prayers';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    PrayersPage
  ],
  imports: [
    IonicPageModule.forChild(PrayersPage),
    PipesModule
  ],
})
export class PrayersPageModule {}
