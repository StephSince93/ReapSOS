import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import { Subscription } from 'rxjs/Subscription';
import {ToastController, LoadingController, AlertController } from 'ionic-angular';
import { AppVersion } from '@ionic-native/app-version';

import { LoginPage } from '../pages/login/login';
import { StemApiProvider } from '../providers/stem-api/stem-api';
import { Storage } from '@ionic/storage';
import { Network } from '@ionic-native/network';
@Injectable()
export class ReapService {
    //data exported and saved into service values
    public getData:any;
    public getLocations:any[]=[];
    public getEquipment:any[]=[];
    public getPersonnel:any[]=[];
    public getJobLaborBR:any[]=[];
    public getJobs:any[]=[];
    public getPhaseCodes:any[]=[];
    public getMD5:string;
    public saulsburyVersion:string;//app version string
  /********************************************/
    public misc:any[]=[];
    public equipment:any[]=[];//Only For new Equipment
    public extraLabor:any[]=[];//Only For new Personnel
    public job:any[]=[];
    public photo:any[]=[];
    public fieldTicketForm:any[]=[];
    public completeForm:any[]=[];
    public storeFormData:any[]=[];
    //Checks if initial login
    public initialLogin:boolean;
    //Set crew
    public globalCrewJob: any [] = [];
    public globalCrewPersonnel: any [] = [];
    public globalCrewEquipment: any [] = [];
    public globalCrewItems: any [] = [];
    public globalCrewPhaseCodes: any [] = [];
    //Offline Form Submission
    public offlineFormSubmissions:any [] = [];
    //Connecting Main and Description Form
    public selectedJob:any;
    public selectedJobNumber:any;
    public LaborBC:any []=[];
    public groupName:any;
    public token:any;
    //public formStart:any;
    //public formStartTime:any;//testing with Saulsbury
    public networkType:any;
    public online:any = true;
    connected: Subscription;
    disconnected: Subscription;
    getAndPost: Subscription;
    checkConnection: Subscription;
    constructor(public loadingCtrl:LoadingController,
                public toast: ToastController,
                public network: Network,
                private stemAPI: StemApiProvider,
                public storage: Storage,
                public appVersion: AppVersion,
                public alertCtrl: AlertController){
    //May have to unsubscribe from Observable
    /* Time Interval checking for network connection */
    this.checkConnection = Observable.interval(250 * 60).subscribe(x => {
      //console.log('here every 15 seconds');
          this.connected;
          this.disconnected;
          this.networkType = this.network.type;
          //console.log(this.networkType)
          this.connected = this.network.onConnect().subscribe(data =>{
               //console.log(data.type)
               //console.log('online');
               this.online = data.type;
             }, error => console.error(error));

          this.network.onDisconnect().subscribe(data =>{
                //console.log(data.type)
                this.online = data.type;
                //console.log('offline');
             },);
            }, error => console.error(error));
        /* Time Interval checking for new data */
        this.getAndPost = Observable.interval(10000 * 60).subscribe(x => {
        /*******************TESTING***********************************/
        this.storage.get('MD5').then((data)=>{
        //console.log(data);
        //console.log('here in MD5');
/** Temporarily disabled to allow user to manually sync in support */
        //this.checkMD5();
        });
    /*******************TESTING***********************************/
      this.storage.get('offlineSubmission').then((data)=>{
        //console.log('here every 5 minutes');
        if(data!=null){
          console.log(data);
          //this.submitOfflineForm(data);
            }
        });
      },error => console.error(error));
    }
    getVersionNumber(){
     this.appVersion.getVersionNumber().then((version) => {
          this.saulsburyVersion = version;
          this.storage.set('AppVersion',this.saulsburyVersion);
          //console.log(JSON.stringify(this.saulsburyVersion));
            },(error)=>{
          this.saulsburyVersion = "Could not Grab App Version!";
          //console.log('Cannot Grab App Version!');
        });
      }

    grabAPIData(token,groupName){
      /* Initialize Observables */
      this.getAndPost;
      this.checkConnection;
      //console.log('GET request happened');
      this.token = token;
      this.groupName = groupName;
      //console.log(this.token,this.groupName);
      this.initialLogin = false;//changes login variable to false after user logs in
      this.storage.set('initialLogin', this.initialLogin);
        //imported data from API
        this.stemAPI.getData(this.token,this.groupName).subscribe((result) =>{
          this.getData = (JSON.stringify(result));
          this.getData = JSON.parse(this.getData);
          console.log(this.getData);

          this.getMD5 = this.getData['md5'];
          this.storage.set('MD5',this.getMD5);

          this.getLocations = this.getData['Locations'];
          this.storage.set('Locations',this.getLocations);

          //Saulsbury EquipmentList
          this.getEquipment = this.getData['EquipmentList'];
          this.storage.set('Equipment',this.getEquipment);

          //Saulsbury PersonnelList
          this.getPersonnel = this.getData['Personnel'];
          this.storage.set('Personnel',this.getPersonnel);

          //Saulsbury Job Labor Billing Rates
          this.getJobLaborBR = this.getData['JobLaborBR'];
          this.storage.set('JobLaborBR',this.getJobLaborBR);

          //Saulsbury PhaseCodes
          this.getPhaseCodes = this.getData['PhaseCode'];
          this.storage.set('PhaseCodes',this.getPhaseCodes);

          //Saulsbury Jobs
          this.getJobs = this.getData['Jobs'];

          this.getJobs = this.filterJobs(this.getJobs);//Removes Jobs from list if no phase codes are associated with them

          console.log(this.getJobs);
          this.storage.set('Jobs',this.getJobs);

          //calls method to store App Version to local storage globally
          if(this.saulsburyVersion==null||this.saulsburyVersion=="Could not Grab App Version!"){
            this.getVersionNumber();
          }

          this.presentToast('Sync Successful');
        }, (err) => {
          this.presentToast(err['message']);
          console.log(err);
        });
    }
      getLocalStorage(){
        console.log('grabbed local storage');

        this.storage.get('authToken').then((data)=>{
        this.token = data;
        });

        this.storage.get('groupName').then((data)=>{
        this.groupName = data;
        });

        this.storage.get('MD5').then((data)=>{
        this.getMD5 = data;
        //console.log(this.getMD5);
        });

        this.storage.get('Locations').then((data)=>{
        this.getLocations = data;
        });

        this.storage.get('Equipment').then((data)=>{
        this.getEquipment = data;
        });

        this.storage.get('Personnel').then((data)=>{
        this.getPersonnel = data;
        });

        this.storage.get('JobLaborBR').then((data)=>{
        this.getJobLaborBR = data;
        });

        this.storage.get('Jobs').then((data)=>{
        this.getJobs = data;
        });

        this.storage.get('PhaseCodes').then((data)=>{
        this.getPhaseCodes = data;
        });

        //Set Crew Global data devonian
        this.storage.get('globalCrewPersonnel').then((data)=>{
        this.globalCrewPersonnel = data;
        });

        this.storage.get('globalCrewEquipment').then((data)=>{
        this.globalCrewEquipment = data;
        });

        this.storage.get('globalCrewItems').then((data)=>{
        this.globalCrewItems = data;
        });

        this.storage.get('globalCrewJob').then((data)=>{
        this.globalCrewJob = data;
        });
        //console.log(this.globalCrewJob);
        this.storage.get('globalCrewPhaseCodes').then((data)=>{
        this.globalCrewPhaseCodes = data;
        });

        this.storage.get('initialLogin').then((data)=>{
          this.initialLogin = data;
        });

        this.storage.get('AppVersion').then((data)=>{
        this.saulsburyVersion = data;
      });

      //grabs the locally stored form submissions offline
      this.storage.get('offlineSubmission').then((data)=>{
      if(data!=null){
        this.offlineFormSubmissions = data;
        //console.log(this.offlineFormSubmissions);
       }
       else{
         this.offlineFormSubmissions = [];
         //console.log(this.offlineFormSubmissions);
       }
      });

      //Checks for app update and updates storage with newest version of app
      this.getVersionNumber();
      }

    //creates and pushes mileage array
    totalMisc(data:any){
      this.misc.push(data);
      //console.log(this.mileage);
    }
    //creates and pushes labor array
    addLabor(data:any){
      this.extraLabor = data;
      //console.log(this.extraLabor);
    }
    //creates and pushes equipment array
    totalEquipment(data:any){
      this.equipment = data;
      //console.log('Here in totalEquipment');
      //console.log(this.equipment);
    }
    totalPhotos(data:any){
      this.photo.push(data);
      //console.log(this.photo);
    }
    totalMileage(data:any){
      this.job.push(data);
    }

    removeConnections(){
      this.checkConnection.unsubscribe();
      this.getAndPost.unsubscribe();
      //this.connected.unsubscribe();
      //this.disconnected.unsubscribe();
    }
    presentToast(msg:any) {
      let toast = this.toast.create({
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

    presentAlert(title:any,subTitle:any,button:any){

      let alert = this.alertCtrl.create({
           title: title,
          subTitle: subTitle,
           buttons: [button]
         });
       alert.present();
    }
    filterJobs(jobs:any []=[]){
      let temp:any []=[];

          for(var key in jobs){
                let JobNumber = jobs[key]['Job_Number'];
                  const found =  this.getPhaseCodes.some(el => el.JobNumber === JobNumber);
                  if (found){
                    temp.push(jobs[key]);
                  }
          }
          jobs= temp;
      return jobs;
    }
}

