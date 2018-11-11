import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NgForm, FormsModule } from '@angular/forms';
import { SelectSearchableComponent } from 'ionic-select-searchable';

import { ReapService } from '../../services/reap-service';

class EquipmentList {
  public ID: number;
  public Name:string;
}
@IonicPage()
@Component({
  selector: 'page-equipment',
  templateUrl: 'equipment.html',
})
export class EquipmentPage {
  private equipmentType:any[] = [];
  private equipmentArray: EquipmentList[];
  private test:any = [];
  equipment: EquipmentList;
  private Type:any;
  private crewEquipment = this.reap.globalCrewEquipment;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public reap: ReapService) {
                 //console.log(this.crewEquipment);
          //this.equipmentType = reap.equipmentType;
          this.equipmentArray = reap.getEquipment;
            //console.log(this.equipmentArray);


  }
  onSubmit(form: NgForm){
    //console.log(form);
    let test =  [];
    let hours:any = 'hours';
    let endingOdometer:any = 'endingOdometer';
    if(this.reap.globalCrewEquipment||this.crewEquipment){
    for(let i=0;i<this.reap.globalCrewEquipment.length;i++){
      if((this.crewEquipment[i]['endingOdometer']&&(form.value[endingOdometer+[i]]==""))){
          //Filler for data alreday in system
      }else{
      this.crewEquipment[i]={'ID':this.reap.globalCrewEquipment[i]['ID']
                ,'Name':this.reap.globalCrewEquipment[i]['Name']
                ,'Odometer':this.reap.globalCrewEquipment[i]['Odometer']
                ,'endingOdometer':form.value[endingOdometer+[i]]
                // ,'each':form.value[hours+[i]]};
              }
          }
       }
     }
  this.reap.globalCrewEquipment = this.crewEquipment;
  // console.log(this.reap.globalCrewEquipment);
  if(form.value.Equipment!=undefined){
  //console.log(form.value.Equipment);
  let equipment = {'ID':form.value.Equipment.ID,
                    'Name':form.value.Equipment.Name,
                    'Odometer':form.value.Equipment.Odometer,
                    'endingOdometer':form.value.endingOdometer};
                    //console.log(equipment);
  this.reap.totalEquipment(equipment);
    }
  this.navCtrl.pop();
  }
  equipmentChange(event: { component: SelectSearchableComponent, value: any }) {
        //console.log('value:', event.value);
    }

}
