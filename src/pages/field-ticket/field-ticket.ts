import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Platform, AlertController } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { SelectSearchableComponent } from 'ionic-select-searchable';
import { Geolocation } from '@ionic-native/geolocation';

import { SubMenuPage } from '../sub-menu/sub-menu';
import { ReapService } from '../../services/reap-service';

class JobList {
  public ID: number;
  public JobNumber: number;
  public JobName: string;
  //public CostCenter: number;
}
class PhaseCodeList {
  public PhaseCode: number;
  public Description: string;
}
@IonicPage()
@Component({
  selector: 'page-field-ticket',
  templateUrl: 'field-ticket.html',
})

export class FieldTicketPage {
  public jobArray: JobList[];
  Job: JobList;
  public phaseArray: PhaseCodeList[];
  phase: PhaseCodeList;
  /**************************************************************/
  public tempPhase: any[] = [];
  public selectedArray: any[] = [];//saves array selected from jobs
  public jobSelected: boolean = false;
  public afeString: string;//stores AFE from selected job number
  public startDate: any;
  public foreman: string;//current user logged in
  public personnelSelected: boolean = false;//check to see if user selected exists
  public totalTime: any;
  public clientPM: any;
  public globalJob: any[] = [];
  public globalPhaseCode: any[] = [];
  public currentDate: any = new Date().toISOString();
  public defaultStartTime: string;
  public defaultEndTime: string;
  public startTime: string;
  public endTime: string;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public reap: ReapService,
    public toastCtrl: ToastController,
    public geolocation: Geolocation,
    public platform: Platform,
    public alertCtrl: AlertController) {

    if (this.reap.globalCrewJob != null) {
      this.globalJob = this.reap.globalCrewJob;
      this.jobArray = this.reap.getJobs;

      if (this.reap.globalCrewPhaseCodes != null) {
        this.globalPhaseCode = this.reap.globalCrewPhaseCodes;
        if(this.globalPhaseCode['Client_PM']==""||this.globalPhaseCode['Client_PM']==null){
          this.clientPM="";
        }
        else{
          this.clientPM = this.globalPhaseCode['Client_PM'];
        }
        this.phaseArray = this.reap.getPhaseCodes;

        var jobNumber = this.globalJob['Job_Number'];
        for (let i = 0; i < this.reap.getPhaseCodes.length; i++) {
          if (this.reap.getPhaseCodes[i]['JobNumber'] == jobNumber) {
            this.tempPhase.push(this.reap.getPhaseCodes[i]);
          }
        }
        this.phaseArray = this.tempPhase;
        this.tempPhase = [];
      }
      else {
        this.phaseArray = this.reap.getPhaseCodes;
      }
    }
    else {
      this.jobArray = this.reap.getJobs;
    }

    /**************** Catch Error ************/
  }
  ionViewWillEnter() {
    //If user backtracks to main form, the variables are re-initialized
    this.defaultStartTime = new Date(new Date().setHours(1, 0, 0)).toISOString();
    this.defaultEndTime = new Date(new Date().setHours(13, 0, 0)).toISOString();
  }
  jobChange(event: { component: SelectSearchableComponent, value: any }) {
    this.globalPhaseCode = [];
    this.clientPM = "";
    var jobNumber = this.globalJob['Job_Number'];

    for (let i = 0; i < this.reap.getPhaseCodes.length; i++) {
      if (this.reap.getPhaseCodes[i]['JobNumber'] == jobNumber) {
        this.tempPhase.push(this.reap.getPhaseCodes[i]);
      }
    }
    this.phaseArray = this.tempPhase;
    this.tempPhase = [];
  }

  onSubmit(Form: NgForm) {
    this.startTime = Form.value.startTime;
    this.endTime = Form.value.endTime;
    this.totalTime = this.calculateTime(this.startTime,this.endTime);

    Form.value.startTime = this.startTime;
    Form.value.endTime = this.endTime;
    if (this.totalTime < 0|| this.totalTime == 0) {//When Time extends to next day
      this.totalTime = 24 + this.totalTime;
    }

      //Updates Labor Array with total hours worked on form fields
      if (!Array.isArray(this.reap.globalCrewPersonnel) || !this.reap.globalCrewPersonnel.length) { }
      else {
        for (let i = 0; i < this.reap.globalCrewPersonnel.length; i++) {
          this.reap.globalCrewPersonnel[i] = {
            'ID': this.reap.globalCrewPersonnel[i]['ID']
            , 'EmployeeCode': this.reap.globalCrewPersonnel[i]['EmployeeCode']
            , 'Name': this.reap.globalCrewPersonnel[i]['Name']
            , 'Title': this.reap.globalCrewPersonnel[i]['Title']
            , 'BillingCode':this.reap.globalCrewPersonnel[i]['BillingCode']
            , 'Hours': this.totalTime.toString()
          };
        }
      }

      //Updates Equipment Array with total hours worked on form fields
      if (!Array.isArray(this.reap.globalCrewEquipment) || !this.reap.globalCrewEquipment.length) { }
      else {
        for (let i = 0; i < this.reap.globalCrewEquipment.length; i++) {
          this.reap.globalCrewEquipment[i] = {
            'ID': this.reap.globalCrewEquipment[i]['ID']
            ,'Cost_Center': this.reap.globalCrewEquipment[i]['Cost_Center']
            ,'Equipment_Bill_Code': this.reap.globalCrewEquipment[i]['Equipment_Bill_Code']
            , 'Name': this.reap.globalCrewEquipment[i]['Name']
            , 'Name2': this.reap.globalCrewEquipment[i]['Name2']
            , 'Hours': this.totalTime.toString()
          };
        }
      }
      //Form.value.formStartTime = this.reap.formStartTime;
      var selectedJobNumber = Form.value.Job.Job_Number;
      var selectedJob = Form.value.Job;
      this.reap.selectedJobNumber = selectedJobNumber;
      this.reap.selectedJob = selectedJob;
      var LaborBillCodes:any []=[];//This is for the Labor form
      for(let i=0;i<this.reap.getJobLaborBR.length;i++){
        if(this.reap.getJobLaborBR[i]['Job_Number']==this.reap.selectedJobNumber){
          LaborBillCodes.push(this.reap.getJobLaborBR[i]);
        }
      }
      this.reap.LaborBC = LaborBillCodes;

      this.reap.fieldTicketForm = Form.value;

      this.navCtrl.push(SubMenuPage);
  }

  phasecodeChange(event: { component: SelectSearchableComponent, value: any }) {
    if(event.value==null){
      this.clientPM="No Phase Code Selected";
    }
    else if(event.value['Client_PM']==""){
      this.clientPM="";
    }
    else{
      this.clientPM = event.value['Client_PM'];
    }
  }

  // presentAlert() {
  //   var tof:any;
  //   let alert = this.alertCtrl.create({
  //     title: 'Time Mismatch',
  //     subTitle: 'Are you exting hours into two days?',
  //     buttons: [
  //       {
  //         text: 'Yes',
  //         handler: () => {
  //           tof = true;
  //         }
  //       },
  //       {
  //         text: 'No, Update Hours',
  //         handler: () => {
  //           tof = false;
  //         }
  //       }
  //     ]
  //   });
  //   alert.present();
  // }

  calculateTime(startTime:string,endTime:string){

    var sT = new Date(startTime);
    var eT = new Date(endTime);
    //Changes form value back to 12 Hour Time
    if (sT.getUTCMinutes() == 0) {//If Starting Time Minutes Are 0
      if(sT.getUTCHours() == 0){
          this.startTime = (sT.getUTCHours()  + 12 +  ':' + sT.getUTCMinutes() + sT.getUTCMinutes() + ' AM').toString();
      }
      else if(sT.getUTCHours() > 12){
        this.startTime = (sT.getUTCHours() - 12 + ':' + sT.getUTCMinutes() + sT.getUTCMinutes() + ' PM').toString();
      }
      else{
          this.startTime = (sT.getUTCHours()  +   ':' + sT.getUTCMinutes() + sT.getUTCMinutes() + ' AM').toString();
      }
    }
    else {//If Starting Time Minutes Are 15,30, or 45
        if(sT.getUTCHours() == 0){
          this.startTime = (sT.getUTCHours() + 12 + ':' + sT.getUTCMinutes() + ' AM').toString();
        }
        else if(sT.getUTCHours() > 12){
          this.startTime = (sT.getUTCHours() - 12 + ':' + sT.getUTCMinutes() + ' PM').toString();
        }
        else{
          this.startTime = (sT.getUTCHours() + ':' + sT.getUTCMinutes() + ' AM').toString();
        }
    }

    if (eT.getUTCMinutes() == 0) {//If Starting Time Minutes Are 0
      if (eT.getUTCHours() > 12) {
        this.endTime = (eT.getUTCHours() - 12 + ':' + eT.getUTCMinutes() + eT.getUTCMinutes() + ' PM').toString();
      }
      else {
        this.endTime = (eT.getUTCHours() + ':' + eT.getUTCMinutes() + eT.getUTCMinutes() + ' AM').toString();
      }
    }
    else {//If Ending Time Minutes Are 15,30, or 45
      if (eT.getUTCHours() > 12) {
        this.endTime = (eT.getUTCHours() - 12 + ':' + eT.getUTCMinutes() + eT.getUTCMinutes() + ' PM').toString();
      }
      else {
        this.endTime = (eT.getUTCHours() + ':' + eT.getUTCMinutes() +  ' AM').toString();
      }
    }
    var sTHours = sT.getUTCHours();
    var sTMinutes = sT.getUTCMinutes();
    var eTHours = eT.getUTCHours();
    var eTMinutes = eT.getUTCMinutes();
    var totalHours = eTHours - sTHours;
    var totalMinutes = ((eTMinutes - sTMinutes) / 60);
    var totalTime = (totalHours + totalMinutes);
    //this.reap.totalTime = totalTime;

    return totalTime;
  }
}
