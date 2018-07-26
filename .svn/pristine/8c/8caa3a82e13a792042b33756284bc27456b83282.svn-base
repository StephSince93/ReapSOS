import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NgForm } from '@angular/forms';

import { ReapService } from '../../services/reap-service';
@IonicPage()
@Component({
  selector: 'page-mileage',
  templateUrl: 'mileage.html',
})
export class MileagePage {

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public reap: ReapService) {
  }

  onSubmit(form: NgForm){
    //console.log(form.value);
    this.reap.totalMileage(form.value);
    this.navCtrl.pop();
  }

}
