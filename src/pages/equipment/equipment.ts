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
    console.log(form.value);
    let test =  [];
    let hours:any = 'hours';

    if(this.reap.globalCrewEquipment||this.crewEquipment){
    for(let i=0;i<this.reap.globalCrewEquipment.length;i++){
      if((this.crewEquipment[i]['Hours']&&(form.value[hours+[i]]==""))){
          //Filler for data alreday in system
      }else{
      this.crewEquipment[i]={
                            'ID':this.reap.globalCrewEquipment[i]['ID']
                            ,'Cost_Center': this.reap.globalCrewEquipment[i]['Cost_Center']
                            ,'Equipment_Bill_Code': this.reap.globalCrewEquipment[i]['Equipment_Bill_Code']
                            ,'Name': this.reap.globalCrewEquipment[i]['Name']
                            ,'Name2': this.reap.globalCrewEquipment[i]['Name2']
                            ,'Hours':form.value[hours+[i]]
                            };
          }
         }
       }
  this.reap.globalCrewEquipment = this.crewEquipment;
  // console.log(this.reap.globalCrewEquipment);
  if(this.equipmentInfo!=undefined){
  for(let i=0;i<this.equipmentInfo.length;i++){
  this.totalExtraEquipment.push({
    'ID':this.equipmentInfo[i]['Equipment']['ID']
    ,'Cost_Center': this.equipmentInfo[i]['Equipment']['Cost_Center']
    ,'Equipment_Bill_Code': this.equipmentInfo[i]['Equipment']['Equipment_Bill_Code']
    ,'Name': this.equipmentInfo[i]['Equipment']['Name']
    ,'Name2': this.equipmentInfo[i]['Equipment']['Name2']
    ,'Hours':this.equipmentInfo[i]['Hours'],
    });
  }
  console.log(this.equipmentInfo);
  console.log(this.totalExtraEquipment);
  console.log(this.crewEquipment);
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
    const pattern = /[0-9\.\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  doeshaveEquipment(){
    //allows user to submit only if there is added equipment
    if((this.equipmentInfo!=[]&&this.equipmentInfo.length)||(this.crewEquipment!=[]&&this.crewEquipment.length)){
      return true;
    }
    else{
      return false;
    }
  }
}
