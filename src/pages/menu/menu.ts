import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { LoginPage } from '../login/login';
import { SafetyPage } from '../safety/safety';
import { ProjectPage } from '../project/project';
import { WellLocationsPage } from '../well-locations/well-locations';
import { ReapService } from '../../services/reap-service';
import { StemApiProvider } from '../../providers/stem-api/stem-api';
import { SupportPage } from '../support/support';
import { ManageCrewPage } from '../manage-crew/manage-crew';
import { EmployeeSignaturesPage } from '../employee-signatures/employee-signatures'
import { JsaPage } from '../jsa/jsa';
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
     /* calls local storage once user hits menupage*/

     if(LoginPage.initialLogin==true){
        //console.log('Initial Login is:',LoginPage.initialLogin);
       this.storage.get('authToken').then((data)=>{
       if(data!=null){
       //console.log('GET request happened');
       this.reap.grabAPIData(data);//calls service to grab API data on initial login
        }
     });
    }
    else{
      this.reap.getLocalStorage();
      //console.log('Initial Login is:',LoginPage.initialLogin);
    }
  }
  ionViewWillEnter(){
    //fixes issue with signature swiping back.
    this.navCtrl.swipeBackEnabled = false;
  }

  toWO(){
    //console.log(this.reap.formStart);
      if(this.reap.formStart==null){//checks if there is not a variable stored in local storage
        let loading = this.loadingCtrl.create({
          content: 'Starting New Work Order'
         });
        loading.present();
            this.reap.formStart = true;//starts the new Form
            //Creates Time Stamp for form
            var getTimeStart:any = new Date().toLocaleTimeString().replace("/.*(\d{2}:\d{2}:\d{2}).*/", "$1");
            //saves start time and formstart in local storage
            this.storage.set('formStart',this.reap.formStart);//sets local storage
            this.storage.set('getTimeStart',getTimeStart);
            this.reap.formStartTime = getTimeStart;
        setTimeout(() => {
          loading.dismiss();
          this.navCtrl.push(SafetyPage);
        }, 3000);
      }
      else{// pushed straight to Safety Page if user had previously submitted an initial Safety Form
        this.navCtrl.push(SafetyPage);
      }
  }//end function
  toJSA(){
    this.navCtrl.push(JsaPage);
  }
  toProject(){
    this.navCtrl.push(ProjectPage);
  }
  toSupport(){
    this.navCtrl.push(SupportPage);
  }
  toWellLocations(){
    this.navCtrl.push(WellLocationsPage);
  }
  toManageCrew(){
    this.navCtrl.push(ManageCrewPage);
  }
  toEmployeeSignatures(){
    this.navCtrl.push(EmployeeSignaturesPage);
  }

}
