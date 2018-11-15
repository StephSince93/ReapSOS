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
@IonicPage()
@Component({
  selector: 'page-safety',
  templateUrl: 'safety.html',
})

export class SafetyPage {
  private locationsArray: Location[];
  location: Location;
  updatedLocation: updatedLocation[];
  updatedlocation: updatedLocation;
/**************************************************************/
  private userLocation:any = [];
  private wellLocation: any [] = [];
  private selectedClosestLoc:boolean = false;
  private afeArray:any[] = this.reap.getAFE;
  private projectArray:any[] = this.reap.getProject;
  private personnelArray:any[] = [];
  private selectedArray:any[] = [];//saves array selected from projects
  private projectSelected:boolean = false;
  private afeString:string;//stores AFE from selected project number
  private startDate:any;
  private foreman:string;//current user logged in
  private personnelSelected:boolean = false;//check to see if user selected exists
  currentDate:any = new Date().toISOString();
  //currentTime:any = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().slice(0, -1);
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public reap: ReapService,
              public toastCtrl: ToastController,
              private geolocation: Geolocation,
              private platform: Platform) {
        this.personnelArray = this.reap.getPersonnel;
        this.locationsArray = reap.getLocations;
        this.updatedLocation = [];
        //console.log(this.projectArray);
        /**************** Catch Error ************/
  }
  ionViewWillEnter(){
    for(let i=0;i< this.personnelArray.length;i++){//grabs current username logged in
        if(this.personnelArray[i]['default'] === "true"){
          this.foreman = this.personnelArray[i]['FullName'];
          //console.log(this.personnel);
        }
      }
  }
  projectSelect(project,i){
    //console.log(i);
    this.selectedArray = this.projectArray[i];
    this.afeString = this.selectedArray['AFE_Number'];
    //console.log(this.afeString)
    this.projectSelected = true;
  }

  onSubmit(Form: NgForm){
    //Created form value as foreman
    Form.value.foreman = this.foreman;
    Form.value.formStartTime = this.reap.formStartTime;    
    console.log(Form.value);
    if(!Form.value.Location){//If user grabs nearest location
      Form.value.Location = Form.value.updatedLocation;
      if(Form.value.Location){
        this.reap.selectedCompany = Form.value.Location['CID'];
      }
      //Form.value.remove.updatedLocation;
    }
    if(Form.value.Location){
      this.reap.selectedCompany = Form.value.Location['CID'];
    }
    this.reap.safetyForm = Form.value;
    //console.log(this.reap.safetyForm);
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
            //var t0 = performance.now();
            this.reap.grabUserLoc(resp.coords.latitude,resp.coords.longitude);
            //var t1 = performance.now();
            //console.log("Call to grabUserLoc took " + (t1 - t0) + " milliseconds.");
            this.updatedLocation = this.reap.updatedLocation;

            //console.log(this.updatedLocation);
          }).catch((error) => {
            //console.log('Error getting location', error);
            this.presentToast(error);
          });
        });
      }
  searchableChange(event: { component: SelectSearchableComponent, value: any }) {
        //console.log('value:', event.value);
    }

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
