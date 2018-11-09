import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { SelectSearchableComponent } from 'ionic-select-searchable';

import { ReapService } from '../../services/reap-service';

class Personnel {
  public ID: number;
  public FullName: string;
  private personnelArray:any[] = [];
}
@IonicPage()
@Component({
  selector: 'page-labor',
  templateUrl: 'labor.html',
})
export class LaborPage {
  private personnelArray: Personnel[];
  personnel: Personnel;
  private crewPersonnel:any[]=[];
  private doeshaveCrew:boolean = false;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public reap: ReapService) {
                this.crewPersonnel = this.reap.globalCrewPersonnel;
                // console.log(this.crewPersonnel)
                // console.log(this.crewPersonnel.length)
                if(this.crewPersonnel.length==0){
                  this.doeshaveCrew = false;
                }
                else{
                  this.doeshaveCrew = true;
                }
                this.personnelArray = this.reap.getPersonnel;
                //console.log(this.reap.globalCrewPersonnel);
                //console.log(this.personnelArray);
  }

  onSubmit(form: NgForm){
    //console.log(form.value);
    this.reap.totalEquipment(form.value);
    let test =  [];
    let hours:any = 'hours';
    if(this.reap.globalCrewEquipment!=[]||this.crewPersonnel!=[]){
    for(let i=0;i<this.reap.globalCrewEquipment.length;i++){
      if((this.crewPersonnel[i]['hours']||(form.value[hours+[i]]===""))){
          //Filler for data already in system
      }else{
      this.crewPersonnel[i]={'ID':this.reap.globalCrewEquipment[i]['ID']
                ,'FullName':this.reap.globalCrewPersonnel[i]['FullName']
                ,'Hours':form.value[hours+[i]]};
              }
       }
    }
    //console.log(this.reap.globalCrewPersonnel);
    this.reap.globalCrewPersonnel = this.crewPersonnel;
    //this.reap.totalLabor(form.value);
    this.navCtrl.pop();
    }
  personnelChange(event: { component: SelectSearchableComponent, value: any }) {
        //console.log('value:', event.value);
    }

}
