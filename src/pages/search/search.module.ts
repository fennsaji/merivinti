import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchPage } from './search';
import { safeHtml } from '../../pipes/safe-html';

@NgModule({
  declarations: [
    SearchPage,
    safeHtml
  ],
  imports: [
    IonicPageModule.forChild(SearchPage),
  ],
})
export class SearchPageModule {}
