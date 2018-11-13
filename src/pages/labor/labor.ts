import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { SelectSearchableComponent } from 'ionic-select-searchable';

import { ReapService } from '../../services/reap-service';

class extraPersonnel {
  public ID: number;
  public Extras: string;
}
@IonicPage()
@Component({
  selector: 'page-labor',
  templateUrl: 'labor.html',
})
export class LaborPage {
  private extraPersonnelArray: extraPersonnel[];
  extrapersonnel: extraPersonnel;
  private crewPersonnel:any[]=[];
  private doeshaveCrew:boolean = false;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public reap: ReapService) {
                this.crewPersonnel = this.reap.globalCrewPersonnel;
                this.extraPersonnelArray = this.reap.getExtras;
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
    let test =  [];
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
    if(form.value.extraPersonnel!=undefined){
  //  console.log(form.value.extraPersonnel);
    let labor = {'ID':form.value.extraPersonnel.ID,
                      'Name':form.value.extraPersonnel.Extras,
                      'Hours':form.value.hours};
                      //console.log(labor);
    this.reap.addLabor(labor);
      }
    this.navCtrl.pop();
    }
  personnelChange(event: { component: SelectSearchableComponent, value: any }) {
        //console.log('value:', event.value);
    }

}
