import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { EmailComposer } from '@ionic-native/email-composer';

import { ReapService } from '../../services/reap-service';
import { StemApiProvider } from '../../providers/stem-api/stem-api';
@IonicPage()
@Component({
  selector: 'page-offline-data',
  templateUrl: 'offline-data.html',
})
export class OfflineDataPage {
  private offlineData:any [] =[];
  private isData:boolean = false;
  private emailJSONData:any = [];
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public storage: Storage,
              public viewCtrl: ViewController,
              private emailComposer: EmailComposer,
              public reap: ReapService,
              public stemAPI: StemApiProvider,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController) {

  }
  ionViewDidLoad(){
    this.storage.get('offlineSubmission').then((data)=>{
        this.offlineData=data;
        // console.log(data);
        // console.log(JSON.stringify(data));
        this.emailJSONData = JSON.stringify(data);
        this.anyData();
    });
  }
  anyData(){
    if(this.offlineData.length==0||this.offlineData==null){
      this.isData = false;
      //console.log(this.isData);
    }
    else{
      this.isData = true;
    }
  }
  dismissModal() {
    this.viewCtrl.dismiss();
  }
  sendEmail(){
    this.emailComposer.isAvailable().then((available: boolean) =>{
     if(available) {
       //Now we know we can send
     }
    },(err) => {
      this.reap.presentToast('Error Emailing Data');
    });

    let email = {
      to: 'support@stemsoftware.com',
      //cc: '',
      //bcc: ['john@doe.com', 'jane@doe.com'],
      attachments: [
        //'file://img/logo.png',
        //'res://icon.png',
        //'base64:icon.png//iVBORw0KGgoAAAANSUhEUg...',
        'file://'+this.emailJSONData.toString()+'.json'
      ],
      subject: 'Offline Data Submissions',
       body: this.emailJSONData.toString(),
      isHtml: false
    };

    // Send a text message using default options
    this.emailComposer.open(email);
    }
    retrySubmit(data,type,index){
      console.log(data,type,index);
      var API;
      switch(type){
        case "WO":
          API = this.stemAPI.submitDevonianForm(data,this.reap.token);
          //console.log(API);
          break;

        // case "GPS":
        //   API = this.stemAPI.updateGPSLoc(data,this.reap.token);
        //   console.log(API);
        //   break;
        //
        // case "Batch":
        // case "Special":
        // case "LoadandTest":
        //   API = this.stemAPI.submitBatchData(data,this.reap.token);
        //   //console.log(API);
        //   break;
        //
        // case "ConfirmBOL":
        //   API = this.stemAPI.confirmBOLData(data,this.reap.token);
        //   //console.log(API);
        //   break;
      }

      let loading = this.loadingCtrl.create({
                    content: 'Submitting...'
                   });
              loading.present();
      //submits BOL to API
      API.subscribe((result) =>{
          this.reap.presentToast(result['MSG']);
          this.offlineData.splice(index,1);//removes form submission
          this.storage.set('offlineSubmission',this.offlineData);//stores local updates
          this.anyData();
          loading.dismiss();
       }, (err) => {
             loading.dismiss();
            let alert = this.alertCtrl.create({
            title: 'Error: ',
            message: 'Could not Submit!',
            buttons: [
            {
            text: 'Acknowledged',
             role: 'Yes',
            handler: () => {
            //resets data saved in array when API call fails to prevent double submission
            }
          }
        ]
      });
      alert.present();
      console.log(err);
      });
    }
}
