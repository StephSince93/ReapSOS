import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { SelectSearchableComponent } from 'ionic-select-searchable';

import { SubMenuPage } from '../sub-menu/sub-menu';
import { ReapService } from '../../services/reap-service';
import { SafetyReviewPage } from '../safety-review/safety-review';

class Location {
  public ID: number;
  public Location: string;
}
@IonicPage()
@Component({
  selector: 'page-safety',
  templateUrl: 'safety.html',
})

export class SafetyPage {
  private locationsArray: Location[];
  location: Location;
  private afeArray:any[] = [];
  private projectArray:any[] = [];
  private selectedArray:any[] = [];
  private projectSelected:boolean = false;
  private afeString:string;
  private startDate:any;
  currentDate:any = new Date().toISOString();
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public reap: ReapService) {
        this.projectArray = this.reap.getProject;
        this.locationsArray = reap.getLocations;
        this.afeArray = this.reap.getAFE;
        //console.log(this.projectArray[0]['Rig_Name_And_Number']);
  }

  projectSelect(project,i){
    //console.log(i);
    this.selectedArray = this.projectArray[i];
    //console.log(this.selectedArray['Location']);
    this.afeString = JSON.stringify(this.selectedArray['AFE_Or_Order_Number']);
    //console.log(this.afeString)
    this.projectSelected = true;
  }

  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  onSubmit(Form: NgForm){
    this.reap.safetyForm = Form.value;
    //console.log(this.reap.safetyForm);
    this.navCtrl.push(SubMenuPage);
  }
  locationChange(event: { component: SelectSearchableComponent, value: any }) {
        //console.log('value:', event.value);
    }
  // 
  // delete(chip){
  //   chip.control.touched = false;
  //   chip.valueAccessor._text = "";
  //   console.log(chip);
  //
  // }
}
