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

@IonicPage()
@Component({
  selector: 'page-project',
  templateUrl: 'project.html',
})
export class ProjectPage {
  private locationsArray: Location[];
  location: Location;
  private afeArray:any[] = [];
  constructor(public navCtrl: NavController, public navParams: NavParams,public reap: ReapService) {
    this.locationsArray = reap.getLocations;
    this.afeArray = this.reap.getAFE;
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
    //console.log(this.reap.projectForm);
    this.navCtrl.push(ProjectReviewPage);
  }
  locationChange(event: { component: SelectSearchableComponent, value: any }) {
        //console.log('value:', event.value);
    }

}
