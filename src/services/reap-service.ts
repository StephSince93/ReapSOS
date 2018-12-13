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
    // public equipmentType:any[]=[];
    public getEquipment:any[]=[];
    public getPersonnel:any[]=[];
    public getProject:any[]=[];
    public getExtras:any[]=[];
    public getAFE:any[]=[];
    public getJobs:any[]=[];
    public getPhaseCodes:any[]=[];
    public getMD5:string;
    public devonianVersion:string;//app version string
  /********************************************/
    public misc:any[]=[];
    public equipment:any[]=[];//Only For new Equipment
    public extraLabor:any[]=[];//Only For new Personnel
    public job:any[]=[];
    public photo:any[]=[];
    /* 3 forms for Devonian */
    public fieldTicketForm:any[]=[];
    public jsaForm:any[]=[];
    public projectForm:any[]=[];
    public completeForm:any[]=[];
    public storeFormData:any[]=[];
    public updatedLocation:any [] = [];
    public wellLocation:any [] = [];
    //Set crew
    public globalCrewProject: any [] = [];
    public globalCrewPersonnel: any [] = [];
    public globalCrewEquipment: any [] = [];
    public globalCrewItems: any [] = [];
    public globalCrewPhaseCodes: any [] = [];
    public selectedProject: any [] =[];//For Field Ticket to Extra Equipment
    public totalTime: any;
    //Offline Form Submission
    public offlineFormSubmissions:any [] = [];
    //Connecting Main and Description Form
    public selectedCompany:any;
    public token:any;
    public formStart:any;
    public formStartTime:any;//testing with Devonian
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
    //console.log('here in service Constructor');
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
          this.devonianVersion = version;
          this.storage.set('AppVersion',this.devonianVersion);
          //console.log(JSON.stringify(this.devonianVersion));
            },(error)=>{
          this.devonianVersion = "Could not Grab App Version!";
          //console.log('Cannot Grab App Version!');
        });
      }

    grabAPIData(token){
      /* Initialize Observables */
      this.getAndPost;
      this.checkConnection;
      //console.log('GET request happened');
      this.token = token;
      //console.log(this.token);
      LoginPage.initialLogin = false;//changes login variable to false after user logs in
        //imported data from API
        this.stemAPI.getData(this.token).subscribe((result) =>{
        this.getData = (JSON.stringify(result));
        this.getData = JSON.parse(this.getData);
        console.log(this.getData);

        this.getMD5 = this.getData['md5'];
        this.storage.set('MD5',this.getMD5);

        this.getLocations = this.getData['Locations'];
        this.storage.set('Locations',this.getLocations);

        //Devonian EquipmentList
        this.getEquipment = this.getData['EquipmentList'];
        this.storage.set('Equipment',this.getEquipment);

        this.getPersonnel = this.getData['Personnel'];
        this.storage.set('Personnel',this.getPersonnel);

        this.getAFE = this.getData['AFE'];
        this.storage.set('AFE',this.getAFE);

        this.getProject = this.getData['Project'];
        this.storage.set('Project',this.getProject);

        this.getExtras = this.getData['Extras'];
        this.storage.set('Extras',this.getExtras);

        this.getJobs = this.getData['Jobs'];
        this.storage.set('Jobs',this.getJobs);

        this.getPhaseCodes = this.getData['PhaseCode'];
        this.storage.set('PhaseCodes',this.getPhaseCodes);
        //console.log(this.getJobs);
        //calls method to store App Version to local storage globally
        this.getVersionNumber();
        //this.presentToast('Sync Successful');
        }, (err) => {
          //this.presentToast('Sync Unsuccessful');
          //console.log(err);
        });
    }
      getLocalStorage(){
        //console.log('grabbed local storage');

        this.storage.get('authToken').then((data)=>{
        this.token = data;
        });

        this.storage.get('MD5').then((data)=>{
        this.getMD5 = data;
        //console.log(this.getMD5);
        });

        this.storage.get('formStart').then((data)=>{
        this.formStart = data;
        //console.log(this.formStart);
        });
        /* Testing formStartTime with Devonian*/
        this.storage.get('getTimeStart').then((data)=>{
        this.formStartTime = data;
        //console.log(this.formStartTime);
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

        this.storage.get('Project').then((data)=>{
        this.getProject = data;
        //console.log(this.getProject);
        });

        this.storage.get('AFE').then((data)=>{
        this.getAFE = data;
        });

        this.storage.get('Extras').then((data)=>{
        this.getExtras = data;
        });

        this.storage.get('Jobs').then((data)=>{
        this.getJobs = data;
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

        this.storage.get('globalCrewProject').then((data)=>{
        this.globalCrewProject = data;
        });

        this.storage.get('globalCrewPhaseCodes').then((data)=>{
        this.globalCrewPhaseCodes = data;
        });

        this.storage.get('AppVersion').then((data)=>{
        this.devonianVersion = data;
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
/** TESTING ****/
//submits form user saved offline When they click the button in Support Page
  // submitOfflineForm(data){
  //     var data = data;
  //     var length:number = data.length;
  //     var secondLength = data.length;
  //     var testLength = data.length;
  //     var count=0;
  //   //console.log(formLength);
  //   /*** Need to create function per form
  //        submittion to go to right  API call **/
  //   while(length--){
  //   if(data[length]["Type"]=="Project"){
  //   const loading = this.loadingCtrl.create({
  //    content: 'Retrying Form Submission...'
  //   });
  //    loading.present();
  //     //console.log("Here in BOL");
  //   if(data[length]["Status"]=="Pending"){
  //     //console.log(data[length]["Info"]);
  //     //console.log(data[length]["Status"]);
  //   this.stemAPI.submitDevonianForm(data[length]["Info"],this.token).subscribe((result) =>{
  //    //console.log(result["Status"]);
  //          var length = testLength;
  //          if(result["Status"]==true){
  //             /* WILL NEED TO TEST MORE FOR THIS ISSUE OF OFFLINE*/
  //             //data[length]["Status"]="Submitted";
  //            isEmpty(length,data,this.storage,this.offlineFormSubmissions,loading);
  //          }
  //          else if(result["Status"]==false){
  //             this.presentToast('Project not submitted with location!');
  //          }
  //        },(err)=>{
  //          console.log(err.message);
  //          this.presentToast('Project not Submitted! Try again!');
  //        });
  //   }
  //   else{
  //     this.presentToast('Project should be already submitted!');
  //   }
  //   loading.dismiss();
  //   }
  //   else{
  //     count++;
  //       //console.log(count);
  //   }
  //   }
  //   if(count==secondLength){
  //     while(secondLength--){
  //       //console.log(secondLength);
  //       //console.log(count);
  //         this.callAPI(testLength,secondLength,data[secondLength],data);
  //     }
  //   }
  //   }
    // callAPI(testLength,i,data,allData) {
    // const loading = this.loadingCtrl.create({
    // content: 'Retrying Form Submission...'
    // });
    // loading.present();
    // var submit = this.stemAPI;
    // var token = this.token;
    // var offline = this.offlineFormSubmissions;
    // var storage = this.storage;
    // var submitted:boolean;
    // var i = i;
    // //setTimeout(function() {
    // switch(data["Type"]){
    //  case "WO": {
    //     // console.log("Here in Batch");
    //     if(data["Status"]=="Pending"){
    //
    //      submit.submitDevonianForm(data["Info"],token).subscribe((result)=>{
    //        //console.log(result["Status"]);
    //          if(result["Status"]==true){
    //            data["Status"]="Submitted";
    //            allData[i]["Status"]="Submitted";
    //           isEmpty(i,allData,storage,offline,loading);
    //          }
    //          else{
    //             this.presentToast('Work Order not submitted with location!');
    //          }
    //
    //      }, (err)=>{
    //         this.presentToast('Could not submit Work Order Location!');
    //     });
    //   }
    //   else{
    //     this.presentToast('Work Order Data should be already submitted!');
    //   }
    //     break;
    //  }
    //  case "GPS": {
    //   if(data["Status"]=="Pending"){
    //
    //    submit.updateGPSLoc(data["Info"],token).subscribe((result) =>{
    //
    //      if(result["Status"]==true){
    //        data["Status"]="Submitted";
    //        allData[i]["Status"]="Submitted";
    //        isEmpty(i,allData,storage,offline,loading);
    //      }
    //      else{
    //         this.presentToast('Batch Treatment not submitted with location!');
    //      }
    //      },(err)=>{
    //        //console.log(err.message);
    //
    //     });
    //     }else{
    //       this.presentToast('GPS Data should be already submitted!');
    //     }
    //     break;
    //  }
     // case "ConfirmBOL": {
     //  if(data["Status"]=="Pending"){
     //   submit.confirmBOLData(data["Info"],token).subscribe((result) =>{
     //
     //     if(result["Status"]==true){
     //       data["Status"]="Submitted";
     //       allData[i]["Status"]="Submitted";
     //       isEmpty(i,allData,storage,offline,loading);
     //     }
     //     else{
     //        this.presentToast('Batch Treatment not submitted with location!');
     //     }
     //   },(err)=>{
     //     console.log(err.message);
     //
     //    });
     //    }else{
     //     this.presentToast('ConfirmBOL Data should be already submitted!');
     //    }
     //    break;
     // }
    //  default:
    //     this.presentToast('Something Went Wrong!');
    //    break;
    // }
    //},((i) * 1000) + 1000);
  //   loading.dismiss();
  // }
    //Compared UserLocation to Well Locations and gives user nearest location within 5 miles
  grabUserLoc(lat,lon){
        //Resets arrays for every time the user alternates buttons
        this.updatedLocation = [];
        this.wellLocation = [];
        //console.log(wellLocation,updatedLocation,lat,lon);
        for(let i=0;i<this.getLocations.length;i++){
          if((this.getLocations[i]['Lat']!="") && this.getLocations[i]['Lon']){
          //console.log('Lat: '+(this.getLocations[i]['Lat'])+ ' Lat: '+(parseFloat(resp.coords.latitude.toFixed(4))));
          //console.log('Lon: '+(this.getLocations[i]['Lon'])+ ' Lon: '+(parseFloat(resp.coords.longitude.toFixed(4))));
          let R = 6371;// km
          let RinM = (6371*0.621371);
          let Lat1 = (parseFloat(lat.toFixed(4)));
          let Lat2 = (this.getLocations[i]['Lat']);
          let Lon1 = (parseFloat(lon.toFixed(4)));
          let Lon2 = (this.getLocations[i]['Lon']);
          let dLat = this.toRad(Lat2-Lat1);
          let dLon = this.toRad(Lon2-Lon1);
          let RLat1 = this.toRad(Lat1);
          let RLat2 = this.toRad(Lat2);
          let a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(RLat1) * Math.cos(RLat2);
          let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
          //let d = R * c;
          let e = RinM * c;
           //console.log('Distance in km: '+ d);
           //console.log('Distance in mi: '+ parseFloat(e.toFixed(4)));
          if(e < 50){//This is where distance is calculated

            this.wellLocation.push(this.getLocations[i]);
            //console.log(wellLocation);
            //console.log("this location is within 5 miles!");
           }
          }
          this.updatedLocation = this.wellLocation;
        }
        //console.log(this.updatedLocation);
        //return this.updatedLocation;
    }
    // Converts numeric degrees to radians
    toRad(Value)
    {
      return Value * Math.PI / 180;
    }

    // checkMD5(){
    //   //console.log(this.getMD5);
    //   this.stemAPI.getMD5Check(this.token,this.getMD5).subscribe((result) =>{
    //     let md5 = result;
    //     //console.log(result);
    //     //console.log(md5['downloadJson']);
    //     if(md5['downloadJson']==true){
    //         this.grabAPIData(this.token);
    //         this.presentToast('Data Updated!');
    //     }else{
    //       this.presentToast('Data Not Updated!');
    //     }
    //       },(err)=>{
    //         console.log(err);
    //         this.presentToast('Error getting updated data!');
    //   });
    // }

    //creates and pushes mileage array
    totalMisc(data){
      this.misc.push(data);
      //console.log(this.mileage);
    }
    /*Devonian Custom*/
    //creates and pushes labor array
    addLabor(data){
      this.extraLabor = data;
      //console.log(this.extraLabor);
    }
    /*Devonian Custom*/
    //creates and pushes equipment array
    totalEquipment(data){
      this.equipment = data;
      //console.log('Here in totalEquipment');
      //console.log(this.equipment);
    }
    totalPhotos(data){
      this.photo.push(data);
      //console.log(this.photo);
    }
    totalMileage(data){
      this.job.push(data);
    }

    removeConnections(){
      this.checkConnection.unsubscribe();
      this.getAndPost.unsubscribe();
      //this.connected.unsubscribe();
      //this.disconnected.unsubscribe();
    }
    presentToast(msg) {
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

    presentAlert(title,subTitle,button){

      let alert = this.alertCtrl.create({
           title: title,
          subTitle: subTitle,
           buttons: [button]
         });
       alert.present();
    }
}
// function isEmpty(legth,allData,storage,offline,loading){
//     allData[length]["Status"]="Submitted";
//     // console.log(length);
//     // console.log(allData[length]);
//     storage.set('offlineSubmission',allData);
//     offline = allData;
//     loading.dismiss();
//   }
