import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { LoginPage } from '../login/login';
import { SafetyPage } from '../safety/safety';
import { ProjectPage } from '../project/project';
import { WellLocationsPage } from '../well-locations/well-locations';
import { QueuePage } from '../queue/queue';
import { ReapService } from '../../services/reap-service';
import { StemApiProvider } from '../../providers/stem-api/stem-api';
import { SupportPage } from '../support/support';
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

  toSaftey(){
    //console.log(this.reap.formStart);
      if(this.reap.formStart==null){//checks if there is not a variable stored in local storage
        let loading = this.loadingCtrl.create({
          content: 'Grabbing information from server..'
         });
        loading.present();
        this.reap.formStart = true;
        this.stemAPI.submitSafetyForm({"formStart":this.reap.formStart},this.reap.token).subscribe((result) =>{
        this.storage.set('formStart',this.reap.formStart);//sets local storage
        setTimeout(() => {
        loading.dismiss();
        this.navCtrl.push(SafetyPage);
          }, 2000);
        }, (err) => {
        let alert = this.alertCtrl.create({
            title: 'Error Grabbing Data.. ',
            message: 'Try Again! If issues persists, please contact Stem Support!',
            buttons: [
                 {
                   text: 'Acknowledged',
                    role: 'Yes',
                   handler: () => {
                     setTimeout(() => {
                     loading.dismiss();
                     }, 2000);
                   }
                 }
                ]
              });//end alert
            });//end api call
          }
      else{// pushed straight to Safety Page if user had previously submitted an initial Safety Form
        this.navCtrl.push(SafetyPage);
      }
  }//end function
  toProject(){
    this.navCtrl.push(ProjectPage);
  }
  toSupport(){
    this.navCtrl.push(SupportPage);
  }
  toWellLocations(){
    this.navCtrl.push(WellLocationsPage);
  }
  toQueue(){
    this.navCtrl.push(QueuePage);
  }

}
