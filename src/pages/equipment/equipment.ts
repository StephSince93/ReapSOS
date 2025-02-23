import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController,AlertController } from 'ionic-angular';
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
  public doeshaveAddedEquipment:boolean = false;
  public equipmentInfo:any [] = [];
  public totalExtraEquipment:any [] = [];
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public reap: ReapService,
              public modalCtrl: ModalController,
              public alertCtrl: AlertController) {
          //this.equipmentType = reap.equipmentType;
          try{
          this.equipmentArray = reap.getEquipment;
          if(!Array.isArray(this.reap.equipment) || !this.reap.equipment.length){
            this.equipmentInfo=[];
          }
          else{
            this.doeshaveAddedEquipment = true;
            this.equipmentInfo=this.reap.equipment;
          }
          }catch{
          this.reap.presentAlert('Error','Error Grabbing Equipment Data, please re-sync in settings','Dismiss')
          this.navCtrl.pop();
          }

          if(!Array.isArray(this.crewEquipment) || !this.crewEquipment.length)
          {this.doeshaveCrew = false;}  else{this.doeshaveCrew = true;}
  }
  onSubmit(form: NgForm){
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
  if(this.equipmentInfo!=undefined){
  for(let key in this.equipmentInfo){
    this.totalExtraEquipment.push({
      'ID':this.equipmentInfo[key]['ID']
      ,'Cost_Center': this.equipmentInfo[key]['Cost_Center']
      ,'Equipment_Bill_Code': this.equipmentInfo[key]['Equipment_Bill_Code']
      ,'Name': this.equipmentInfo[key]['Name']
      ,'Name2': this.equipmentInfo[key]['Name2']
      ,'Hours':this.equipmentInfo[key]['Hours'],
      });
    }
  this.reap.totalEquipment(this.totalExtraEquipment);
    }
  this.navCtrl.pop();
  }
  equipmentChange(event: { component: SelectSearchableComponent, value: any }) {
    }
  addEquipment(){
      const modal = this.modalCtrl.create(AddExtraEquipmentPage);

          modal.present();//presents the signature modal

           modal.onDidDismiss((returnParam: any) => {
             if(returnParam!=true){
               returnParam = {
                'ID':returnParam['Equipment']['ID']
                ,'Cost_Center': returnParam['Equipment']['Cost_Center']
                ,'Equipment_Bill_Code': returnParam['Equipment']['Equipment_Bill_Code']
                ,'Name': returnParam['Equipment']['Name']
                ,'Name2': returnParam['Equipment']['Name2']
                ,'Hours':returnParam['Hours']
               }
               this.doeshaveAddedEquipment = true;
               this.equipmentInfo.push(returnParam);
             }
             else{
            }
           });
  }
  removeEquipment(index:any){
    var alert = this.alertCtrl.create({
      title: 'Confirm Delete',
      subTitle: 'Are you sure you want to Delete?',
       buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.equipmentInfo.splice(index, 1);
            if(!this.equipmentInfo.length){this.doeshaveAddedEquipment=false;}
          }
        },
        {
          text: 'Cancel',
          role: 'Cancel',
          handler: () => {
          }
        }

       ]
     });
    alert.present();
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
    if(!this.doeshaveAddedEquipment&&!this.doeshaveCrew){
      return false;
    }
    else{
      return true;
    }
  }
}
