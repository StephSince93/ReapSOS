import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,Platform } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { SelectSearchableComponent } from 'ionic-select-searchable';
import { Geolocation } from '@ionic-native/geolocation';

import { SubMenuPage } from '../sub-menu/sub-menu';
import { ReapService } from '../../services/reap-service';
import { SafetyReviewPage } from '../safety-review/safety-review';

class Location {
  public ID: number;
  public Location: string;
}
class updatedLocation {
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
  selector: 'page-safety',
  templateUrl: 'safety.html',
})

export class SafetyPage {
  private locationsArray: Location[];
  location: Location;
  private classArray: Class[];
  class: Class;
  private rigInfoArray: RigInfo[];
  riginfo: RigInfo;
  updatedLocation: updatedLocation[];
  updatedlocation: updatedLocation;
/**************************************************************/
  private userLocation:any = [];
  private wellLocation: any [] = [];
  private selectedClosestLoc:boolean = false;
  private afeArray:any[] = this.reap.getAFE;
  private projectArray:any[] = this.reap.getProject;
  private ASILocations:any[] = this.reap.getASILocations;
  private selectedArray:any[] = [];
  private projectSelected:boolean = false;
  private afeString:string;
  private classString:string;
  private startDate:any;
  currentDate:any = new Date().toISOString();
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public reap: ReapService,
              public toastCtrl: ToastController,
              private geolocation: Geolocation,
              private platform: Platform) {

        this.locationsArray = reap.getLocations;
        this.classArray = this.reap.getClass;
        this.rigInfoArray = this.reap.getRigInfo;
        this.updatedLocation = [];
  }

  projectSelect(project,i){
    //console.log(i);
    this.selectedArray = this.projectArray[i];
    for(let j=0;j<this.rigInfoArray.length;j++){
        //console.log(this.rigInfoArray[j]["Name"]);
        if(this.selectedArray['Rig_Name_And_Number']===this.rigInfoArray[j]["Name"]){
          this.selectedArray['Rig_Name_And_Number'] = this.rigInfoArray[j];
          //this.projectArray[i]['Rig_Name_And_Number'] = this.rigInfoArray[j];
          console.log('Selected: ' + this.selectedArray['Rig_Name_And_Number']);
        }
    }
    for(let k=0;k<this.classArray.length;k++){
      if(this.selectedArray['Class']===this.classArray[k]["Name"]){
        this.selectedArray['Class'] = this.classArray[k];
        //this.projectArray[i]['Class'] = this.rigInfoArray[k];
        console.log('Selected: ' + this.selectedArray['Class']);
      }
    }
      console.log(this.selectedArray);

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
    if(!Form.value.Location){//If user grabs nearest location
      Form.value.Location = Form.value.updatedLocation;
      console.log(Form.value.Location);
      //Form.value.remove.updatedLocation;
    }
    this.reap.safetyForm = Form.value;
    console.log(this.reap.safetyForm);
    this.navCtrl.push(SubMenuPage);
  }
  grabLocation(){
        this.selectedClosestLoc = true;
        /* Ensure the platform is ready */
        this.platform.ready().then(() => {
        /* Grabs user geolocation */
        this.geolocation.getCurrentPosition().then((resp) => {
            // 4 decimal places
            this.userLocation = [parseFloat(resp.coords.latitude.toFixed(4)),parseFloat(resp.coords.longitude.toFixed(4))];
            //100% accurate
            this.userLocation = [resp.coords.latitude,resp.coords.longitude];
            var t0 = performance.now();
            this.reap.grabUserLoc(resp.coords.latitude,resp.coords.longitude);
            var t1 = performance.now();
            console.log("Call to grabUserLoc took " + (t1 - t0) + " milliseconds.");
            this.updatedLocation = this.reap.updatedLocation;

            console.log(this.updatedLocation);
          }).catch((error) => {
            //console.log('Error getting location', error);
            this.presentToast(error);
          });
        });
      }
  searchableChange(event: { component: SelectSearchableComponent, value: any }) {
        //console.log('value:', event.value);
    }
  //
  // delete(chip){
  //   chip.control.touched = false;
  //   chip.valueAccessor._text = "";
  //   console.log(chip);
  //
  // }
  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom',
      dismissOnPageChange: false,
      cssClass: 'customToast'
    });

    toast.onDidDismiss(() => {
      //console.log('Dismissed toast');
    });

    toast.present();
    }
    resetLocation(){
        this.wellLocation = [];
        this.updatedLocation = [];
        this.selectedClosestLoc = false;
    }
}
