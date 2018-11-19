import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams,Platform, AlertController, LoadingController } from 'ionic-angular';
import { SelectSearchableComponent } from 'ionic-select-searchable';
import { NgForm } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';

import { StemApiProvider } from '../../providers/stem-api/stem-api';
import { ReapService } from '../../services/reap-service';
import { SuccessPage } from '../../pages/success/success';
class Personnel {
  public ID: number;
  public FullName: string;
}
@IonicPage()
@Component({
  selector: 'page-employee-signatures',
  templateUrl: 'employee-signatures.html',
})
export class EmployeeSignaturesPage {
  @ViewChild(SignaturePad) public signaturePad: SignaturePad;
  private personnelArray: Personnel[];
  personnel: Personnel;
  private signatureImage: string;//stores signature
  private selectedPersonnel:any = [];
  private sigSubmit:any [] = [];
  private didSelectPersonnel:boolean = false;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public reap: ReapService,
              public stemAPI: StemApiProvider,
              public alertCtrl: AlertController,
              private platform: Platform,
              private storage: Storage,
              private loadingCtrl: LoadingController) {
        this.personnelArray = this.reap.getPersonnel;
  }
  ionViewWillEnter(){
    //fixes issue with signature swiping back.
    this.navCtrl.swipeBackEnabled = false;
  }
  ngAfterViewInit(){
  //  console.log("Comes here!");
    this.signaturePad.clear();
    this.canvasResize();
  }

  personnelChange(event: { component: SelectSearchableComponent, value: any }) {
    this.selectedPersonnel = event.value;
    this.didSelectPersonnel = true;
    //console.log(this.selectedPersonnel);
  }

  canvasResize(){
    let canvas = document.querySelector('canvas');
    this.signaturePad.set('canvasWidth', canvas.offsetWidth);
    this.signaturePad.set('canvasHeight', canvas.offsetHeight);
  }

  sigClear(){
    this.signaturePad.clear();
  }
  onSubmit(){
    let alert = this.alertCtrl.create({
       title: 'Submit',
       message: 'Are you sure you want to Submit?',
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
    //console.log(this.signatureImage);
    //console.log(this.selectedPersonnel);
    this.sigSubmit.push({'personnel':this.selectedPersonnel},{'signature':this.signatureImage});
    //console.log(this.sigSubmit);

    loading.present();


    this.stemAPI.updateSig(this.sigSubmit,this.reap.token).subscribe((result) =>{

      console.log(result["MSG"]);
      loading.dismiss();
      //this.storage.set('globalBolChemicals',this.reap.bolGlobalChemicals);// Sets local storage for chemicals user submits to BOL for future use until they confirm BOL
      this.navCtrl.push(SuccessPage,{'Success':result['MSG']});//goes to success page
    }, (err) => {
      //converts result to JSON response
      setTimeout(() => {
          loading.dismiss();
      }, 2000);
    let alert = this.alertCtrl.create({
          title: 'Error Submitting, ',
          message: 'Try submitting again, or Sumbit offline.',
          buttons: [
                   {
                     text: 'Try Submitting Again',
                      role: 'Yes',
                     handler: () => {
                        // this.submitClicked=false;//enables the submission button to resubmit
                        // this.submitData = [];//resets Submission so data isnt inserted twice
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
                    this.reap.offlineFormSubmissions.push({"Type":"SIG","Info":this.sigSubmit,"Status":"Pending"});
                    this.storage.set('offlineSubmission',this.reap.offlineFormSubmissions);
                    this.sigSubmit = [];

                    this.navCtrl.push(SuccessPage,{'Success':'Please go to support page and manually submit current form before submitting any new forms!'});
                 }
               }
                ]
            });
          alert.present();
                //console.log(err);
         }
       )}
       },
       {
         text: 'No',
         role: 'Cancel',
         handler: () => {

         }
       }
      ]
      });
      alert.present();
    }
}
