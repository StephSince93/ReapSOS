import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NgForm } from '@angular/forms';

import { ReapService } from '../../services/reap-service';
@IonicPage()
@Component({
  selector: 'page-misc',
  templateUrl: 'misc.html',
})
export class MiscPage {
  miscCategory:any[] = [];
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public reap: ReapService) {
                //temporary
                this.miscCategory = reap.equipmentType;
  }

  onSubmit(form: NgForm){
    //console.log(form.value);
    this.reap.totalMisc(form.value);
    this.navCtrl.pop();
  }

}
