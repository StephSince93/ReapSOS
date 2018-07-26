import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { MiscPage } from '../misc/misc';
import { LaborPage } from '../labor/labor';
import { EquipmentPage } from '../equipment/equipment';
import { AddPhotoPage } from '../add-photo/add-photo';
import { SafetyReviewPage } from '../safety-review/safety-review';
import { ReapService } from '../../services/reap-service';
@IonicPage()
@Component({
  selector: 'page-sub-menu',
  templateUrl: 'sub-menu.html',
})
export class SubMenuPage {

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public reap: ReapService) {

  }

  ionViewDidLoad() {

  }
  toMisc(){
    this.navCtrl.push(MiscPage);
  }
  toLabor(){
    this.navCtrl.push(LaborPage);
  }
  toEquipment(){
    this.navCtrl.push(EquipmentPage);
  }
  toPhoto(){
      this.navCtrl.push(AddPhotoPage);
  }
  toReview(){
    this.navCtrl.push(SafetyReviewPage);
  }

}
