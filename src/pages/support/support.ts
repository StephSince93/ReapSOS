import { Component } from '@angular/core';
import { IonicPage, NavController,LoadingController, NavParams } from 'ionic-angular';
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
  omegaPlatform:any;
  deviceVersion:any;
  omegaVersion:any;
  //private networkType:string = this.reap.networkType;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private loadingCtrl: LoadingController,
              // public plt: Platform,
              private device: Device,
              private appVersion: AppVersion,
              private reap: ReapService,
              private storage: Storage,
              private network: Network) {
                this.omegaPlatform = this.device.platform;
                this.deviceVersion = this.device.version;

                this.appVersion.getVersionNumber().then((version) => {
                      this.omegaVersion = version;
                      console.log(JSON.stringify(this.omegaVersion));
                    },(error)=>{
                        console.log(error);
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
  }
