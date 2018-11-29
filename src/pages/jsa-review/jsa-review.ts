import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController,LoadingController, NavParams, ViewController, AlertController, Platform, ToastController } from 'ionic-angular';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { Md5 } from 'ts-md5/dist/md5';
import { Geolocation } from '@ionic-native/geolocation';
import { Storage } from '@ionic/storage';

import { SuccessPage } from '../success/success';
import { ReapService } from '../../services/reap-service';
import { StemApiProvider } from '../../providers/stem-api/stem-api';

@IonicPage()
@Component({
  selector: 'page-jsa-review',
  templateUrl: 'jsa-review.html',
})
export class JsaReviewPage {
  private formDetails:any[] = [];//stores form data from jsa form
  private submitData:any[] = [];//stores everything for API submission
  private submitClicked:boolean = false;
  private md5Data:any;//md5 variable
  private lonlat:any = [];//stores gps coords
  date = new Date();
  currentTime:any = new Date(new Date(this.date.getTime())).toISOString();//re-configures time for Angular/JS
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private alertCtrl: AlertController,
              private viewCtrl: ViewController,
              private platform: Platform,
              private geolocation: Geolocation,
              private stemAPI: StemApiProvider,
              private reap: ReapService,
              public loadingCtrl: LoadingController,
              private storage: Storage,
              private toastCtrl: ToastController){

              }

  ionViewWillEnter() {
    this.formDetails.push(this.reap.jsaForm);
    //Re-configures time and replaces it
    this.formDetails[0]["currentTime"] = this.currentTime;
    console.log(this.formDetails);
    this.platform.ready().then(() => {
        /* Perform initial geolocation */
        this.geolocation.getCurrentPosition().then((resp) => {
            this.lonlat = [resp.coords.latitude,resp.coords.longitude];
            //console.log(this.lonlat);
          }).catch((error) => {
            this.reap.presentToast(error);
          });//end of error
        });//end of platform
    //fixes issue with signature swiping back.
  this.navCtrl.swipeBackEnabled = false;
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
    var md5 = new Md5();//md5 hash for custom guid
    var time = new Date();//timestamp
    /*md5 hashes form data with signature and timestamp for unique guid*/
    this.md5Data = md5.appendStr(JSON.stringify(this.formDetails)).appendStr(this.lonlat.toString()).appendStr(time.getTime().toString()).end();
    /*Pushes all data to array for form submission*/
    this.submitData.push({'JSA':this.formDetails},{'gpsLoc':this.lonlat.toString()},{'md5':this.md5Data});
    /*
    *
      */
    console.log(this.submitData);
    loading.present();
    this.stemAPI.submitDevonianForm(this.submitData,this.reap.token).subscribe((result)=>{
      if(result['Status'] == false){
        if (result['MSG']=='Field Form Was Not Saved!\nThis is a duplicate form.'){
          this.reap.presentToast('Work Ticket Form has already been submitted!');
          var response = "Work Ticket Form has already been submitted! Will Exit Form!"
          var reRoute = true;
        }
        else{
          var response = "Please Select Location in Main Form!";
          var reRoute = false;
        }
        loading.dismiss();
    //give error to user if Location is not sent
      let alert = this.alertCtrl.create({
      title: 'Error Submitting, ',
      message: result['MSG'],
      buttons: [
             {
               text: response,
                role: 'Yes',
               handler: () => {
                 if(reRoute){//If guid is in system
                   loading.dismiss();
                   //Can fix message on API Side
                   //this.navCtrl.push(SuccessPage,{'Success':result['MSG']});
                   this.navCtrl.push(SuccessPage,{'Success':'WORK ORDER WAS ALREADY SUBMITTED, PLEASE CONTACT THE OFFICE TO CONFIRM!'});
                 }
                this.submitClicked = false;
               }
             }
          ]
      });
   alert.present();
    }
    //only Submit if form field are correct
    else if(result['Status']==true){
      loading.dismiss();
      this.navCtrl.push(SuccessPage,{'Success':'JSA Form Submitted!'});
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
              this.submitData = []; 
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
                this.reap.offlineFormSubmissions.push({"Type":"JSA","Info":this.submitData,"Status":"Pending"});
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
