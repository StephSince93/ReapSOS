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
  private tempPhase: any[] = [];
  private selectedArray: any[] = [];//saves array selected from jobs
  private jobSelected: boolean = false;
  private afeString: string;//stores AFE from selected job number
  private startDate: any;
  private foreman: string;//current user logged in
  private personnelSelected: boolean = false;//check to see if user selected exists
  private totalTime: any;
  public clientPM: any;
  globalJob: any[] = [];
  globalPhaseCode: any[] = [];
  currentDate: any = new Date().toISOString();
  defaultStartTime: string;
  defaultEndTime: string;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public reap: ReapService,
    public toastCtrl: ToastController,
    private geolocation: Geolocation,
    private platform: Platform,
    private alertCtrl: AlertController) {
      console.log(this.reap.globalCrewEquipment);
    if (this.reap.globalCrewJob != null) {
      this.globalJob = this.reap.globalCrewJob;
      this.jobArray = this.reap.getJobs;

      if (this.reap.globalCrewPhaseCodes != null) {
        this.globalPhaseCode = this.reap.globalCrewPhaseCodes;
        if(this.globalPhaseCode['Client_PM']==""||this.globalPhaseCode['Client_PM']==null){
          this.clientPM="No Client PM for this Phase Code";
        }
        else{
          this.clientPM = this.globalPhaseCode['Client_PM'];
        }
        this.phaseArray = this.reap.getPhaseCodes;

        var jobNumber = this.globalJob['Job_Number'];
        //console.log(jobNumber)
        for (let i = 0; i < this.reap.getPhaseCodes.length; i++) {
          if (this.reap.getPhaseCodes[i]['JobNumber'] == jobNumber) {
            //console.log(this.reap.getEquipment[i]);
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
    this.defaultStartTime = new Date(new Date().setHours(-1, 0, 0)).toISOString();
    this.defaultEndTime = new Date(new Date().setHours(13, 0, 0)).toISOString();
  }
  jobChange(event: { component: SelectSearchableComponent, value: any }) {
    this.globalPhaseCode = [];
    this.clientPM = "";
    var jobNumber = this.globalJob['Job_Number'];
    //console.log(jobNumber);

    for (let i = 0; i < this.reap.getPhaseCodes.length; i++) {
      if (this.reap.getPhaseCodes[i]['JobNumber'] == jobNumber) {
        //console.log(this.reap.getEquipment[i]);
        this.tempPhase.push(this.reap.getPhaseCodes[i]);
      }
    }
    //  console.log(this.tempPhase);
    this.phaseArray = this.tempPhase;
    this.tempPhase = [];
  }

  onSubmit(Form: NgForm) {
    //console.log(Form.value);
    //var t0 = performance.now();
    var sT = new Date(Form.value.startTime);
    var eT = new Date(Form.value.endTime);
    var sTHours = sT.getUTCHours();
    var sTMinutes = sT.getUTCMinutes();
    var eTHours = eT.getUTCHours();
    var eTMinutes = eT.getUTCMinutes();
    //Changes form value back to normal time
    if (sT.getUTCMinutes() == 0) {
      Form.value.startTime = (sT.getUTCHours() + ':' + sT.getUTCMinutes() + sT.getUTCMinutes() + ' AM').toString();
    }
    else {
      Form.value.startTime = (sT.getUTCHours() + ':' + sT.getUTCMinutes() + ' AM').toString();
    }
    if (eT.getUTCMinutes() == 0) {
      if (eT.getUTCHours() > 12) {
        Form.value.endTime = (eT.getUTCHours() - 12 + ':' + eT.getUTCMinutes() + eT.getUTCMinutes() + ' PM').toString();
      }
      else {
        Form.value.endTime = (eT.getUTCHours() + ':' + eT.getUTCMinutes() + eT.getUTCMinutes() + ' PM').toString();
      }
    }
    else {
      Form.value.endTime = (eT.getUTCHours() + ':' + eT.getUTCMinutes() + ' PM').toString();
    }
    // console.log(Form.value.startTime);
    // console.log(Form.value.endTime);
    var totalHours = eTHours - sTHours;
    var totalMinutes = ((eTMinutes - sTMinutes) / 60);
    // console.log('hours: ' + totalHours);
    // console.log('minutes: ' + (totalMinutes / 60));
    this.totalTime = (totalHours + totalMinutes);
    // console.log(totalHours + totalMinutes);
    // console.log('total time: ' + totalTime);
    //this.reap.totalTime = totalTime;
    if (this.totalTime < 0) {
      //console.log('Starting Time is greater than Ending Time');
      this.presentAlert();
    }
    else {
      //Updates Labor Array with total hours worked on form fields
      if (!Array.isArray(this.reap.globalCrewPersonnel) || !this.reap.globalCrewPersonnel.length) { }
      else {
        for (let i = 0; i < this.reap.globalCrewPersonnel.length; i++) {
          this.reap.globalCrewPersonnel[i] = {
            'ID': this.reap.globalCrewPersonnel[i]['ID']
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
      console.log(this.reap.globalCrewEquipment);
      //console.log(this.reap.globalCrewPersonnel);
      //Form.value.formStartTime = this.reap.formStartTime;
      console.log(Form.value);
      var selectedJobNumber = Form.value.Job.Job_Number;
      var selectedJob = Form.value.Job;
      this.reap.selectedJobNumber = selectedJobNumber;
      this.reap.selectedJob = selectedJob;
      var LaborBillCodes:any []=[];//This is for the Labor form
      for(let i=0;i<this.reap.getJobLaborBR.length;i++){
        //console.log(this.reap.getJobLaborBR[i]);
        if(this.reap.getJobLaborBR[i]['Job_Number']==this.reap.selectedJobNumber){
          LaborBillCodes.push(this.reap.getJobLaborBR[i]);
        }
      }
      this.reap.LaborBC = LaborBillCodes;
      //console.log(LaborBillCodes);

      this.reap.fieldTicketForm = Form.value;
      //var t1 = performance.now();
      //console.log("Formatting time took " + (t1 - t0) + " milliseconds.");
      //alert("Formatting time took " + (t1 - t0) + " milliseconds.");
      //console.log(this.reap.safetyForm);
      this.navCtrl.push(SubMenuPage);
    }
  }

  phasecodeChange(event: { component: SelectSearchableComponent, value: any }) {
    //console.log('value:', event.value);
    //console.log('Client PM: '+event.value['Client_PM']);
    if(event.value==null){
      this.clientPM="No Phase Code Selected";
    }
    else if(event.value['Client_PM']==""){
      this.clientPM="No Client PM for this Phase Code";
    }
    else{
      this.clientPM = event.value['Client_PM'];
    }
  }

  presentAlert() {
    let alert = this.alertCtrl.create({
      title: 'Time Mismatch',
      subTitle: 'Start Time is greater than End Time',
      buttons: ['Dismiss']
    });
    alert.present();
  }
}
