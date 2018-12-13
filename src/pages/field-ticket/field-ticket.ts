import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,Platform,AlertController } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { SelectSearchableComponent } from 'ionic-select-searchable';
import { Geolocation } from '@ionic-native/geolocation';

import { SubMenuPage } from '../sub-menu/sub-menu';
import { ReapService } from '../../services/reap-service';
//import { FieldTicketReviewPage } from '../field-ticket-review/field-ticket-review';

// class Location {
//   public ID: number;
//   public Location: string;
// }
// class updatedLocation {
//   public ID: number;
//   public Location: string;
// }
class ProjectList{
  public ID:number;
  public ProjectName:number;
  public Project_Name_Description:string;
  public CostCenter:number;
}
class PhaseCodeList{
  public PhaseCode:number;
  public Description:string;
}
@IonicPage()
@Component({
  selector: 'page-field-ticket',
  templateUrl: 'field-ticket.html',
})

export class FieldTicketPage {
  // private locationsArray: Location[];
  // location: Location;
  // updatedLocation: updatedLocation[];
  // updatedlocation: updatedLocation;
  private projectArray: ProjectList[];
  project: ProjectList;
  private phaseArray: PhaseCodeList[];
  phase: PhaseCodeList;
/**************************************************************/
  //private userLocation:any = [];
  //private wellLocation: any [] = [];
  //private selectedClosestLoc:boolean = false;
  //private afeArray:any[] = this.reap.getAFE;
  private tempPhase:any []=[];
  //private personnelArray:any[] = [];
  private selectedArray:any[] = [];//saves array selected from projects
  private projectSelected:boolean = false;
  private afeString:string;//stores AFE from selected project number
  private startDate:any;
  private foreman:string;//current user logged in
  private personnelSelected:boolean = false;//check to see if user selected exists
  private totalTime:any;
  globalProject:any [] = [];
  globalPhaseCode:any[]=[];
  currentDate:any = new Date().toISOString();
  defaultStartTime:string;
  defaultEndTime:string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public reap: ReapService,
              public toastCtrl: ToastController,
              private geolocation: Geolocation,
              private platform: Platform,
              private alertCtrl: AlertController) {
                // this.phaseArray = this.reap.getPhaseCodes;
                // this.projectArray= this.reap.getProject;
                //console.log(this.reap.globalCrewProject);
                if(this.reap.globalCrewProject!=null){
                  this.globalProject = this.reap.globalCrewProject;
                  this.projectArray= this.reap.getProject;

                  if(this.reap.globalCrewPhaseCodes!=null){
                    this.globalPhaseCode = this.reap.globalCrewPhaseCodes;
                    this.phaseArray= this.reap.getPhaseCodes;

                    var projectNumber =  this.globalProject['ProjectName'];
                    console.log(projectNumber)
                    for(let i=0;i<this.reap.getPhaseCodes.length;i++){
                      if(this.reap.getPhaseCodes[i]['JobNumber']==projectNumber){
                        //console.log(this.reap.getEquipment[i]);
                        this.tempPhase.push(this.reap.getPhaseCodes[i]);
                      }
                    }
                    this.phaseArray = this.tempPhase;
                    this.tempPhase = [];
                  }
                  else{
                    this.phaseArray= this.reap.getPhaseCodes;
                  }
                }
                else{
                  this.projectArray= this.reap.getProject;
                }
                //console.log(this.globalProject);
                //console.log(this.globalPhaseCode);
        //this.personnelArray = this.reap.getPersonnel;
        // this.locationsArray = reap.getLocations;
        // this.updatedLocation = [];
        //console.log(this.reap.globalCrewProject);
        /**************** Catch Error ************/
  }
  ionViewWillEnter(){
    //If user backtracks to main form, the variables are re-initialized
    this.defaultStartTime = new Date(new Date().setHours(-1, 0, 0)).toISOString();
    this.defaultEndTime = new Date(new Date().setHours(13, 0, 0)).toISOString();
    // for(let i=0;i< this.personnelArray.length;i++){//grabs current username logged in
    //     if(this.personnelArray[i]['default'] === "true"){
    //       this.foreman = this.personnelArray[i]['FullName'];
    //     }
    //   }
    //   console.log(this.personnelArray);
  }
  projectChange(event: { component: SelectSearchableComponent, value: any }) {
    this.globalPhaseCode = [];
    //console.log(i);
    //this.selectedArray = this.projectArray[i];
    //this.afeString = this.selectedArray['AFE_Number'];
    //console.log(this.afeString)
    //this.projectSelected = true;
    var projectNumber =  this.globalProject['ProjectName'];
    console.log(projectNumber);

    for(let i=0;i<this.reap.getPhaseCodes.length;i++){
      if(this.reap.getPhaseCodes[i]['JobNumber']==projectNumber){
        //console.log(this.reap.getEquipment[i]);
        this.tempPhase.push(this.reap.getPhaseCodes[i]);
      }
    }
  //  console.log(this.tempPhase);
    this.phaseArray = this.tempPhase;
    this.tempPhase = [];
  }

  onSubmit(Form: NgForm){
    //console.log(Form.value);
    //var t0 = performance.now();
    var sT = new Date(Form.value.startTime);
    var eT = new Date(Form.value.endTime);
    var sTHours = sT.getUTCHours();
    var sTMinutes = sT.getUTCMinutes();
    var eTHours = eT.getUTCHours();
    var eTMinutes = eT.getUTCMinutes();
    //Changes form value back to normal time
    if(sT.getUTCMinutes()==0){
    Form.value.startTime = (sT.getUTCHours() +':' + sT.getUTCMinutes() + sT.getUTCMinutes() +' AM').toString();
    }
    else{
      Form.value.startTime = (sT.getUTCHours() +':' + sT.getUTCMinutes() +' AM').toString();
    }
    if(eT.getUTCMinutes()==0){
      if(eT.getUTCHours()>12){
        Form.value.endTime = (eT.getUTCHours()-12 +':' + eT.getUTCMinutes() + eT.getUTCMinutes() +' PM').toString();
      }
      else{
        Form.value.endTime = (eT.getUTCHours() +':' + eT.getUTCMinutes() + eT.getUTCMinutes() +' PM').toString();
      }
    }
    else{
      Form.value.endTime = (eT.getUTCHours() +':' + eT.getUTCMinutes() +' PM').toString();
    }
    // console.log(Form.value.startTime);
    // console.log(Form.value.endTime);
    var totalHours = eTHours - sTHours;
    var totalMinutes = ((eTMinutes - sTMinutes) /60);
    // console.log('hours: ' + totalHours);
    // console.log('minutes: ' + (totalMinutes / 60));
    this.totalTime = (totalHours + totalMinutes);
    // console.log(totalHours + totalMinutes);
    // console.log('total time: ' + totalTime);
    //this.reap.totalTime = totalTime;
    if(this.totalTime < 0){
      //console.log('Starting Time is greater than Ending Time');
      this.presentAlert();
    }
    else{
      //Updates Labor Array with total hours worked on form fields
      if(!Array.isArray(this.reap.globalCrewPersonnel) || !this.reap.globalCrewPersonnel.length){}
       else{
         for(let i=0;i<this.reap.globalCrewPersonnel.length;i++){
           this.reap.globalCrewPersonnel[i]={'ID':this.reap.globalCrewPersonnel[i]['ID']
                     ,'FullName':this.reap.globalCrewPersonnel[i]['FullName']
                     ,'Hours':this.totalTime.toString()};
            }
         }
    //console.log(this.reap.globalCrewPersonnel);
    //Created form value as foreman
    //Form.value.foreman = this.foreman;
    //Form.value.formStartTime = this.reap.formStartTime;
    //console.log(Form.value);
    var selectedProject = Form.value.Project;
    this.reap.selectedProject = selectedProject;
    // if(!Form.value.Location && Form.value.updatedLocation){//If user grabs nearest location
    //   Form.value.Location = Form.value.updatedLocation;
    //   //Removes breaks from JSON string
    //   Form.value.Location.Location = Form.value.Location.Location.replace(/\n|\r/g, " ");
    //   if(Form.value.Location){
    //     this.reap.selectedCompany = Form.value.Location['CID'];
    //   }
    //   //Form.value.remove.updatedLocation;
    // }
    // else if(Form.value.Location){
    //   //Removes breaks from JSON string
    //   Form.value.Location.Location = Form.value.Location.Location.replace(/\n|\r/g, " ");
    // }
    // if(Form.value.Location){
    //   this.reap.selectedCompany = Form.value.Location['CID'];
    // }
    this.reap.fieldTicketForm = Form.value;
    //var t1 = performance.now();
    //console.log("Formatting time took " + (t1 - t0) + " milliseconds.");
    //alert("Formatting time took " + (t1 - t0) + " milliseconds.");
    //console.log(this.reap.safetyForm);
    this.navCtrl.push(SubMenuPage);
    }
  }
  // grabLocation(){
  //       this.selectedClosestLoc = true;
  //       /* Ensure the platform is ready */
  //       this.platform.ready().then(() => {
  //       /* Grabs user geolocation */
  //       this.geolocation.getCurrentPosition().then((resp) => {
  //           // 4 decimal places
  //           this.userLocation = [parseFloat(resp.coords.latitude.toFixed(4)),parseFloat(resp.coords.longitude.toFixed(4))];
  //           //100% accurate
  //           this.userLocation = [resp.coords.latitude,resp.coords.longitude];
  //           //var t0 = performance.now();
  //           this.reap.grabUserLoc(resp.coords.latitude,resp.coords.longitude);
  //           //var t1 = performance.now();
  //           //console.log("Call to grabUserLoc took " + (t1 - t0) + " milliseconds.");
  //           //this.updatedLocation = this.reap.updatedLocation;
  //
  //           //console.log(this.updatedLocation);
  //         }).catch((error) => {
  //           //console.log('Error getting location', error);
  //           this.reap.presentToast(error);
  //         });
  //       });
  //     }
  searchableChange(event: { component: SelectSearchableComponent, value: any }) {
        //console.log('value:', event.value);
    }
    // resetLocation(){
    //     this.wellLocation = [];
    //     this.updatedLocation = [];
    //     this.selectedClosestLoc = false;
    // }

    presentAlert() {
      let alert = this.alertCtrl.create({
        title: 'Time Mismatch',
        subTitle: 'Start Time is greater than End Time',
        buttons: ['Dismiss']
      });
  alert.present();
}
}
