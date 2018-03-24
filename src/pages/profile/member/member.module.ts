import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MemberPage } from './member';
import { PipesModule } from '../../../pipes/pipes.module';

@NgModule({
  declarations: [
    MemberPage
  ],
  imports: [
    IonicPageModule.forChild(MemberPage),
    PipesModule
  ],
})
export class ActivitiesPageModule {}
