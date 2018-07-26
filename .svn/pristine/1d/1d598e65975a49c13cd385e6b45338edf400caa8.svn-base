import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NgForm, FormsModule } from '@angular/forms';
import { SelectSearchableComponent } from 'ionic-select-searchable';

import { ReapService } from '../../services/reap-service';

class Equipment {
  public ID: number;
  public EquipmentType: string;
  public Unit:string;
}
@IonicPage()
@Component({
  selector: 'page-equipment',
  templateUrl: 'equipment.html',
})
export class EquipmentPage {
  private equipmentType:any[] = [];
  private equipmentArray: Equipment[];
  private test:any = [];
  equipment: Equipment;
  private Type:any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public reap: ReapService) {

          this.equipmentType = reap.equipmentType;
          this.equipmentArray = reap.getEquipment;
            //console.log(this.equipmentArray);


  }
  typeSelected(){
    this.equipmentArray = this.reap.getEquipment;
    this.test = [];
    //console.log('test');
    for(var i=0; i <this.equipmentArray.length;i++){
      //console.log(this.equipmentArray[i]['EquipmentType']);
      //console.log(this.Type);
      if(this.equipmentArray[i]['EquipmentType']===this.Type){
          //console.log('here');
          this.test.push(this.equipmentArray[i]);
      }

    }
    this.equipmentArray = this.test;
    //console.log(this.test);
    //console.log(this.equipmentArray);
  }
  onSubmit(form: NgForm){
    //console.log(form.value);
    this.reap.totalEquipment(form.value);
    this.navCtrl.pop();
  }
  equipmentChange(event: { component: SelectSearchableComponent, value: any }) {
        //console.log('value:', event.value);
    }

}
