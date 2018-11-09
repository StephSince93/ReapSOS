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
  selector: 'page-mileage',
  templateUrl: 'mileage.html',
})
export class MileagePage {
  private jobDescription: JobDescription[];
  private test:any[]=[];
  description: JobDescription;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public reap: ReapService) {
    //console.log(this.reap.selectedCompany);
    //console.log(this.reap.getJobs);
    if(this.reap.selectedCompany){
    for(let i=0;i<this.reap.getJobs.length;i++){
      console.log(this.reap.getJobs[i]['CompanyID']);
      if(this.reap.getJobs[i]['CompanyID']==this.reap.selectedCompany){
        this.test.push(this.reap.getJobs[i]);
      }
    }
    this.jobDescription = this.test;
  }
  else{
    this.jobDescription = this.reap.getJobs;
  }
    console.log(this.jobDescription);
  }

  searchableChange(event: { component: SelectSearchableComponent, value: any }) {
        //console.log('value:', event.value);
    }

  onSubmit(form: NgForm){
    //console.log(form.value);
    this.reap.totalMileage(form.value);
    this.navCtrl.pop();
  }

}
