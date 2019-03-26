import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController,LoadingController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { Md5 } from 'ts-md5/dist/md5';
import { Geolocation } from '@ionic-native/geolocation';
import { Storage } from '@ionic/storage';

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

  public crewPersonnel:any [] = this.reap.globalCrewPersonnel;//From existing CrewPersonnel
  public crewEquipment:any [] = this.reap.globalCrewEquipment;//From existing CrewEquipment
  //public crewItems:any [] = this.reap.globalCrewItems;
  public mergeEquipment:any [] = [];//merges all equipment together
  public mergePersonnel:any [] = [];//merges all equipment together
  public formDetails:any[] = [];//from main Work Order form
  public miscDetails:any[] = this.reap.misc;// stores misc form
  public isMisc:boolean = false;
  public isPhoto:boolean = false;
  public isCrewEquipment:boolean = false;
  public isAddedEquipment:boolean = false;
  public isCrewLabor:boolean = false;
  public isAddedLabor:boolean = false;
  public personnelDetails:any[] = this.reap.personnel;//When adding new Labor
  public equipmentDetails:any[] = this.reap.equipment;//When adding new Equipment
  //private jobDetails:any[] = this.reap.job;//stores job form
  public photoDetails:any[] = this.reap.photo;//stores photo globally
  public signatureImage: string;//stores signature
  public cancelled = "false";//boolean to see if user cancelled form submisison
  private submitData:any[] = [];//Main array to submit everything
  private md5Data:any;//md5 variable
  private lonlat:any = [];//stores gps coords
  public submitClicked:boolean = false;//boolean to see if submit button is clicked
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private alertCtrl: AlertController,
              private geolocation: Geolocation,
              private stemAPI: StemApiProvider,
              private reap: ReapService,
              public loadingCtrl: LoadingController,
              private storage: Storage,
              private toastCtrl: ToastController) {
                this.reap.misc==null||!this.reap.misc.length ? this.isMisc = false :this.isMisc = true;
                this.reap.photo==null||!this.reap.photo.length ? this.isPhoto= false : this.isPhoto= true;
                this.crewEquipment==null||!this.crewEquipment.length ? this.isCrewEquipment= false : this.isCrewEquipment= true;
                this.equipmentDetails==null||!this.equipmentDetails.length ? this.isAddedEquipment= false : this.isAddedEquipment= true;
                this.crewPersonnel==null||!this.crewPersonnel.length ? this.isCrewLabor= false : this.isCrewLabor= true;
                this.personnelDetails==null||!this.personnelDetails.length ? this.isAddedLabor= false : this.isAddedLabor= true;
            this.formDetails.push(this.reap.fieldTicketForm);

            if(this.reap.selectedJob!=null){
              this.formDetails[0]['Job'] = this.reap.selectedJob;
            }

            var date = new Date(this.formDetails[0]['currentDate']);
            this.formDetails[0]['currentDate'] = (date.getMonth()+1) + '/' + date.getDate() + '/' + date.getFullYear();
  }
  ionViewWillEnter(){
        this.reap.getVersionNumber();
        /* Perform initial geolocation */
        this.geolocation.getCurrentPosition().then((resp) => {
            this.lonlat = [resp.coords.latitude,resp.coords.longitude];
          }).catch((error) => {
            this.reap.presentToast(error);
            this.lonlat = ["Error grabbing location"];
          });//end of error
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
    if(this.isCrewLabor){
      for(let i=0;i<this.crewPersonnel.length;i++){
        this.mergePersonnel.push({'ID':this.crewPersonnel[i]['ID'],
                                  'Name':this.crewPersonnel[i]['Name'],
                                  'Hours':this.crewPersonnel[i]['Hours'],
                                  'Title':this.crewPersonnel[i]['Title'],
                                  'BillingCode':this.crewPersonnel[i]['BillingCode'],
                                  'EmployeeCode':this.crewPersonnel[i]['EmployeeCode']
                               });
      }
    }

    if(this.isAddedLabor){
      for(let i=0;i<this.personnelDetails.length;i++){
        this.mergePersonnel.push({'ID':this.personnelDetails[i]['ID'],
                                  'Name':this.personnelDetails[i]['Name'],
                                  'Hours':this.personnelDetails[i]['Hours'],
                                  'Title':this.personnelDetails[i]['Title'],
                                  'BillingCode':this.personnelDetails[i]['BillingCode'],
                                  'EmployeeCode':this.personnelDetails[i]['EmployeeCode']
                               });
      }
    }

    if(this.isCrewEquipment){
    for(let i=0;i<this.crewEquipment.length;i++){
      this.mergeEquipment.push({'ID':this.crewEquipment[i]['ID'],
                         'Name':this.crewEquipment[i]['Name'].replace(/["]+/g, 'in. ').replace(/[']+/g, 'ft. '),// This is commented out because of quotes breaking API
                         'Hours':this.crewEquipment[i]['Hours'],
                         'Cost_Center':this.crewEquipment[i]['Cost_Center'],
                         'Equipment_Bill_Code':this.crewEquipment[i]['Equipment_Bill_Code']
                      });
      }
    }
    if(this.isAddedEquipment){
    for(let i=0;i<this.equipmentDetails.length;i++){
      this.mergeEquipment.push({'ID':this.equipmentDetails[i]['ID'],
                          'Name':this.equipmentDetails[i]['Name'].replace(/["]+/g, 'in. ').replace(/[']+/g, 'ft. '),// This is commented out because of quotes breaking API
                          'Hours':this.equipmentDetails[i]['Hours'],
                          'Cost_Center':this.equipmentDetails[i]['Cost_Center'],
                          'Equipment_Bill_Code':this.equipmentDetails[i]['Equipment_Bill_Code']
                    });
                    }
                  }

    //replaces quotes with ft and in
    this.formDetails[0]['PhaseCode']['Description'] = this.formDetails[0]['PhaseCode']['Description'].replace(/["]+/g, 'in.').replace(/[']+/g, 'ft.');
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
                 //saves as base64
                 this.signatureImage = this.signaturePad.toDataURL();
                 /*md5 hashes form data with signature and timestamp for unique guid*/
                 this.md5Data = md5.appendStr(JSON.stringify(this.formDetails)).appendStr(this.signatureImage.toString()).appendStr(this.lonlat.toString()).appendStr(time.getTime().toString()).end();
                 /*Pushes all data to array for form submission*/
                 this.submitData.push({'wo':this.formDetails},{'sig':this.signatureImage},{'gpsLoc':this.lonlat.toString()},{'md5':this.md5Data},{'Equipment':this.mergeEquipment},{'Labor':this.mergePersonnel},{'Misc':this.miscDetails},{'Photo':this.photoDetails},{'AppVersion':this.reap.saulsburyVersion});
                 /*
                 *
                 */
                 loading.present();
                 //creates a loading controller while user submits
                 this.stemAPI.submitSaulsburyForm(this.submitData,this.reap.token).subscribe((result) =>{

                  //setTimeout(() => {
                  if(result['Status'] == false){
                    if (result['MSG']=='Field Form Was Not Saved!\nThis is a duplicate form.'){
                      this.reap.presentToast('Work Ticket Form has already been submitted!');
                      var response = "Work Ticket Form has already been submitted! Will Exit Form!"
                      var reRoute = true;
                    }
                    else{
                      response = "Please Select Location in Main Form!";
                      reRoute = false;
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

                                  this.navCtrl.push(SuccessPage,{'Success':'WORK ORDER WAS ALREADY SUBMITTED, PLEASE CONTACT THE OFFICE TO CONFIRM!'});
                                }
                                setTimeout(() => {
                                loading.dismiss();
                                },1000);
                                //this.reap.formStart==null
                                this.mergeEquipment = [];//resets equipment array
                                this.submitClicked=false;//enables the submission button to resubmit
                                this.submitData = [];//resets Submission so data isnt inserted twice
                             }
                           }
                        ]
                    });
                  alert.present();
                          }
                          else{
                         loading.dismiss();

                         this.navCtrl.push(SuccessPage,{'Success':'FIELD TICKET WAS SUBMITTED SUCCESSFULLY'});
                       }
                      // }, 2000);
                     }, (err) => {
                       loading.dismiss();
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

                                 this.reap.offlineFormSubmissions.push({"Type":"WO","Info":this.submitData,"Status":"Pending"});
                                 this.storage.set('offlineSubmission',this.reap.offlineFormSubmissions);
                                 this.submitData = [];

                                 this.navCtrl.push(SuccessPage,{'Success':'Please go to support page and manually submit current form before submitting any new forms!'});
                              }
                            }
                             ]
                         });
                       alert.present();
                     });
                }
             },{//Second alert asking about submission
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
               //pops to home page
                this.reap.equipment = [];
                this.reap.personnel = [];
                this.reap.misc = [];
                this.reap.photo = [];
                this.reap.job = [];
               this.navCtrl.popTo(this.navCtrl.getByIndex(1));
             }
           },
           {
             text: 'No',
             role: 'cancel',
             handler: () => {
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
  //this.reap.presentAlert2('Confirm Delete','Are you sure you want to Delete?','Yes','Cancel');
  var alert = this.alertCtrl.create({
    title: 'Confirm Delete',
    subTitle: 'Are you sure you want to Delete?',
     buttons: [
      {
        text: 'Yes',
        handler: () => {
          this.reap.misc.splice(index, 1);
          this.miscDetails = this.reap.misc;
          this.reap.misc==null||!this.reap.misc.length ? this.isMisc = false :this.isMisc = true;
        }
      },
      {
        text: 'Cancel',
        role: 'Cancel',
        handler: () => {
        }
      }

     ]
   });
  alert.present();
 }

 removeEquipment(index){
  //this.reap.presentAlert2('Confirm Delete','Are you sure you want to Delete?','Yes','Cancel');
  var alert = this.alertCtrl.create({
    title: 'Confirm Delete',
    subTitle: 'Are you sure you want to Delete?',
     buttons: [
      {
        text: 'Yes',
        handler: () => {
          this.reap.equipment.splice(index, 1);
          this.equipmentDetails = this.reap.equipment;
          this.equipmentDetails==null||!this.equipmentDetails.length ? this.isAddedEquipment= false : this.isAddedEquipment= true;
        }
      },
      {
        text: 'Cancel',
        role: 'Cancel',
        handler: () => {
        }
      }

     ]
   });
  alert.present();
 }
 removePersonnel(index){
  // this.reap.presentAlert2('Confirm Delete','Are you sure you want to Delete?','Yes','Cancel').then((value) =>{
  //   console.log(value);
  // },(err)=>{
  //   console.log(err);
  // });
  var alert = this.alertCtrl.create({
      title: 'Confirm Delete',
      subTitle: 'Are you sure you want to Delete?',
       buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.reap.personnel.splice(index, 1);
            this.personnelDetails = this.reap.personnel;
            this.personnelDetails==null||!this.personnelDetails.length ? this.isAddedLabor= false : this.isAddedLabor= true;
          }
        },
        {
          text: 'Cancel',
          role: 'Cancel',
          handler: () => {
          }
        }

       ]
     });
    alert.present();
 }

 removePhoto(index){
    //this.reap.presentAlert2('Confirm Delete','Are you sure you want to Delete?','Yes','Cancel');

    var alert = this.alertCtrl.create({
      title: 'Confirm Delete',
      subTitle: 'Are you sure you want to Delete?',
       buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.reap.photo.splice(index, 1);
            this.photoDetails = this.reap.photo;
            this.reap.photo==null||!this.reap.photo.length ? this.isPhoto= false : this.isPhoto= true;
          }
        },
        {
          text: 'Cancel',
          role: 'Cancel',
          handler: () => {
          }
        }

       ]
     });
    alert.present();
 }

}
