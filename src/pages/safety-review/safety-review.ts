import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController,LoadingController, NavParams, ViewController, AlertController, Platform, ToastController } from 'ionic-angular';
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
  //testing for Devonian
  private crewPersonnel:any [] = this.reap.globalCrewPersonnel;//From existing CrewPersonnel
  private crewEquipment:any [] = this.reap.globalCrewEquipment;//From existing CrewEquipment
  private mergeEquipment:any [] = [];//merges all equipment together
  private formDetails:any[] = [];
  private miscDetails:any[] = this.reap.misc;
  private laborDetails:any[] = this.reap.labor;//When adding new Labor
  private equipmentDetails:any[] = this.reap.equipment;//When adding new Equipment
  private jobDetails:any[] = this.reap.job;
  private photoDetails:any[] = this.reap.photo;
  public signatureImage: string;
  public cancelled = "false";
  private submitData:any[] = [];
  private md5Data:any;
  private lonlat:any = [];
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
              private storage: Storage,
              private toastCtrl: ToastController) {
            this.formDetails.push(this.reap.safetyForm);
            // console.log(this.formDetails);
            // console.log(this.jobDetails);
            //console.log(this.equipmentDetails);
            // console.log(this.laborDetails);
            var date = new Date(this.formDetails[0]['currentDate']);
            this.formDetails[0]['currentDate'] = (date.getMonth()+1) + '/' + date.getDate() + '/' + date.getFullYear();
            //console.log(this.laborDetails);
            //console.log(this.formDetails[0]['currentDate'])
            //console.log(this.mileageDetails);
            /* Ensure the platform is ready */
  }
  ionViewWillEnter(){
    this.platform.ready().then(() => {
        /* Perform initial geolocation */
        this.geolocation.getCurrentPosition().then((resp) => {
            this.lonlat = [resp.coords.latitude,resp.coords.longitude];
            //console.log(this.lonlat);
          }).catch((error) => {
            this.presentToast(error);
          });//end of error
        });//end of platform
    //fixes issue with signature swiping back.
  this.navCtrl.swipeBackEnabled = false;
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
    if(this.reap.globalCrewPersonnel==null){
      this.reap.globalCrewPersonnel = [];
    }
    if(this.reap.globalCrewEquipment==null){
      this.reap.globalCrewEquipment = [];
    }
    //this.mergeEquipment = this.reap.globalCrewEquipment;
    if(this.reap.globalCrewEquipment){
    for(let i=0;i<this.reap.globalCrewEquipment.length;i++){
      this.mergeEquipment.push({'ID':this.reap.globalCrewEquipment[i]['ID'],
                        'Name':this.reap.globalCrewEquipment[i]['Name'],
                        'Odometer':this.reap.globalCrewEquipment[i]['Odometer'],
                        'endingOdometer':this.reap.globalCrewEquipment[i]['endingOdometer']});
      }
    }
    if(this.equipmentDetails){
    for(let i=0;i<this.equipmentDetails.length;i++){
      this.mergeEquipment.push({'ID':this.equipmentDetails[i]['ID'],
                      'Name':this.equipmentDetails[i]['Name'],
                      'Odometer':this.equipmentDetails[i]['Odometer'],
                      'endingOdometer':this.equipmentDetails[i]['endingOdometer']});
                    }
                  }
    // console.log(this.equipmentDetails);
    // console.log(this.mergeEquipment);
    //console.log(this.formDetails);
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
                 this.submitData.push({'wo':this.formDetails},{'sig':this.signatureImage},{'gpsLoc':this.lonlat.toString()},{'md5':this.md5Data},{'Equipment':this.mergeEquipment},{'Labor':this.reap.globalCrewPersonnel},{'Misc':this.miscDetails},{'JobDescription':this.jobDetails},{'Photo':this.photoDetails});
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
                   message: 'Please go to support page an re-submit form once back online!',
                   buttons: [
                            {
                              text: 'Acknowledged',
                               role: 'Yes',
                              handler: () => {
                                setTimeout(() => {
                                loading.dismiss();
                                },1000);

                                 this.navCtrl.push(SuccessPage,{'Success':'Please go to support page an re-submit form once back online!'});
                                  loading.dismiss();
                                 this.submitData = [];//resets Submission so data isnt inserted twice
                              }
                            }
                         ]
                     });
                   alert.present();

                 }else{
                 //console.log(this.reap.online);
                 //creates a loading controller while user submits
                 this.stemAPI.submitDevonianForm(this.submitData,this.reap.token).subscribe((result) =>{
                   //converts result to array
                   //console.log(result['Status']);

                   //console.log(this.res);

                    // setTimeout(() => {
                  // }, 3000);
                    setTimeout(() => {
              if(result['Status'] == false){
              loading.dismiss();
              let alert = this.alertCtrl.create({
              title: 'Error Submitting, ',
              message: result['MSG'],
              buttons: [
                           {
                         text: 'Check location and try submitting again!',
                          role: 'Yes',
                         handler: () => {
                            /* allows user to submit offline and saves form data into a form variable
                            no data will be submitted until interenet connection is made via a sync or observable call */
                            /****** TESTING    *********************/
                            setTimeout(() => {
                            loading.dismiss();
                            },1000);
                            //this.reap.formStart==null
                            this.mergeEquipment = [];//resets equipment array
                            // this.storage.remove('formStart');
                            //this.storage.set('offlineSubmission',this.submitData);
                            this.submitClicked=false;//enables the submission button to resubmit
                            this.submitData = [];//resets Submission so data isnt inserted twice
                            //this.navCtrl.push(SuccessPage,{'Success':'Please go to support page and manually submit current form before submitting any new forms!'});
                         }
                       }
                    ]
                });
              alert.present();
              //console.log(this.res.MSG);
                      }
                      else{
                     loading.dismiss();
                     this.reap.formStart = null;
                     this.storage.remove('formStart');
                     this.navCtrl.push(SuccessPage,{'Success':result['MSG']});
                   }
                   }, 2000);
                 }, (err) => {
                   loading.dismiss();
                   // console.log(err);
                   // console.log(err.message);
                   let alert = this.alertCtrl.create({
                   title: 'Error: ',
                   message: 'Try submitting again,or Submit Form Offline!',
                   buttons: [
                            {
                              text: 'Try Submitting Again',
                               role: 'Yes',
                              handler: () => {
                                 this.mergeEquipment = [];
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
                             this.reap.formStart = null;
                             this.storage.remove('formStart');
                             this.reap.offlineFormSubmissions.push({"Type":"WO","Info":this.submitData,"Status":"Pending"});
                             this.storage.set('offlineSubmission',this.reap.offlineFormSubmissions);
                             this.submitData = [];

                             this.navCtrl.push(SuccessPage,{'Success':'Please go to support page and manually submit current form before submitting any new forms!'});
                          }
                        }
                         ]
                     });
                   alert.present();
                  //console.log(err);
                 });
              }
            }
         },{//Second alert asking about submission
              text: 'No',
              role: 'cancel',
              handler: () => {
                 this.mergeEquipment = [];
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
    this.mergeEquipment = [];
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
 removeMisc(index){

     this.reap.misc.splice(index, 1);
     this.miscDetails = this.reap.misc;
     //console.log(this.mileageDetails);
 }
 removeDescription(index){

     this.reap.job.splice(index, 1);
     this.jobDetails = this.reap.job;
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
 presentToast(msg) {
   let toast = this.toastCtrl.create({
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
