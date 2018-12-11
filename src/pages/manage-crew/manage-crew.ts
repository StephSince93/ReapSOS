import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Platform, AlertController } from 'ionic-angular';
import { SelectSearchableComponent } from 'ionic-select-searchable';
import { NgForm } from '@angular/forms';
import { Storage } from '@ionic/storage';

import { ReapService } from '../../services/reap-service';
class Personnel {
  public ID: number;
  public FullName: string;
  //private personnelArray:any[] = [];
}
class EquipmentList {
  public ID: number;
  public Name:string;
  public CostCenter:number;

}
class ItemList {
  public JobID: number;
  public BillCode: number;
  public BillCodeDescription: string;
  public JobNumber: number;
}
class ProjectList{
  public ID:number;
  public ProjectName:number;
  public Project_Name_Description:string;
  public CostCenter:number;
}
@IonicPage()
@Component({
  selector: 'page-manage-crew',
  templateUrl: 'manage-crew.html',
})
export class ManageCrewPage {
  private personnelArray: Personnel[];
  personnel: Personnel;
  private equipmentArray: EquipmentList[];
  equipment: EquipmentList;
  private itemArray: ItemList[];
  item: ItemList;
  private projectArray: ProjectList[];
  project: ProjectList;
  private globalProject:any [] = this.reap.globalCrewProject;
  private globalPersonnel:any [] = this.reap.globalCrewPersonnel;
  private globalEquipment:any [] = this.reap.globalCrewEquipment;
  private tempEquipment:any[] = [];
  private tempJobs:any[] = [];
  //private crewItems:any [] = [];
  private globalItems:any [] = this.reap.globalCrewItems;
  private noProject:boolean;
  private noPersonnel:boolean = true;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public reap: ReapService,
              public alertCtrl: AlertController,
              private platform: Platform,
              private storage: Storage) {
          if(this.globalProject==null){
            this.noProject = true;
          }
          else{
            this.noProject = false;
          }
    this.personnelArray = this.reap.getPersonnel;
    this.equipmentArray = this.reap.getEquipment;
    this.projectArray = this.reap.getProject;
    //Pre-Setting variables for Item Type
    //console.log(this.reap.getEquipment);
    this.itemArray = this.reap.getJobs;
  }

  projectChange(event: { component: SelectSearchableComponent, value: any }) {
          this.globalItems = [];
          this.globalPersonnel = [];
          this.globalEquipment = [];
          //console.log('value:', event.value);
          this.globalProject = event.value;
          if(event.value==null){
            this.noProject = true;
          }
          else{
            this.noProject = false;

          //console.log(this.globalProject);
          var projectCost = this.globalProject['CostCenter'];
          var projectNumber =  this.globalProject['ProjectName'];
          //console.log(projectCost);
          for(let i=0;i<this.reap.getEquipment.length;i++){
            if(this.reap.getEquipment[i]['CostCenter']==projectCost){
              //console.log(this.reap.getEquipment[i]);
              this.tempEquipment.push(this.reap.getEquipment[i]);
            }

          }
          //console.log(this.tempEquipment);
          this.equipmentArray = this.tempEquipment;

          for(let i=0;i<this.reap.getJobs.length;i++){
            if(this.reap.getJobs[i]['JobNumber']==projectNumber){
              //console.log(this.reap.getEquipment[i]);
              this.tempJobs.push(this.reap.getJobs[i]);
            }
          }
          //console.log(this.tempJobs);
          this.itemArray = this.tempJobs;
        }
  }

  personnelChange(event: { component: SelectSearchableComponent, value: any }) {
        //console.log('value:', event.value);
        this.globalPersonnel = event.value;
        if(event.value==null){
          this.noPersonnel =true;
        }
        else{
          this.noPersonnel = false
        }
        //console.log(this.globalPersonnel);
  }
  equipmentChange(event: { component: SelectSearchableComponent, value: any }) {
          //console.log('value:', event.value);
          this.globalEquipment = event.value;
          //console.log(this.globalEquipment);
  }
  itemChange(event: { component: SelectSearchableComponent, value: any }) {
          //console.log('value:', event.value);
          this.globalItems = event.value;
          this.reap.globalCrewItems = this.globalItems;
          //console.log(this.globalItems);
  }
  // keyPress(event: any) {
  //   const pattern = /[0-9\+\-\ ]/;
  //
  //   let inputChar = String.fromCharCode(event.charCode);
  //   if (event.keyCode != 8 && !pattern.test(inputChar)) {
  //     event.preventDefault();
  //   }
  //}
    // removePersonnel(index){
    //     this.globalPersonnel.splice(index, 1);
    //     this.personnelArray.splice(index, 1);
    //   }
    // removeEquipment(index){
    //   //console.log(this.globalEquipment);
    // //  console.log(this.equipmentArray);
    //     this.globalEquipment.splice(index, 1);
    //     this.equipmentArray.splice(index, 1);
    //   }
  onSubmit(form: NgForm){
    //console.log(form.value);

    // let quantity:any = 'quantity';
    // let each:any = 'each';

    // if((Array.isArray(this.reap.globalCrewItems) || (this.reap.globalCrewItems!=null))){
    // //console.log(this.reap.globalCrewItems);
    // for(let i=0;i<this.reap.globalCrewItems.length;i++){
    //
    //     //If user inputs new data on each
    //     if((this.reap.globalCrewItems[i]['each']==undefined||(form.value[each+[i]]!=""))&&(this.reap.globalCrewItems[i]['quantity']==undefined||(form.value[quantity+[i]]!=""))){
    //       //console.log("1");
    //     this.reap.globalCrewItems[i]={'ItemID':form.value.Items[i].JobID
    //               ,'BillCodeDescription':form.value.Items[i].BillCodeDescription
    //               // ,'quantity':form.value[quantity+[i]]
    //               // ,'each':form.value[each+[i]]
    //             };
    //     }
    //     //If user had previous data in fields, the previous failed still stay
    //     else if((this.reap.globalCrewItems[i].quantity!=undefined&&(form.value[quantity+[i]]==""))&&(this.reap.globalCrewItems[i].each!=undefined&&(form.value[each+[i]]==""))){
    //     //console.log("2");
    //     this.reap.globalCrewItems[i]={'ItemID':form.value.Items[i].JobID
    //               ,'BillCodeDescription':form.value.Items[i].BillCodeDescription
    //               // ,'quantity':this.reap.globalCrewItems[i].quantity
    //               // ,'each':this.reap.globalCrewItems[i].each
    //             };
    //     }
    //   }
    //}
    //console.log(this.reap.globalCrewItems);
    this.reap.globalCrewItems = this.globalItems;
    this.reap.globalCrewProject = form.value.Project;
    this.reap.globalCrewPersonnel = form.value.Personnel;
    this.reap.globalCrewEquipment = form.value.Equipment;
    //console.log(this.reap.globalCrewPersonnel);
    this.storage.set('globalCrewProject',this.reap.globalCrewProject);
    this.storage.set('globalCrewPersonnel',this.reap.globalCrewPersonnel);
    this.storage.set('globalCrewEquipment',this.reap.globalCrewEquipment);
    this.storage.set('globalCrewItems',this.reap.globalCrewItems);
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
