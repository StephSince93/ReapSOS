import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { SelectSearchableComponent } from 'ionic-select-searchable';
import { Storage } from '@ionic/storage';

import { AddExtraPersonnelPage } from '../add-extra-personnel/add-extra-personnel';
import { ReapService } from '../../services/reap-service';

class BillCodesList {
  public ID: number;
  public Job_Number: string;
  public Bill_Code: string;
  public BillCodeDescription: string;
}
@IonicPage()
@Component({
  selector: 'page-labor',
  templateUrl: 'labor.html',
})
export class LaborPage {
  public LaborBillCodes : BillCodesList[];
  public laborbillcodes: BillCodesList;

  public crewPersonnel:any[]=[];
  public doeshaveCrew:boolean = false;
  public doeshaveAddedPersonnel:boolean = false;
  public personnelInfo:any [] = [];
  public totalExtraPersonnel:any [] = [];
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public reap: ReapService,
              public storage: Storage,
              public modalCtrl: ModalController,
              public alertCtrl: AlertController) {
                this.LaborBillCodes = this.reap.LaborBC;
                this.crewPersonnel = this.reap.globalCrewPersonnel;
                try{

                  if(!Array.isArray(this.reap.personnel) || !this.reap.personnel.length){
                    this.personnelInfo=[];
                  }
                  else{
                    this.doeshaveAddedPersonnel = true;
                    this.personnelInfo=this.reap.personnel;
                  }
                  }catch{
                  this.reap.presentAlert('Error','Error Grabbing Equipment Data, please re-sync in settings','Dismiss')
                  this.navCtrl.pop();
                  }


                if(!Array.isArray(this.crewPersonnel) || !this.crewPersonnel.length){
                  this.doeshaveCrew = false;
                }
                else{
                  this.doeshaveCrew = true;
                }

  }

  onSubmit(form: NgForm){
    let hours:any = 'hours';
    let laborBillCodes:any = 'LaborBillCode';
    if((Array.isArray(this.reap.globalCrewPersonnel) || (this.reap.globalCrewPersonnel!=null))||(Array.isArray(this.crewPersonnel) || this.crewPersonnel!=null)){
    for(let i=0;i<this.reap.globalCrewPersonnel.length;i++){
      if((this.crewPersonnel[i]['hours']||(form.value[hours+[i]]===""))){
          //Filler for data already in system
      }else{
      this.crewPersonnel[i]={'ID':this.reap.globalCrewPersonnel[i]['ID']
                ,'EmployeeCode':this.reap.globalCrewPersonnel[i]['EmployeeCode']
                ,'Name':this.reap.globalCrewPersonnel[i]['Name']
                ,'Hours':form.value[hours+[i]]
                ,'Title':this.reap.globalCrewPersonnel[i]['Title']
                ,'BillingCode':this.reap.globalCrewPersonnel[i]['BillingCode']};
              }
       //updating Billing Code and Title
      if((form.value[laborBillCodes+[i]]===""||form.value[laborBillCodes+[i]]==null)){
        //Filler for data already in system
      }else{
      this.crewPersonnel[i]={'ID':this.reap.globalCrewPersonnel[i]['ID']
                ,'EmployeeCode':this.reap.globalCrewPersonnel[i]['EmployeeCode']
                ,'Name':this.reap.globalCrewPersonnel[i]['Name']
                ,'Hours':this.reap.globalCrewPersonnel[i]['Hours']
                ,'Title':form.value[laborBillCodes+[i]]['BillCodeDescription']
                ,'BillingCode':form.value[laborBillCodes+[i]]['Bill_Code']};
      }
     }//end loop
    }//end if
    this.reap.globalCrewPersonnel = this.crewPersonnel;

    if(this.personnelInfo!=undefined){
      for(let key in this.personnelInfo){
        this.totalExtraPersonnel.push({
          'ID':this.personnelInfo[key]['ID']
          ,'EmployeeCode': this.personnelInfo[key]['EmployeeCode']
          ,'BillingCode': this.personnelInfo[key]['BillingCode']
          ,'Name': this.personnelInfo[key]['Name']
          ,'Title': this.personnelInfo[key]['Title']
          ,'Hours':this.personnelInfo[key]['Hours'],
          });
        }
    }
    this.reap.totalPersonnel(this.totalExtraPersonnel);

    this.navCtrl.pop();
    }
  personnelChange(event: { component: SelectSearchableComponent, value: any }) {
    }

  keyPress(event: any) {
    const pattern = /[0-9\.\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  laborbillcodeChange(event: { component: SelectSearchableComponent, value: any }) {
   }

   addPersonnel(){
    const modal = this.modalCtrl.create(AddExtraPersonnelPage);

        modal.present();//presents the signature modal

         modal.onDidDismiss((returnParam: any) => {
           if(returnParam!=true){
             if(returnParam['LaborBillCode']==""){
              returnParam = {
                'ID':returnParam['Personnel']['ID']
                ,'EmployeeCode': returnParam['Personnel']['EmployeeCode']
                ,'Name': returnParam['Personnel']['Name']
                ,'Title': returnParam['Personnel']['Title']
                ,'BillingCode': returnParam['Personnel']['BillingCode']
                ,'Hours':returnParam['Hours']
              }
             }
             else{
              returnParam = {
                'ID':returnParam['Personnel']['ID']
                ,'EmployeeCode': returnParam['Personnel']['EmployeeCode']
                ,'Name': returnParam['Personnel']['Name']
                ,'Title': returnParam['LaborBillCode']['BillCodeDescription']
                ,'BillingCode': returnParam['LaborBillCode']['Bill_Code']
                ,'Hours':returnParam['Hours']
              }
             }
             this.doeshaveAddedPersonnel = true;
             this.personnelInfo.push(returnParam);
           }
           else{
          }
         });
  }
  doeshavePersonnel(){
      //allows user to submit only if there is added equipment
    if((!this.doeshaveAddedPersonnel)&&(!this.doeshaveCrew)){
      return false;
    }
    else{
      return true;
    }
  }
  removePersonnel(index:any){
    var alert = this.alertCtrl.create({
      title: 'Confirm Delete',
      subTitle: 'Are you sure you want to Delete?',
       buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.personnelInfo.splice(index, 1);
            if(!this.personnelInfo.length){this.doeshaveAddedPersonnel=false;}
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
}
