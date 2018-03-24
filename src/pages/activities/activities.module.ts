import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ActivitiesPage } from './activities';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    ActivitiesPage
  ],
  imports: [
    IonicPageModule.forChild(ActivitiesPage),
    PipesModule
  ],
})
export class ActivitiesPageModule {}
