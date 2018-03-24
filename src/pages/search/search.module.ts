import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchPage } from './search';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    SearchPage
  ],
  imports: [
    IonicPageModule.forChild(SearchPage),
    PipesModule
  ],
})
export class SearchPageModule {}
