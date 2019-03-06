import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { NgForm, FormsModule } from '@angular/forms';
import { SelectSearchableComponent } from 'ionic-select-searchable';

import { ReapService } from '../../services/reap-service';
import { AddExtraEquipmentPage } from '../add-extra-equipment/add-extra-equipment';

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
  public equipmentType:any[] = [];
  public equipmentArray: EquipmentList[];
  public test:any = [];
  equipment: EquipmentList;
  public Type:any;
  public crewEquipment = this.reap.globalCrewEquipment;
  public doeshaveCrew:boolean = false;
  public equipmentInfo:any [] = [];
  public totalExtraEquipment:any [] = [];
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public reap: ReapService,
              public modalCtrl: ModalController) {
          //this.equipmentType = reap.equipmentType;
          try{
          this.equipmentArray = reap.getEquipment;
          }catch{
          this.reap.presentAlert('Error','Error Grabbing API data, please re-sync in settings','Dismiss')
          this.navCtrl.pop();
          }
          //console.log(this.equipmentArray);
          if(!Array.isArray(this.crewEquipment) || !this.crewEquipment.length)
          {this.doeshaveCrew = false;}  else{this.doeshaveCrew = true;}
  }
  onSubmit(form: NgForm){
    //console.log(form);
    let test =  [];
    //let hours:any = 'hours';
    //let endingOdometer:any = 'endingOdometer';
    //if(this.reap.globalCrewEquipment||this.crewEquipment){
    //for(let i=0;i<this.reap.globalCrewEquipment.length;i++){
      // if((this.crewEquipment[i]['endingOdometer']&&(form.value[endingOdometer+[i]]==""))){
      //     //Filler for data alreday in system
      // }else{
      // this.crewEquipment[i]={'ID':this.reap.globalCrewEquipment[i]['ID']
      //           ,'Name':this.reap.globalCrewEquipment[i]['Name']
      //           // ,'Odometer':this.reap.globalCrewEquipment[i]['Odometer']
      //           // ,'endingOdometer':form.value[endingOdometer+[i]]
      //           // ,'each':form.value[hours+[i]]};
      //         }
      //     }
      //   }
      // }
  this.reap.globalCrewEquipment = this.crewEquipment;
  // console.log(this.reap.globalCrewEquipment);
  if(this.equipmentInfo!=undefined){
  for(let i=0;i<this.equipmentInfo.length;i++){
  this.totalExtraEquipment.push({'ID':this.equipmentInfo[i].Equipment.ID,
                          'Name':this.equipmentInfo[i].Equipment.Name,
                          'Name2':this.equipmentInfo[i].Equipment.Name2,
                          // 'endingOdometer':this.equipmentInfo[i].endingOdometer
                          });
                    //console.log(equipment);
  }
  this.reap.totalEquipment(this.totalExtraEquipment);
    }
  this.navCtrl.pop();
  }
  equipmentChange(event: { component: SelectSearchableComponent, value: any }) {
        //console.log('value:', event.value);
    }
  addEquipment(){
      const modal = this.modalCtrl.create(AddExtraEquipmentPage);

          modal.present();//presents the signature modal

           modal.onDidDismiss((returnParam: any) => {
             if(returnParam!=true){
               this.equipmentInfo.push(returnParam);
               //console.log(this.equipmentInfo);

             }
             else{
               //console.log('backed out of no chemical!');
            }
           });
  }
  removeEquipment(index){
    this.equipmentInfo.splice(index, 1);
    //console.log(this.equipmentDetails);
  }
  keyPress(event: any) {
      const pattern = /[0-9\+\-\ ]/;

      let inputChar = String.fromCharCode(event.charCode);
      if (event.keyCode != 8 && !pattern.test(inputChar)) {
        event.preventDefault();
    }
  }
  noEquipment(){
    //allows user to submit only if there is added equipment
    if(this.equipmentInfo!=[]&&this.equipmentInfo.length){
      return true;
    }
    else{
      return false;
    }
  }
}
