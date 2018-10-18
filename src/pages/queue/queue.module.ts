import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QueuePage } from './queue';
import { SafePipe } from '../../pipes/safe/safe';
@NgModule({
  declarations: [
    QueuePage,
    SafePipe
  ],
  imports: [
    IonicPageModule.forChild(QueuePage),
  ],
  exports: [
    SafePipe
  ]
})
export class QueuePageModule {}
