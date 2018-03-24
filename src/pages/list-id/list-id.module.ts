import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListIdPage } from './list-id';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    ListIdPage
  ],
  imports: [
    IonicPageModule.forChild(ListIdPage),
    PipesModule
  ],
})
export class ListIdPageModule {}
