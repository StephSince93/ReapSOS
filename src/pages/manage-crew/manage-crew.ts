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
  // public Odometer:string;
  // public endingOdometer:string;
  // public hours:string;
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
  private globalPersonnel:any [] = this.reap.globalCrewPersonnel;
  private globalEquipment:any [] = this.reap.globalCrewEquipment;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public reap: ReapService,
              public alertCtrl: AlertController,
              private platform: Platform,
              private storage: Storage) {
    this.personnelArray = this.reap.getPersonnel;
    this.equipmentArray = this.reap.getEquipment;
  }

  personnelChange(event: { component: SelectSearchableComponent, value: any }) {
        //console.log('value:', event.value);
        this.globalPersonnel = event.value;
        console.log(this.globalPersonnel);
    }
    equipmentChange(event: { component: SelectSearchableComponent, value: any }) {
          //console.log('value:', event.value);
          this.globalEquipment = event.value;
          console.log(this.globalEquipment);
      }
    removePersonnel(index){
        this.globalPersonnel.splice(index, 1);
        this.personnelArray.splice(index, 1);
      }
    removeEquipment(index){
      //console.log(this.globalEquipment);
    //  console.log(this.equipmentArray);
        this.globalEquipment.splice(index, 1);
        this.equipmentArray.splice(index, 1);
      }
  onSubmit(form: NgForm){
    //console.log(form.value);
    this.reap.globalCrewPersonnel = form.value.Personnel;
    this.reap.globalCrewEquipment = form.value.Equipment;
    //console.log(this.reap.globalCrewPersonnel);
    this.storage.set('globalCrewPersonnel',this.reap.globalCrewPersonnel);
    this.storage.set('globalCrewEquipment',this.reap.globalCrewEquipment);
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
