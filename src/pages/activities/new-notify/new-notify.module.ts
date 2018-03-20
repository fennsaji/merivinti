import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewNotifyPage } from './new-notify';

@NgModule({
  declarations: [
    NewNotifyPage,
  ],
  imports: [
    IonicPageModule.forChild(NewNotifyPage),
  ],
})
export class NewNotifyPageModule {}
