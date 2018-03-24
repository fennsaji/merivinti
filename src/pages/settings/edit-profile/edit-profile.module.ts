import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditProfilePage } from './edit-profile';
import { PipesModule } from '../../../pipes/pipes.module';

@NgModule({
  declarations: [
    EditProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(EditProfilePage),
    PipesModule
  ],
})
export class EditProfilePageModule {}
