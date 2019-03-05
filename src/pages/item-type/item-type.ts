import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { SelectSearchableComponent } from 'ionic-select-searchable';

import { ReapService } from '../../services/reap-service';

class JobDescription {
  public JobID: number;
  public CompanyID: number;
  public Company: string;
  public ItemDescription: string;
}

@IonicPage()
@Component({
  selector: 'page-item-type',
  templateUrl: 'item-type.html',
})
export class ItemTypePage {
  private jobDescription: JobDescription[];
  private test:any[]=[];
  description: JobDescription;
  private crewItems:any [] = [];
  private doeshaveCrew:boolean = false;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public reap: ReapService) {
              this.crewItems = this.reap.globalCrewItems;
              //console.log(this.reap.globalCrewItems);
              //console.log(this.reap.selectedCompany);
              //console.log(this.reap.getJobs);

              if(!Array.isArray(this.crewItems) || !this.crewItems.length){
                this.doeshaveCrew = false;
                //console.log(this.doeshaveCrew);
              }
              else{
                this.doeshaveCrew = true;
                //console.log(this.doeshaveCrew);
              }

    if(this.reap.selectedJob){
    for(let i=0;i<this.reap.getJobs.length;i++){
      //console.log(this.reap.getJobs[i]['CompanyID']);
      if(this.reap.getJobs[i]['CompanyID']==this.reap.selectedJob){
        this.test.push(this.reap.getJobs[i]);
      }
    }
    this.jobDescription = this.test;
  }
  else{
    this.jobDescription = this.reap.getJobs;
  }
    //console.log(this.jobDescription);
  }

  searchableChange(event: { component: SelectSearchableComponent, value: any }) {
        //console.log('value:', event.value);
    }

  onSubmit(form: NgForm){
    //console.log(form.value);
    let quantity:any = 'quantity';
    let each:any = 'each';

    if((Array.isArray(this.reap.globalCrewItems) || (this.reap.globalCrewItems!=null))||(Array.isArray(this.crewItems) || this.crewItems!=null)){

    for(let i=0;i<this.reap.globalCrewItems.length;i++){

      //If user only inputs new data on each
        if((this.crewItems[i]['each']==undefined&&(form.value[each+[i]]!=""))&&(this.crewItems[i]['quantity']==undefined&&(form.value[quantity+[i]]!=""))){

        this.crewItems[i]={'JobID':this.reap.globalCrewItems[i]['JobID']
                  ,'ItemDescription':this.reap.globalCrewItems[i]['ItemDescription']
                  ,'quantity':form.value[quantity+[i]]
                  ,'each':form.value[each+[i]]};
        }
        //If user had previous data in fields. User must input data again or it will be wiped
        else if((this.crewItems[i]['each']!=undefined||(form.value[each+[i]]==""))&&(this.crewItems[i]['quantity']!=undefined||(form.value[quantity+[i]]==""))){

        this.crewItems[i]={'JobID':this.reap.globalCrewItems[i]['JobID']
                  ,'ItemDescription':this.reap.globalCrewItems[i]['ItemDescription']
                  ,'quantity':form.value[quantity+[i]]
                  ,'each':form.value[each+[i]]};
        }
      }
    }
    //console.log(this.crewItems);
    this.reap.globalCrewItems = this.crewItems;

    //console.log(form.value);
    //this.reap.totalMileage(form.value);
    this.navCtrl.pop();
  }

}
