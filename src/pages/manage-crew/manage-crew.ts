import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { SelectSearchableComponent } from 'ionic-select-searchable';
import { NgForm } from '@angular/forms';
import { Storage } from '@ionic/storage';

import { ReapService } from '../../services/reap-service';
class Personnel {
  public ID: number;
  public FullName: string;
  public EmployeeCode: string;
  //private personnelArray:any[] = [];
}
class EquipmentList {
  public ID: number;
  public Name:string;
  public CostCenter:number;

}
// class ItemList {
//   public JobID: number;
//   public BillCode: number;
//   public BillCodeDescription: string;
//   public JobNumber: number;
// }
class JobList{
  //public PhaseCode:number;
  public JobNumber:number;
  public Description:string;
}
class PhaseCodeList{
  public ID:number;
  public PhaseCode:number;
  public Description:string;
}
@IonicPage()
@Component({
  selector: 'page-manage-crew',
  templateUrl: 'manage-crew.html',
})
export class ManageCrewPage {
  public personnelArray: Personnel[];
  personnel: Personnel;
  public equipmentArray: EquipmentList[];
  equipment: EquipmentList;
  // private itemArray: ItemList[];
  // item: ItemList;
  public jobArray: JobList[];
  project: JobList;
  public phaseArray: PhaseCodeList[];
  phase: PhaseCodeList;
  public globalJob:any = this.reap.globalCrewJob;
  public globalPersonnel:any = this.reap.globalCrewPersonnel;
  public globalEquipment:any = this.reap.globalCrewEquipment;
  public globalPhaseCode:any = this.reap.globalCrewPhaseCodes;
  public tempEquipment:any[] = [];
  public tempPhase:any[] = [];
  //private crewItems:any [] = [];
  //private globalItems:any [] = this.reap.globalCrewItems;
  public noJob:boolean;
  public noPersonnel:boolean = true;
  public noEquipment:boolean = true;
  public noPhaseCode:boolean = true;
  public noType:boolean = true;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public reap: ReapService,
              public alertCtrl: AlertController,
              public storage: Storage) {
    try{
          if(this.globalJob==null){
            this.noJob= true;
            this.equipmentArray = this.reap.getEquipment;
            this.phaseArray = this.reap.getPhaseCodes;
            this.personnelArray = this.reap.getPersonnel;
            //this.itemArray = this.reap.getJobs;
          }
          else{
            //Filters Equipment
            var jobCost = this.globalJob['Cost_Center_Code'];

            jobCost = jobCost.replace("2", "1");
            for(let key in this.reap.getEquipment){
              if(this.reap.getEquipment[key]['Cost_Center']===jobCost){
                this.tempEquipment.push(this.reap.getEquipment[key]);
              }
            }
            this.equipmentArray = this.tempEquipment;
            this.tempEquipment = [];
            //Filters Phase Codes
            var jobNumber =  this.globalJob['Job_Number'];

              for(let key in this.reap.getPhaseCodes){
                if(this.reap.getPhaseCodes[key]['JobNumber']==jobNumber){
                  this.tempPhase.push(this.reap.getPhaseCodes[key]);
                }
              }
              this.phaseArray = this.tempPhase;
              this.tempPhase = [];

            this.noJob = false;
          }
          if(this.globalPersonnel==null||this.globalPersonnel.length==0){
            this.noPersonnel = true;
          }
          else{
            this.noPersonnel = false;
          }
          if(this.globalEquipment==null||this.globalEquipment.length==0){
            this.noEquipment = true;
          }
          else{
            this.noEquipment = false;
          }
          if(this.globalPhaseCode==null||this.globalPhaseCode.length==0){
            this.noPhaseCode = true;
          }
          else{
            this.noPhaseCode = false;
          }
    //Pre-Setting variables for Item Type
    this.personnelArray = this.reap.getPersonnel;
    this.jobArray = this.reap.getJobs;
  }
  catch(e){
    this.reap.presentAlert('Error','Error Grabbing API data, please re-sync in settings','Dismiss')
    this.navCtrl.pop();
  }
  }

  jobChange(event: { component: SelectSearchableComponent, value: any }) {
          //this.globalItems = [];
          this.noPhaseCode = true;
          this.noEquipment = true;
          this.noPersonnel = true;
          this.globalPersonnel = [];
          this.globalEquipment = [];
          this.globalPhaseCode = [];
          this.globalJob = event.value;
          if(event.value==null){
            this.noJob = true;

          }
          else{
            this.noJob = false;


          var jobNumber =  this.globalJob['Job_Number'];

          for(let key in this.reap.getPhaseCodes){
            if(this.reap.getPhaseCodes[key]['JobNumber']==jobNumber){
              this.tempPhase.push(this.reap.getPhaseCodes[key]);
            }
          }
          this.phaseArray = this.tempPhase;
          this.tempPhase = [];

          var jobCost = this.globalJob['Cost_Center_Code'];
            jobCost = jobCost.replace("2", "1");
            for(let key in this.reap.getEquipment){
              if(this.reap.getEquipment[key]['Cost_Center']===jobCost){
                this.tempEquipment.push(this.reap.getEquipment[key]);
              }
            }
            this.equipmentArray = this.tempEquipment;
            this.tempEquipment = [];
        }
  }

  personnelChange(event: { component: SelectSearchableComponent, value: any }) {
        this.globalPersonnel = event.value;
        if(event.value==null){
          this.noPersonnel =true;
        }
        else{
          this.noPersonnel = false
        }
  }
  equipmentChange(event: { component: SelectSearchableComponent, value: any }) {
          if(event.value==null){
            this.noEquipment =true;
          }
          else{
            this.noEquipment = false
          }
          this.globalEquipment = event.value;
  }
  phaseChange(event: { component: SelectSearchableComponent, value: any }) {
          if(event.value==null){
            this.noPhaseCode =true;
          }
          else{
            this.noPhaseCode = false
          }
          this.globalPhaseCode = event.value;
  }

  onSubmit(form: NgForm){


    this.reap.globalCrewJob = form.value.Job;
    this.reap.globalCrewPersonnel = form.value.Personnel;
    this.reap.globalCrewEquipment = form.value.Equipment;
    this.reap.globalCrewPhaseCodes = form.value.Phase;
    this.storage.set('globalCrewJob',this.reap.globalCrewJob);
    this.storage.set('globalCrewPersonnel',this.reap.globalCrewPersonnel);
    this.storage.set('globalCrewEquipment',this.reap.globalCrewEquipment);
    this.storage.set('globalCrewPhaseCodes',this.reap.globalCrewPhaseCodes);

    //this.storage.set('globalCrewItems',this.reap.globalCrewItems);
    this.presentAlert();
  }
  presentAlert() {
  let alert = this.alertCtrl.create({
    title: 'Successful',
    subTitle: 'Crew Updated',
    buttons: ['Dismiss']
  });
  alert.present();
  this.navCtrl.pop();
  }

}
