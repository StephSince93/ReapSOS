import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { SelectSearchableComponent } from 'ionic-select-searchable';

import { ReapService } from '../../services/reap-service';

class Personnel {
  public ID: number;
  public FullName: string;
  private personnelArray:any[] = [];
}
@IonicPage()
@Component({
  selector: 'page-labor',
  templateUrl: 'labor.html',
})
export class LaborPage {
  private personnelArray: Personnel[];
  personnel: Personnel;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public reap: ReapService) {
                this.personnelArray = this.reap.getPersonnel;
                //console.log(this.personnelArray);
  }

  onSubmit(form: NgForm){
    //console.log(form.value);
    this.reap.totalLabor(form.value);
    this.navCtrl.pop();
  }
  personnelChange(event: { component: SelectSearchableComponent, value: any }) {
        //console.log('value:', event.value);
    }

}
