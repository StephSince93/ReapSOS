import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { ReapService } from '../../services/reap-service';
@IonicPage()
@Component({
  selector: 'page-success',
  templateUrl: 'success.html',
})
export class SuccessPage {
  successMessage:any;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public reap: ReapService) {
                this.successMessage = this.navParams.get('Success');
                  }
  ionViewDidLoad(){
    this.reap.equipment = [];
    this.reap.extraLabor = [];
    this.reap.misc = [];
    this.reap.photo = [];
    this.reap.job = [];
  }
    backToMenu(){
      this.navCtrl.popTo(this.navCtrl.getByIndex(1));//pops to menu page
    }
}
