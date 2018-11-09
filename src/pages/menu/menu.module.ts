import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MenuPage } from './menu';
import { ReapService } from '../../services/reap-service';
import { ManageCrewPage } from '../manage-crew/manage-crew';
@NgModule({
  declarations: [
     //MenuPage,
  ],
  imports: [
    IonicPageModule.forChild(MenuPage),
  ],
  providers: [
    ReapService
    ]
})
export class MenuPageModule {}
