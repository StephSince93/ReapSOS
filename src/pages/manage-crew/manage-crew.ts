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

}
class ItemList {
  public JobID: number;
  public CompanyID: number;
  public Company: string;
  public ItemDescription: string;
  public Hours: number;
  public Quantity: string;
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
  private globalPersonnel:any [] = this.reap.globalCrewPersonnel;
  private globalEquipment:any [] = this.reap.globalCrewEquipment;
  //private crewItems:any [] = [];
  private globalItems:any [] = this.reap.globalCrewItems;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public reap: ReapService,
              public alertCtrl: AlertController,
              private platform: Platform,
              private storage: Storage) {
    this.personnelArray = this.reap.getPersonnel;
    this.equipmentArray = this.reap.getEquipment;
    //Pre-Setting variables for Item Type
    console.log(this.globalItems);
    this.itemArray = this.reap.getJobs;
  }

  personnelChange(event: { component: SelectSearchableComponent, value: any }) {
        //console.log('value:', event.value);
        this.globalPersonnel = event.value;
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
          console.log(this.globalItems);
  }
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
    console.log(form.value);

    let quantity:any = 'quantity';
    let each:any = 'each';

    if((Array.isArray(this.reap.globalCrewItems) || (this.reap.globalCrewItems!=null))){
    console.log(this.reap.globalCrewItems);
    for(let i=0;i<this.reap.globalCrewItems.length;i++){

        //If user inputs new data on each
        if((this.reap.globalCrewItems[i]['each']==undefined||(form.value[each+[i]]!=""))&&(this.reap.globalCrewItems[i]['quantity']==undefined||(form.value[quantity+[i]]!=""))){
          console.log("1");
        this.reap.globalCrewItems[i]={'JobID':form.value.Items[i].JobID
                  ,'ItemDescription':form.value.Items[i].ItemDescription
                  ,'quantity':form.value[quantity+[i]]
                  ,'each':form.value[each+[i]]};
        }
        //If user had previous data in fields, the previous failed still stay
        else if((this.reap.globalCrewItems[i].quantity!=undefined&&(form.value[quantity+[i]]==""))&&(this.reap.globalCrewItems[i].each!=undefined&&(form.value[each+[i]]==""))){
        console.log("2");
        this.reap.globalCrewItems[i]={'JobID':form.value.Items[i].JobID
                  ,'ItemDescription':form.value.Items[i].ItemDescription
                  ,'quantity':this.reap.globalCrewItems[i].quantity
                  ,'each':this.reap.globalCrewItems[i].each};
        }
      }
    }
    console.log(this.reap.globalCrewItems);
    //this.reap.globalCrewItems = this.crewItems;
    this.reap.globalCrewPersonnel = form.value.Personnel;
    this.reap.globalCrewEquipment = form.value.Equipment;
    //console.log(this.reap.globalCrewPersonnel);
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
