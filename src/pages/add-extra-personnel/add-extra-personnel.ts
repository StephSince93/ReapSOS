import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { SelectSearchableComponent } from 'ionic-select-searchable';
import { NgForm } from '@angular/forms';

import { ReapService } from '../../services/reap-service';

class extraPersonnel {
  public ID: number;
  public Extras: string;
}
@IonicPage()
@Component({
  selector: 'page-add-extra-personnel',
  templateUrl: 'add-extra-personnel.html',
})
export class AddExtraPersonnelPage {
  private extraPersonnelArray: extraPersonnel[];
  extrapersonnel: extraPersonnel;
  private noSubmission:boolean = true;
  private projectPersonnel:any;
  private tempPersonnel:any [] = [];
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public reap: ReapService,
              public viewCtrl: ViewController) {
                if(this.reap.globalCrewProject!=null){
                  this.projectPersonnel=this.reap.globalCrewProject['ProjectName'];
                }
                for(let i=0;i<this.reap.getExtras.length;i++){
                    if(this.reap.getExtras[i]['Job_Number']==this.projectPersonnel){
                    console.log(this.reap.getExtras[i]);
                    this.tempPersonnel.push(this.reap.getExtras[i]);
                  }
                }
      this.extraPersonnelArray = this.tempPersonnel;
  }

  submitChemical(form: NgForm){
    //console.log(form.value);
     this.viewCtrl.dismiss(form.value);
  }

  personnelChange(event: { component: SelectSearchableComponent, value: any }) {
      //console.log('value:', event.value);
  }
  dismissModal(){
     this.viewCtrl.dismiss(this.noSubmission);
  }
}
