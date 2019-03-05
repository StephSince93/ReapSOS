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
  selector: 'page-field-ticket-review',
  templateUrl: 'field-ticket-review.html',
})
export class FieldTicketReviewPage {
  @ViewChild(SignaturePad) public signaturePad: SignaturePad;
  //testing for Devonian
  private crewPersonnel:any [] = this.reap.globalCrewPersonnel;//From existing CrewPersonnel
  private crewEquipment:any [] = this.reap.globalCrewEquipment;//From existing CrewEquipment
  private crewItems:any [] = this.reap.globalCrewItems;
  private mergeEquipment:any [] = [];//merges all equipment together
  private formDetails:any[] = [];//from main Work Order form
  private miscDetails:any[] = this.reap.misc;// stores misc form
  private isMisc:boolean = false;
  private isPhoto:boolean = false;
  private laborDetails:any[] = this.reap.extraLabor;//When adding new Labor
  private equipmentDetails:any[] = this.reap.equipment;//When adding new Equipment
  //private jobDetails:any[] = this.reap.job;//stores job form
  private photoDetails:any[] = this.reap.photo;//stores photo globally
  public signatureImage: string;//stores signature
  public cancelled = "false";//boolean to see if user cancelled form submisison
  private submitData:any[] = [];//Main array to submit everything
  private md5Data:any;//md5 variable
  private lonlat:any = [];//stores gps coords
  private submitClicked:boolean = false;//boolean to see if submit button is clicked
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
                console.log(this.reap.misc);
                if(this.reap.misc!=[]||this.reap.misc!=null){
                  this.isMisc = true;
                }
                if(this.reap.photo!=[]||this.reap.photo!=null){
                  this.isPhoto= true;
                }
            this.formDetails.push(this.reap.fieldTicketForm);
            //console.log(this.formDetails[0]['project']);
            if(this.reap.globalCrewJob!=null){
              this.formDetails[0]['Job'] = this.reap.globalCrewJob;
            }
            //console.log(this.jobDetails);
            //console.log(this.equipmentDetails);
            //console.log(this.laborDetails);
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
                        // 'Name':this.reap.globalCrewEquipment[i]['Name'],
                        // 'Odometer':this.reap.globalCrewEquipment[i]['Odometer'],
                        // 'endingOdometer':this.reap.globalCrewEquipment[i]['endingOdometer']
                      });
      }
    }
    if(this.equipmentDetails){
    for(let i=0;i<this.equipmentDetails.length;i++){
      this.mergeEquipment.push({'ID':this.equipmentDetails[i]['ID'],
                      // 'Name':this.equipmentDetails[i]['Name'],
                      // 'Odometer':this.equipmentDetails[i]['Odometer'],
                      // 'endingOdometer':this.equipmentDetails[i]['endingOdometer']
                    });
                    }
                  }
    // for(let i=0;i<this.reap.globalCrewItems.length;i++){
    //     this.reap.globalCrewItems[i]={'JobID':this.reap.globalCrewItems[i].JobID
    //                         // ,'BillCodeDescription':this.reap.globalCrewItems[i].BillCodeDescription
    //                         ,'JobNumber':this.reap.globalCrewItems[i].JobNumber
    //                         // ,'each':this.reap.globalCrewItems[i].each
    //                       };
    //               }
    // console.log(this.equipmentDetails);
    // console.log(this.mergeEquipment);
    //console.log(this.formDetails);
    this.submitClicked = true;
    var md5 = new Md5();//md5 hash for custom guid
    var time = new Date();//timestamp
    //console.log(this.formDetails[0]['endTime']);
    //If user didn't select end time, the time stamp will grab it for them
      if(this.formDetails[0]['endTime'] == ""){
        var getTimeEnd:any = new Date().toLocaleTimeString().replace("/.*(\d{2}:\d{2}:\d{2}).*/", "$1");//timeEnd
        this.formDetails[0]['endTime'] = getTimeEnd;//Grabs when user hits submit on Form
      }
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
                 this.submitData.push({'wo':this.formDetails},{'sig':this.signatureImage},{'gpsLoc':this.lonlat.toString()},{'md5':this.md5Data},{'Equipment':this.mergeEquipment},{'Labor':this.reap.globalCrewPersonnel},{'Misc':this.miscDetails},{'ItemDescription':[]},{'Photo':this.photoDetails},{'extraLabor':this.laborDetails});
                 /*
                 *
                 */
                 loading.present();
                console.log(this.submitData);
                 //creates a loading controller while user submits
                 this.stemAPI.submitSaulsburyForm(this.submitData,this.reap.token).subscribe((result) =>{

                  //setTimeout(() => {
                  if(result['Status'] == false){
                    if (result['MSG']=='Field Form Was Not Saved!\nThis is a duplicate form.'){
                      this.presentToast('Work Ticket Form has already been submitted!');
                      var response = "Work Ticket Form has already been submitted! Will Exit Form!"
                      var reRoute = true;
                    }
                    else{
                      var response = "Please Select Location in Main Form!";
                      var reRoute = false;
                    }
                  loading.dismiss();
                  let alert = this.alertCtrl.create({
                  title: 'Error Submitting, ',
                  message: result['MSG'],
                  buttons: [
                               {

                             text: response,
                              role: 'Yes',
                             handler: () => {
                                //If the system notices there is a duplicate form it wil push user to success page and let them know to contact the office
                                if(reRoute){
                                  loading.dismiss();
                                  // this.reap.formStart = null;
                                  // var getTimeEnd:any = new Date().toLocaleTimeString().replace("/.*(\d{2}:\d{2}:\d{2}).*/", "$1");
                                  // //console.log(getTimeEnd);
                                  // this.storage.remove('getTimeStart');//Probably going to start form with time start
                                  // this.reap.formStart = false;
                                  // this.storage.set('formStart',this.reap.formStart);
                                  //Can fix message on API Side
                                  //this.navCtrl.push(SuccessPage,{'Success':result['MSG']});
                                  this.navCtrl.push(SuccessPage,{'Success':'WORK ORDER WAS ALREADY SUBMITTED, PLEASE CONTACT THE OFFICE TO CONFIRM!'});
                                }
                                setTimeout(() => {
                                loading.dismiss();
                                },1000);
                                //this.reap.formStart==null
                                this.mergeEquipment = [];//resets equipment array
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
                        //  this.reap.formStart = null;
                        //  var getTimeEnd:any = new Date().toLocaleTimeString().replace("/.*(\d{2}:\d{2}:\d{2}).*/", "$1");
                         //console.log(getTimeEnd);
                         //Updates Local storage upon form success
                        //  this.storage.remove('getTimeStart');
                        //  this.reap.formStart = false;
                        //  this.storage.set('formStart',this.reap.formStart);
                         //Can fix message on API Side
                         //this.navCtrl.push(SuccessPage,{'Success':result['MSG']});
                         this.navCtrl.push(SuccessPage,{'Success':'FIELD TICKET WAS SUBMITTED SUCCESSFULLY'});
                       }
                      // }, 2000);
                     }, (err) => {
                       loading.dismiss();
                        //console.log(err);
                        //console.log(err.message);
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

                                //  this.storage.remove('getTimeStart');
                                //  this.reap.formStart = false;
                                //  this.storage.set('formStart',this.reap.formStart);
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
 // removeDescription(index){
 //
 //     this.reap.job.splice(index, 1);
 //     this.jobDetails = this.reap.job;
 //     //console.log(this.mileageDetails);
 // }
 removeLabor(index){

     this.reap.extraLabor.splice(index, 1);
     this.laborDetails = this.reap.extraLabor;
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
