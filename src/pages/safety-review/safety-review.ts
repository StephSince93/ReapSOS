import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController,LoadingController, NavParams, ViewController, AlertController, Platform } from 'ionic-angular';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { Md5 } from 'ts-md5/dist/md5';
import { Geolocation } from '@ionic-native/geolocation';
import { Storage } from '@ionic/storage';

import { MenuPage } from '../menu/menu';
import { SuccessPage } from '../success/success';
import { ReapService } from '../../services/reap-service';
import { StemApiProvider } from '../../providers/stem-api/stem-api';
@IonicPage()
@Component({
  selector: 'page-safety-review',
  templateUrl: 'safety-review.html',
})
export class SafetyReviewPage {
  @ViewChild(SignaturePad) public signaturePad: SignaturePad;
  private formDetails:any[] = [];
  private miscDetails:any[] = this.reap.misc;
  private laborDetails:any[] = this.reap.labor;
  private equipmentDetails:any[] = this.reap.equipment;
  private photoDetails:any[] = this.reap.photo;
  public signatureImage: string;
  public cancelled = "false";
  private submitData:any[] = [];
  private md5Data:any;
  private lonlat:any = [];
  private projectName:string;
  res:any = {};//API submission response
  private submitClicked:boolean = false;
  isDisconnected:any;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private alertCtrl: AlertController,
              private viewCtrl: ViewController,
              private platform: Platform,
              private geolocation: Geolocation,
              private stemAPI: StemApiProvider,
              private reap: ReapService,
              public loadingCtrl: LoadingController,
              private storage: Storage) {

            this.formDetails.push(this.reap.safetyForm);
            //console.log(this.formDetails[0]['project']);
            for(let i=0;i<this.reap.getProject.length;i++){
              if(this.formDetails[0]['project']==this.reap.getProject[i]['ID']){
                this.projectName = this.reap.getProject[i]['ProjectName'];
                //console.log(this.projectName);
              }
              else{
                this.projectName = "";
              }
            }

            var date = new Date(this.formDetails[0]['currentDate']);
            this.formDetails[0]['currentDate'] = (date.getMonth()+1) + '-' + date.getDate() + '-' + date.getFullYear();
            //console.log(this.laborDetails);
            //console.log(this.formDetails[0]['currentDate'])
            //console.log(this.mileageDetails);
            /* Ensure the platform is ready */
this.platform.ready().then(() => {
    /* Perform initial geolocation */
    this.geolocation.getCurrentPosition().then((resp) => {
        this.lonlat = [resp.coords.latitude,resp.coords.longitude];
        //console.log(this.lonlat);
      }).catch((error) => {
        console.log('Error getting location', error);
      });
    });
  }
  canvasResize(){
    let canvas = document.querySelector('canvas');
    this.signaturePad.set('canvasWidth', canvas.offsetWidth);
    this.signaturePad.set('canvasHeight', canvas.offsetHeight);
  }

  sigClear(){
    this.signaturePad.clear();
  }
  sigSubmit(){
    this.submitClicked = true;
    var md5 = new Md5();//md5 hash for custom guid
    var time = new Date();//timestamp
    let alert = this.alertCtrl.create({
   title: 'Confirm Submission',
   message: 'Are you sure you want to submit?',
   buttons: [
             {
               text: 'Yes',
                role: 'Yes',
               handler: () => {
            let alert = this.alertCtrl.create({
                title: 'Double Check Information',
                message: 'Did you review all information submitted?',
                buttons: [
                          {
                            text: 'Yes',
                             role: 'Yes',
                            handler: () => {

                 let loading = this.loadingCtrl.create({
                   content: 'Submitting...'
                  });
                 //console.log('Yes clicked');
                 //saves as base64
                 this.signatureImage = this.signaturePad.toDataURL();
                 //console.log(this.signatureImage);
                 /*md5 hashes form data with signature and timestamp for unique guid*/
                 this.md5Data = md5.appendStr(JSON.stringify(this.formDetails)).appendStr(this.signatureImage.toString()).appendStr(this.lonlat.toString()).appendStr(time.getTime().toString()).end();
                 /*Pushes all data to array for form submission*/
                 this.submitData.push({'safety':this.formDetails},{'sig':this.signatureImage},{'gpsLoc':this.lonlat.toString()},{'md5':this.md5Data},{'Equipment':this.equipmentDetails},{'Labor':this.laborDetails},{'Misc':this.miscDetails},{'Photo':this.photoDetails});
                 /*
                 *
                 */
                 //console.log(this.submitData);
                 loading.present();
              /*******************TESTING***********************************/
                 if(this.reap.online=="offline"){
                   //console.log('user is offline while submitting, will store data and submit later');
                   //console.log(this.reap.online);

                   this.storage.set('offlineSubmission',this.submitData);
                   let alert = this.alertCtrl.create({
                   title: 'Submitted Form Offline',
                   message: 'Please wait for device to return online before submitting another form! Form will be submitted once online again!',
                   buttons: [
                            {
                              text: 'Acknowledged',
                               role: 'Yes',
                              handler: () => {
                                setTimeout(() => {
                                loading.dismiss();
                              });
                                 this.navCtrl.push(SuccessPage,{'Success':'Please wait before submitting another form!'});
                                 this.submitData = [];//resets Submission so data isnt inserted twice
                              }
                            }
                         ]
                     });
                   alert.present();

                 }else{
                 //console.log(this.reap.online);
                 //creates a loading controller while user submits
                 this.stemAPI.submitSafetyForm(this.submitData,this.reap.token).then((result) =>{
                   //converts result to array
                   this.res = JSON.stringify(result);
                   this.res = JSON.parse(this.res);
                   //console.log(this.res);

                    setTimeout(() => {
                    loading.dismiss();
                  }, 3000);
                    setTimeout(() => {
              if(this.res.Status == false){
              let alert = this.alertCtrl.create({
              title: 'Error Submitting, ',
              message: 'Try submitting again, If issues persists contact stem support.',
              buttons: [
                       {
                         text: 'Try Submitting Again',
                          role: 'Yes',
                         handler: () => {
                           setTimeout(() => {
                           loading.dismiss();
                         });
                            this.submitClicked=false;//enables the submission button to resubmit
                            this.submitData = [];//resets Submission so data isnt inserted twice
                         }
                       },
                       {
                     text: 'Submit Offline and Sync later',
                      role: 'Yes',
                     handler: () => {
                        /* allows user to submit offline and saves form data into a form variable
                        no data will be submitted until interenet connection is made via a sync or observable call */
                        /****** TESTING    *********************/
                        this.storage.set('offlineSubmission',this.submitData);
                        this.submitData = [];

                        this.navCtrl.push(SuccessPage,{'Success':'Please go to support page and manually submit current form before submitting any new forms!'});
                     }
                   }
                    ]
                });
              alert.present();
              console.log(this.res.MSG);
                      }
                      else{
                     this.navCtrl.push(SuccessPage,{'success':this.res.MSG});
                   }
                   }, 2000);
                 }, (err) => {
                   let alert = this.alertCtrl.create({
         title: 'Error Submitting, ',
         message: 'Error:'+ err+ ', please screen shot this error and send to support!',
         buttons: [
                  {
                    text: 'Acknowledged',
                     role: 'Yes',
                    handler: () => {
                      setTimeout(() => {
                      loading.dismiss();
                    });
                        this.submitClicked=false;//enables the submission button to resubmit
                       this.submitData = [];//resets Submission so data isnt inserted twice
                    }
                  }
               ]
           });
         alert.present();
         console.log(err);
                 });
              }
            }
         },{//Second alert asking about submission
              text: 'No',
              role: 'cancel',
              handler: () => {
                 this.submitClicked=false;//enables the submission button to resubmit
                //console.log('No clicked');
              }
            },
          ]
     });
    alert.present();
/**********************************************************************/
   }
 },{//First alert asking about submission
    text: 'No',
    role: 'cancel',
    handler: () => {
    this.submitClicked=false;//enables the submission button to resubmit
       }
      },
     ]
   });
 alert.present();
}



  ngAfterViewInit(){
  //  console.log("Comes here!");
    this.signaturePad.clear();
    this.canvasResize();
  }

  //goes back to the form page
  sigBack(){
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
 editForm(){
  this.navCtrl.popTo(this.navCtrl.getByIndex(2));
 }
 removeMileage(index){

     this.reap.misc.splice(index, 1);
     this.miscDetails = this.reap.misc;
     //console.log(this.mileageDetails);
 }
 removeLabor(index){

     this.reap.labor.splice(index, 1);
     this.laborDetails = this.reap.labor;
     //console.log(this.laborDetails);
 }
 removeEquipment(index){

     this.reap.equipment.splice(index, 1);
     this.equipmentDetails = this.reap.equipment;
     //console.log(this.equipmentDetails);
 }
 removePhoto(index){
     this.reap.photo.splice(index, 1);
     this.photoDetails = this.reap.photo;
     //console.log(this.photoDetails);
 }
}
