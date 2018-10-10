import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import { Subscription } from 'rxjs/Subscription';
import {ToastController, LoadingController } from 'ionic-angular';

import { LoginPage } from '../pages/login/login';
import { StemApiProvider } from '../providers/stem-api/stem-api';
import { Storage } from '@ionic/storage';
import { Network } from '@ionic-native/network';
@Injectable()
export class ReapService {
    //data exported and saved into service values
    public getData:any;
    public getLocations:any[]=[];
    public getASILocations:any[]=[];
    public getClass:any[]=[];
    public getRigInfo:any[]=[];
    public equipmentType:any[]=[];
    public getEquipment:any[]=[];
    public getPersonnel:any[]=[];
    public getProject:any[]=[];
    public getAFE:any[]=[];
    public getMD5:string;
  /********************************************/
    public misc:any[]=[];
    public equipment:any[]=[];
    public labor:any[]=[];
    public mileage:any[]=[];
    public photo:any[]=[];
    public safetyForm:any[]=[];
    public projectForm:any[]=[];
    public completeForm:any[]=[];
    public storeFormData:any[]=[];
    public updatedLocation:any [] = [];
    public wellLocation:any [] = [];
    public token:any;
    public formStart:any;
    public networkType:any;
    public online:any = true;
    connected: Subscription;
    disconnected: Subscription;
    getAndPost: Subscription;
    checkConnection: Subscription;
    constructor(public loadingCtrl:LoadingController,public toast: ToastController,public network: Network,private stemAPI: StemApiProvider,public storage: Storage){
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
          this.submitOfflineForm(data);
            }
        });
      },error => console.error(error));
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
        this.stemAPI.getData(this.token).then((result) =>{
        this.getData = (JSON.stringify(result));
        this.getData = JSON.parse(this.getData);
        console.log(this.getData);

        this.getMD5 = this.getData['md5'];
        this.storage.set('MD5',this.getMD5);

        this.getLocations = this.getData['Locations'];
        this.storage.set('Locations',this.getLocations);

        this.equipmentType = this.getData['EquipmentType'];
        this.storage.set('EquipmentType',this.equipmentType);

        this.getEquipment = this.getData['Equipment'];
        this.storage.set('Equipment',this.getEquipment);

        this.getPersonnel = this.getData['Personnel'];
        this.storage.set('Personnel',this.getPersonnel);

        this.getAFE = this.getData['AFE'];
        this.storage.set('AFE',this.getAFE);

        this.getProject = this.getData['Project'];
        this.storage.set('Project',this.getProject);

        this.getASILocations = this.getData['ASILocations'];
        this.storage.set('ASILocations',this.getASILocations);

        this.getClass = this.getData['Class'];
        this.storage.set('Class',this.getClass);

        this.getRigInfo = this.getData['RigInfo'];
        this.storage.set('RigInfo',this.getRigInfo);
        //console.log(this.getProject);
        //console.log(this.getEquipment);

        }, (err) => {
          console.log(err);
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
        this.storage.get('Locations').then((data)=>{
        this.getLocations = data;
        });

        this.storage.get('EquipmentType').then((data)=>{
        this.equipmentType = data;
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

        this.storage.get('ASILocations').then((data)=>{
        this.getASILocations = data;
        });

        this.storage.get('Class').then((data)=>{
        this.getClass = data;
        });

        this.storage.get('RigInfo').then((data)=>{
        this.getRigInfo = data;
        });
      }
//submits form user saved offline When they click the button in Support Page
    submitOfflineForm(data){
      // console.log(data);
      // console.log(data[0]);

      const loading = this.loadingCtrl.create({
        content: 'Retrying Form Submission...'
      });
      loading.present();
      if(data[0]['safety']){//checks if safety form was submitted offline
        //console.log('safety form submitted');
      this.stemAPI.submitSafetyForm(data,this.token).then((result) =>{
          this.storage.remove('formStart');
          this.storage.remove('offlineSubmission');
          this.presentToast('submission Successful');
          setTimeout(() => {
          loading.dismiss();
        }, 5000);
        },(err)=>{
                setTimeout(() => {
                loading.dismiss();
              }, 5000);
              this.presentToast(err);
              console.log(err);
            });
       }else if(data[0]['project']){//checks if project form was submitted offline
          //console.log('project form submitted');
          this.stemAPI.submitSafetyForm(data,this.token).then((result) =>{
              this.storage.remove('offlineSubmission');
              this.presentToast('submission Successful');
              setTimeout(() => {
              loading.dismiss();
            }, 5000);
            },(err)=>{
                    setTimeout(() => {
                    loading.dismiss();
                  }, 5000);
                  this.presentToast(err);
                  console.log(err);
                });
      }
      else{
        setTimeout(() => {
        loading.dismiss();
      }, 5000);
      this.presentToast('Error Submittiing Offline Form!');
      }
    }
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

    checkMD5(){
      //console.log(this.getMD5);
      this.stemAPI.getMD5Check(this.token,this.getMD5).then((result) =>{
        let md5 = result;
        //console.log(result);
        //console.log(md5['downloadJson']);
        if(md5['downloadJson']==true){
            this.grabAPIData(this.token);
            this.presentToast('Data Updated!');
        }else{
          this.presentToast('Data Not Updated!');
        }
          },(err)=>{
            console.log(err);
            this.presentToast('Error getting updated data!');
      });
    }

    //creates and pushes mileage array
    totalMisc(data){
      this.misc.push(data);
      //console.log(this.mileage);
    }
    //creates and pushes labor array
    totalLabor(data){
      this.labor.push(data);
      //console.log(this.labor);
    }
    //creates and pushes equipment array
    totalEquipment(data){
      this.equipment.push(data);
      //console.log(this.equipment);
    }
    totalPhotos(data){
      this.photo.push(data);
      //console.log(this.photo);
    }
    totalMileage(data){
      this.mileage.push(data);
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
}
