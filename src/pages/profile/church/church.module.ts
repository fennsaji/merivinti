import { NgModule } from '@angular/core';
import { ChurchPage } from './church';
import { IonicPageModule } from 'ionic-angular';
import { PipesModule } from '../../../pipes/pipes.module';

@NgModule({
  declarations: [
    ChurchPage
  ],
  imports: [
    IonicPageModule.forChild(ChurchPage),
    PipesModule
  ],
})
export class ChurchPageModule {}
