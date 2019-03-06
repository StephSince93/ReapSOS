import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { LoginPage } from '../login/login';
import { FieldTicketPage } from '../field-ticket/field-ticket';
import { ReapService } from '../../services/reap-service';
import { StemApiProvider } from '../../providers/stem-api/stem-api';
import { SupportPage } from '../support/support';
import { ManageCrewPage } from '../manage-crew/manage-crew';
@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {
  public importedData:any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public stemAPI: StemApiProvider,
              public reap: ReapService,
              public storage: Storage,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController) {

  }
  ionViewWillEnter(){
    if(this.reap.initialLogin==true){//Checks if inital login is true, then grabs data
        this.storage.get('authToken').then((data)=>{
        if(data!=null){
          this.reap.token = data;
            this.storage.get('groupName').then((data)=>{
              this.reap.groupName = data
              if(data!=null){//grabs groupId login
                this.reap.grabAPIData(this.reap.token,this.reap.groupName);
                this.reap.getLocalStorage();
              }
              else{//If no Group name is saved from login
                this.reap.groupName = "";
                this.reap.grabAPIData(this.reap.token,this.reap.groupName);
                this.reap.getLocalStorage();
              }
          },err=>{
            console.log('How`d you get here?'+err);
          });
        }
        else{
          this.reap.presentToast('Sync Unsuccessful');
        }
      },err=>{
        console.log('How`d you get here?'+err);
      });
    }
    else{
      this.reap.getLocalStorage();
    }
    this.reap.initialLogin = false;
    //fixes issue with signature swiping back.
    this.navCtrl.swipeBackEnabled = false;
  }

  toFieldTicket(){
    this.navCtrl.push(FieldTicketPage);
  }
  toSupport(){
    this.navCtrl.push(SupportPage);
  }
  toManageCrew(){
    this.navCtrl.push(ManageCrewPage);
  }
}
