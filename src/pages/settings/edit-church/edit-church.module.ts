import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditChurchPage } from './edit-church';
import { PipesModule } from '../../../pipes/pipes.module';

@NgModule({
  declarations: [
    EditChurchPage,
  ],
  imports: [
    IonicPageModule.forChild(EditChurchPage),
    PipesModule
  ],
})
export class EditChurchPageModule {}
