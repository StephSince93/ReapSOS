import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { SelectSearchableComponent } from 'ionic-select-searchable';
import { NgForm } from '@angular/forms';

import { ReapService } from '../../services/reap-service';

class EquipmentList {
  public ID: number;
  public Name:string;
  public Name2: string;
}

@IonicPage()
@Component({
  selector: 'page-add-extra-equipment',
  templateUrl: 'add-extra-equipment.html',
})
export class AddExtraEquipmentPage {
  public extraEquipmentArray: EquipmentList[];
  equipment: EquipmentList;
  private noSubmission:boolean = true;
  private jobCost:any;
  private tempEquipment:any [] = [];
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public reap: ReapService,
              public viewCtrl: ViewController) {
      try{
        if(this.reap.selectedJob!=null){
          this.jobCost=this.reap.selectedJob['Cost_Center_Code'];
          this.jobCost = this.jobCost.replace("2", "1");//Replaces the 1 on the Cost Center
          for(let key in this.reap.getEquipment){
              if(this.reap.getEquipment[key]['Cost_Center']===this.jobCost){
              this.tempEquipment.push(this.reap.getEquipment[key]);
              }
            }
          }
      this.extraEquipmentArray = this.tempEquipment;
      }catch{
      this.reap.presentAlert('Error','Error Grabbing API data, please re-sync in settings','Dismiss')
        this.viewCtrl.dismiss(this.noSubmission);
      }
  }

  submitEquipment(form: NgForm){
     this.viewCtrl.dismiss(form.value);
  }

  equipmentChange(event: { component: SelectSearchableComponent, value: any }) {
  }
  dismissModal(){
     this.viewCtrl.dismiss(this.noSubmission);
  }
}
