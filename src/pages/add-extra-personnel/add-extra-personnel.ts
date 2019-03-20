import { Component, ɵConsole } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { SelectSearchableComponent } from 'ionic-select-searchable';
import { NgForm } from '@angular/forms';

import { ReapService } from '../../services/reap-service';

class PersonnelList {
  public ID: number;
  public Name: string;
  public EmployeeCode: string;
}
class BillCodesList {
  public ID: number;
  public Job_Number: string;
  public Bill_Code: string;
  public BillCodeDescription: string;
}

@IonicPage()
@Component({
  selector: 'page-add-extra-personnel',
  templateUrl: 'add-extra-personnel.html',
})

export class AddExtraPersonnelPage {
  public extraPersonnelArray: PersonnelList[];
  public personnel: PersonnelList;

  public LaborBillCodes : BillCodesList[];
  public laborbillcodes: BillCodesList;

  private noSubmission:boolean = true;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public viewCtrl: ViewController,
              public reap: ReapService) {
  this.LaborBillCodes = this.reap.LaborBC;// Grabs Bill Codes
  console.log(this.LaborBillCodes)
  this.extraPersonnelArray = this.reap.getPersonnel;//Grabs Personnel
  console.log(this.extraPersonnelArray)
  }


  personnelChange(event: { component: SelectSearchableComponent, value: any }) {
  }

  laborbillcodeChange(event: { component: SelectSearchableComponent, value: any }) {
  }

  submitPersonnel(form: NgForm){
    this.viewCtrl.dismiss(form.value);
  }

  dismissModal(){
    this.viewCtrl.dismiss(this.noSubmission);
 }
}
