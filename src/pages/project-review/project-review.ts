import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
//import { mergeMap, retry } from 'rxjs/operators';
import { Storage } from '@ionic/storage';
import { SuccessPage } from '../success/success';
import { StemApiProvider } from '../../providers/stem-api/stem-api';
import { ReapService } from '../../services/reap-service';
@IonicPage()
@Component({
  selector: 'page-project-review',
  templateUrl: 'project-review.html',
})
export class ProjectReviewPage {
  private formDetails:any[] = [];
  private submitData:any[] = [];
  private submitClicked:boolean = false;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public reap: ReapService,
              private stemAPI: StemApiProvider,
              private alertCtrl: AlertController,
              private loadingCtrl: LoadingController,
              private storage: Storage) {
    this.formDetails.push(this.reap.projectForm);
  }
  editForm(){
   this.navCtrl.pop();
  }
  onSubmit(){
  this.submitClicked = true;
  let alert = this.alertCtrl.create({
   title: 'Confirm Submittion',
   message: 'Are you sure you want to submit?',
   buttons: [
             {
               text: 'Yes',
                role: 'Yes',
               handler: () => {
                 let loading = this.loadingCtrl.create({
                   content: 'Submitting...'
                  });

    this.submitData.push({'project':this.reap.projectForm});
    //console.log(this.submitData);
    loading.present();
    this.stemAPI.submitDevonianForm(this.submitData,this.reap.token).subscribe((result)=>{
    //console.log(result['Status']);
        //setTimeout(() => {
        loading.dismiss();
      //}, 2000);
    //give error to user if Location is not sent
    if(result['Status']==false){
      let alert = this.alertCtrl.create({
      title: 'The Location Was not Submitted in New Project!',
      message: 'Please add Location to Project before submitting!',
      buttons: [
             {
               text: 'Acknowledged',
                role: 'Yes',
               handler: () => {
                this.submitClicked = false;
               }
             }
          ]
      });
   alert.present();
    }
    //only Submit if form field are correct
    else if(result['Status']==true){
      this.navCtrl.push(SuccessPage,{'Success':'Project Form Submitted!'});
    }
  },(err) => {
    loading.dismiss();
    let alert = this.alertCtrl.create({
    title: 'Error: ',
    message: 'Try Again Or Submit Offline!',
    buttons: [
           {
             text: 'Try Again',
              role: 'Yes',
             handler: () => {
              this.submitClicked = false;
             }
           },
           {
              text: 'Submit Offline and Sync later',
                role: 'Yes',
                handler: () => {
                /* allows user to submit offline and saves form data into a form variable
                no data will be submitted until interenet connection is made via a sync or observable call */
                /****** TESTING    *********************/
                this.reap.offlineFormSubmissions.push({"Type":"Project","Info":this.submitData,"Status":"Pending"});
                this.storage.set('offlineSubmission',this.reap.offlineFormSubmissions);
                this.submitData = [];
                this.navCtrl.push(SuccessPage,{'Success':'Form submitted offline, please go to support page and re-submit!'});
            }
          }
        ]
    });
 alert.present();
      });
    }
   },{
   text: 'No',
   role: 'cancel',
   handler: () => {
     this.submitClicked = false;
     //console.log('No clicked');
          }
        },
      ]
    });
  alert.present();
}

  toCancel(){
    let alert = this.alertCtrl.create({
    title: 'Are you sure you want to cancel?',
    message: 'This will return you to the home page and form will not be submitted, Continue?',
    buttons: [
           {
             text: 'Yes',
              role: 'Yes',
             handler: () => {
               //console.log('Yes clicked');
               //pops to home page
               this.navCtrl.popTo(this.navCtrl.getByIndex(1));
             }
           },
           {
             text: 'No',
             role: 'cancel',
             handler: () => {
               //console.log('No clicked');
             }
           }
        ]
    });
 alert.present();
  }
}
