import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,Platform } from 'ionic-angular';
import { SelectSearchableComponent } from 'ionic-select-searchable';
import { NgForm } from '@angular/forms';
import { Geolocation } from '@ionic-native/geolocation';

import { ReapService } from '../../services/reap-service';
import { ProjectReviewPage } from '../project-review/project-review';
import { JsaReviewPage } from '../jsa-review/jsa-review';

class Location {
  public ID: number;
  public Location: string;
}
class updatedLocation {
  public ID: number;
  public Location: string;
}
class Personnel {
  public ID: number;
  public FullName: string;
}
@IonicPage()
@Component({
  selector: 'page-jsa',
  templateUrl: 'jsa.html',
})
export class JsaPage {
  private locationsArray: Location[];
  location: Location;
  updatedLocation: updatedLocation[];
  updatedlocation: updatedLocation;
  private employeeArray: Personnel[];
  personnel: Personnel;
/**************************************************************/
  private userLocation:any = [];
  private wellLocation: any [] = [];
  private selectedClosestLoc:boolean = false;
  private projectArray:any[] = this.reap.getProject;
  private projectSelected:boolean = false;
  private selectedArray:any[] = [];//saves array selected from projects
  private afeString:string;//stores AFE from selected project number
  private afeArray:any[] = this.reap.getAFE;
  private foreman:string;//current user logged in
  private personnelArray:any[] = [];
  private permits:any [] = [];
  private totalPPE:any = ["Gloves","Glasses/Goggles/Face-Shield","Hard Hat","Hearing Protection","FR Attire","Steel Toe Boots","Fall Protection","H2S Monitor","Respiratory Protection","Other"];
  private defaultPPE:any = ["Gloves","Glasses/Goggles/Face-Shield","Hard Hat","FR Attire","Steel Toe Boots"];
  private totalHazards: any = ["Heat Stress","Heavy Lifting","Electricity","Heavy Traffic","Road Hazards","Biological","Sharp Objects","Noise","Weather","Pinch Points","Pressures","Slip/Trip Fall","Hot/Cold Surface"];
  currentDate:any = new Date().toISOString();
  date = new Date();
  currentTime:any = new Date(new Date(this.date.getTime() - this.date.getTimezoneOffset()*60000)).toISOString();
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public reap: ReapService,
              public toastCtrl: ToastController,
              private geolocation: Geolocation,
              private platform: Platform) {
    this.employeeArray = this.reap.getPersonnel;
    this.locationsArray = reap.getLocations;
    this.updatedLocation = [];
  }
  ionViewWillEnter(){
    this.personnelArray = this.reap.getPersonnel;
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
            this.reap.presentToast(error);
          });
        });
      }

      onSubmit(Form: NgForm){
        //Created form value as foreman
        Form.value.foreman = this.foreman;
        if(!Form.value.Location && Form.value.updatedLocation){//If user grabs nearest location
          Form.value.Location = Form.value.updatedLocation;
          Form.value.Location.Location = Form.value.Location.Location.replace(/\n|\r/g, " ");
          // console.log(Form.value.Location);
          // Form.removeControl['updatedLocation'];
        }else if(Form.value.Location){
          Form.value.Location.Location = Form.value.Location.Location.replace(/\n|\r/g, " ");
        }
        //console.log(Form.value);
        this.reap.jsaForm = Form.value;
        //console.log(this.reap.jsaForm);
        this.navCtrl.push(JsaReviewPage);
      }
      searchableChange(event: { component: SelectSearchableComponent, value: any }) {
            //console.log('value:', event.value);
        }
      resetLocation(){
          this.wellLocation = [];
          this.updatedLocation = [];
          this.selectedClosestLoc = false;
      }
    onSelectChange(selectedValue: any){
      //this.permits = selectedValue;
       //console.log(this.permits);
       //console.log(this.permits.indexOf('Other'))
    }
}
