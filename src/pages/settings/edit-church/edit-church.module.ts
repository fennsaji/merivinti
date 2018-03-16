import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditChurchPage } from './edit-church';

@NgModule({
  declarations: [
    EditChurchPage,
  ],
  imports: [
    IonicPageModule.forChild(EditChurchPage),
  ],
})
export class EditChurchPageModule {}
