import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { SelectSearchableComponent } from 'ionic-select-searchable';
import { Storage } from '@ionic/storage';

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
  private LaborBillCodes : BillCodesList[];
  laborbillcodes: BillCodesList;

  crewPersonnel:any[]=[];
  private doeshaveCrew:boolean = false;
  private personnelInfo:any [] = [];
  private totalExtraPersonnel:any [] = [];
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public reap: ReapService,
              public storage: Storage,
              public modalCtrl: ModalController) {
                this.LaborBillCodes = this.reap.LaborBC;
                console.log(this.LaborBillCodes);
                this.crewPersonnel = this.reap.globalCrewPersonnel;
                console.log(this.crewPersonnel);
                if(!Array.isArray(this.crewPersonnel) || !this.crewPersonnel.length){
                  this.doeshaveCrew = false;
                }
                else{
                  this.doeshaveCrew = true;
                }

  }

  onSubmit(form: NgForm){
    //console.log(form.value);
    let hours:any = 'hours';
    let laborBillCodes:any = 'LaborBillCode';
    if((Array.isArray(this.reap.globalCrewPersonnel) || (this.reap.globalCrewPersonnel!=null))||(Array.isArray(this.crewPersonnel) || this.crewPersonnel!=null)){
    for(let i=0;i<this.reap.globalCrewPersonnel.length;i++){
      if((this.crewPersonnel[i]['hours']||(form.value[hours+[i]]===""))){
          //Filler for data already in system
      }else{
      this.crewPersonnel[i]={'ID':this.reap.globalCrewPersonnel[i]['ID']
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
                ,'Name':this.reap.globalCrewPersonnel[i]['Name']
                ,'Hours':this.reap.globalCrewPersonnel[i]['Hours']
                ,'Title':form.value[laborBillCodes+[i]]['BillCodeDescription']
                ,'BillingCode':form.value[laborBillCodes+[i]]['Bill_Code']};
      }
      //console.log(this.crewPersonnel[i]);
     }//end loop
    }//end if
    this.reap.globalCrewPersonnel = this.crewPersonnel;
    //this.reap.totalLabor(form.value);
    if(this.personnelInfo!=undefined){
      for(let i=0;i<this.personnelInfo.length;i++){
    this.totalExtraPersonnel.push({'ID':this.personnelInfo[i].extraPersonnel.ID,
                      'Title':this.personnelInfo[i].extraPersonnel.Extras,
                      'Name':this.personnelInfo[i].personnelName,
                      'Hours':this.personnelInfo[i].hours});
        }
        //console.log(this.totalExtraPersonnel);
        this.reap.addLabor(this.totalExtraPersonnel);
      }
    this.navCtrl.pop();
    }
  personnelChange(event: { component: SelectSearchableComponent, value: any }) {
        //console.log('value:', event.value);
    }

  removePersonnel(index){
    this.personnelInfo.splice(index, 1);
    //console.log(this.equipmentDetails);
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
}
