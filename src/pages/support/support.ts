import { Component } from '@angular/core';
import { IonicPage, NavController,LoadingController,ModalController , NavParams } from 'ionic-angular';
import { Device } from '@ionic-native/device';
import { Storage } from '@ionic/storage';
//import { Pro } from '@ionic/pro';

import { ReapService } from '../../services/reap-service';
import { OfflineDataPage }  from '../offline-data/offline-data';
@IonicPage()
@Component({
  selector: 'page-support',
  templateUrl: 'support.html',
})
export class SupportPage {
  public saulsburyPlatform:any;
  public deviceVersion:any;
  public saulsburyVersion:any = this.reap.saulsburyVersion;
  public networkType:any = this.reap.networkType;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private loadingCtrl: LoadingController,
              private device: Device,
              private reap: ReapService,
              private storage: Storage,
              private modalCtrl: ModalController) {
                this.saulsburyPlatform = this.device.platform;
                this.deviceVersion = this.device.version;
              }
  toSync(){
    //console.log(this.reap.token);
    const loading = this.loadingCtrl.create({
      content: 'Syncing...'
    });
    loading.present();

    this.reap.grabAPIData(this.reap.token,this.reap.groupName)
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
                //this.reap.presentToast('Logged Out');
                //pops back to the login page
                this.navCtrl.popToRoot();
               loading.dismiss();
            }, 2000);
     }
    toviewData(){
      const modal = this.modalCtrl.create(OfflineDataPage);
      modal.present();
    }
  }
