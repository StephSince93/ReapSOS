import { Component } from '@angular/core';
import { IonicPage, NavController,LoadingController,AlertController, NavParams } from 'ionic-angular';
import { Device } from '@ionic-native/device';
import { AppVersion } from '@ionic-native/app-version';
import { Storage } from '@ionic/storage';
import { Network } from '@ionic-native/network';

import { ReapService } from '../../services/reap-service';

@IonicPage()
@Component({
  selector: 'page-support',
  templateUrl: 'support.html',
})
export class SupportPage {
  devonianPlatform:any;
  deviceVersion:any;
  devonianVersion:any = this.reap.devonianVersion;
  //private networkType:string = this.reap.networkType;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private loadingCtrl: LoadingController,
              // public plt: Platform,
              private device: Device,
              private appVersion: AppVersion,
              private reap: ReapService,
              private storage: Storage,
              private network: Network,
              private alertCtrl: AlertController) {
                this.devonianPlatform = this.device.platform;
                this.deviceVersion = this.device.version;

                this.appVersion.getVersionNumber().then((version) => {
                      this.devonianVersion = version;
                      //console.log(JSON.stringify(this.devonianVersion));
                    },(error)=>{
                        //console.log(error);
                      })
                  }

  toSync(){
    //console.log(this.reap.token);
    const loading = this.loadingCtrl.create({
      content: 'Syncing...'
    });
    loading.present();
    this.reap.grabAPIData(this.reap.token);
       setTimeout(() => {
         loading.dismiss();
      }, 2000);

  }

  onLogout(){
          this.reap.formStart = null;
          //clears the authToken from the local storage
          this.reap.token = "";
          /* Clears all local Storage from device when user logs out */
          this.storage.clear();
          const loading = this.loadingCtrl.create({
            content: 'Logging Out...'
          });
          loading.present();
             setTimeout(() => {
                this.reap.removeConnections();
               loading.dismiss();
            }, 2000);
          //pops back to the login page
          this.navCtrl.popToRoot();
     }
     /*** TESTING *****/
     toSubmitOffline(){
     this.storage.get('offlineSubmission').then((data)=>{
       if(data==null){
         let alert = this.alertCtrl.create({
              title: 'No data',
             subTitle: 'No data was submitted offline',
              buttons: ['Dismiss']
            });
          alert.present();
       }
       else{
         var length = data.length;
         while(length--){
           //console.log(length);
           //console.log(data[length]["Status"]);
           if(data[length]["Status"]=="Submitted"){
             data.splice(length,1);
             //console.log(data);
           }
         }
         //initializes storage to data after splicing data
         this.storage.set('offlineSubmission',data);
         this.reap.offlineFormSubmissions = data;

         if(data.length==0){
           let alert = this.alertCtrl.create({
                title: 'No data',
               subTitle: 'No data was submitted offline',
                buttons: ['Dismiss']
              });
            alert.present();
         }
         else{
           let alert = this.alertCtrl.create({
                title: 'Submitting offline...',
               subTitle: 'No. of forms saved offline: '+ data.length,
                buttons: ['Dismiss']
              });
            alert.present();

            data = data.reverse();
            //console.log(data);
            //console.log(data[0]["Info"][0]);
            this.reap.submitOfflineForm(data);
         }
       }
     });
   }
  }
