import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SelectSearchableComponent } from 'ionic-select-searchable';
import { NgForm } from '@angular/forms';

import { ReapService } from '../../services/reap-service';
import { ProjectReviewPage } from '../project-review/project-review';
class Location {
  public ID: number;
  public Location: string;
}
class Class {
  public ID: number;
  public Name: string;
}
class RigInfo {
  public ID: number;
  public Name: string;
}
@IonicPage()
@Component({
  selector: 'page-project',
  templateUrl: 'project.html',
})
export class ProjectPage {
  private locationsArray: Location[];
  location: Location;
  private classArray: Class[];
  class: Class;
  private rigInfoArray: RigInfo[];
  riginfo: RigInfo;
/**************************************************************/
  private afeArray:any[] = this.reap.getAFE;
  private ASILocations:any[] = this.reap.getASILocations;
  constructor(public navCtrl: NavController, public navParams: NavParams,public reap: ReapService) {
    this.locationsArray = reap.getLocations;
    this.classArray = this.reap.getClass;
    this.rigInfoArray = this.reap.getRigInfo;
  }

  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  onSubmit(Form: NgForm){
    this.reap.projectForm = Form.value;
    console.log(this.reap.projectForm);
    this.navCtrl.push(ProjectReviewPage);
  }
  searchableChange(event: { component: SelectSearchableComponent, value: any }) {
        console.log('value:', event.value);
    }
}
