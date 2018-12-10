import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { SelectSearchableComponent } from 'ionic-select-searchable';
import { NgForm } from '@angular/forms';

import { ReapService } from '../../services/reap-service';

class EquipmentList {
  public ID: number;
  public Name:string;

}

@IonicPage()
@Component({
  selector: 'page-add-extra-equipment',
  templateUrl: 'add-extra-equipment.html',
})
export class AddExtraEquipmentPage {
  private extraEquipmentArray: EquipmentList[];
  equipment: EquipmentList;
  private noSubmission:boolean = true;
  private projectCost:any;
  private tempEquipment:any [] = [];
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public reap: ReapService,
              public viewCtrl: ViewController) {
                if(this.reap.globalCrewProject!=null){
                  this.projectCost=this.reap.globalCrewProject['CostCenter'];
                }
      for(let i=0;i<this.reap.getEquipment.length;i++){
          if(this.reap.getEquipment[i]['CostCenter']==this.projectCost){
          console.log(this.reap.getEquipment[i]);
          this.tempEquipment.push(this.reap.getEquipment[i]);
        }
      }
      this.extraEquipmentArray = this.tempEquipment;
  }

  submitEquipment(form: NgForm){
    //console.log(form.value);
     this.viewCtrl.dismiss(form.value);
  }

  equipmentChange(event: { component: SelectSearchableComponent, value: any }) {
          //console.log('value:', event.value);
          //console.log(this.globalEquipment);
  }
  dismissModal(){
     this.viewCtrl.dismiss(this.noSubmission);
  }
}
