import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { SelectSearchableComponent } from 'ionic-select-searchable';
import { Storage } from '@ionic/storage';

import { ReapService } from '../../services/reap-service';
import { AddExtraPersonnelPage } from '../add-extra-personnel/add-extra-personnel';

@IonicPage()
@Component({
  selector: 'page-labor',
  templateUrl: 'labor.html',
})
export class LaborPage {
  private crewPersonnel:any[]=[];
  private doeshaveCrew:boolean = false;
  private personnelInfo:any [] = [];
  private totalExtraPersonnel:any [] = [];
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public reap: ReapService,
              public storage: Storage,
              public modalCtrl: ModalController) {
                this.crewPersonnel = this.reap.globalCrewPersonnel;
                //console.log(this.crewPersonnel);
                if(!Array.isArray(this.crewPersonnel) || !this.crewPersonnel.length){
                  this.doeshaveCrew = false;
                  //console.log(this.doeshaveCrew);
                }
                else{
                  this.doeshaveCrew = true;
                  //console.log(this.doeshaveCrew);
                }
                //console.log(this.reap.globalCrewPersonnel);
                //console.log(this.personnelArray);

  }

  onSubmit(form: NgForm){
    //console.log(form.value);
    let hours:any = 'hours';
    if((Array.isArray(this.reap.globalCrewPersonnel) || (this.reap.globalCrewPersonnel!=null))||(Array.isArray(this.crewPersonnel) || this.crewPersonnel!=null)){
    for(let i=0;i<this.reap.globalCrewPersonnel.length;i++){
      if((this.crewPersonnel[i]['hours']||(form.value[hours+[i]]===""))){
          //Filler for data already in system
      }else{
      this.crewPersonnel[i]={'ID':this.reap.globalCrewPersonnel[i]['ID']
                ,'FullName':this.reap.globalCrewPersonnel[i]['FullName']
                ,'Hours':form.value[hours+[i]]};
              }
       }
    }
    //console.log(this.reap.globalCrewPersonnel);
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
    addPersonnel(){
      const modal = this.modalCtrl.create(AddExtraPersonnelPage);

          modal.present();//presents the signature modal

           modal.onDidDismiss((returnParam: any) => {
             if(returnParam!=true){
               this.personnelInfo.push(returnParam);
               //console.log(this.personnelInfo);

             }
             else{
               //console.log('backed out of no chemical!');
            }
           });
    }

  removePersonnel(index){
    this.personnelInfo.splice(index, 1);
    //console.log(this.equipmentDetails);
  }
  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
}
