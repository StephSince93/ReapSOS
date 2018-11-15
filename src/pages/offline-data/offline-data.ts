import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { EmailComposer } from '@ionic-native/email-composer';

import { ReapService } from '../../services/reap-service';
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
              public reap: ReapService) {

  }
  ionViewDidLoad(){
    this.storage.get('offlineSubmission').then((data)=>{
        this.offlineData=data;
        console.log(data);
        console.log(JSON.stringify(data));
        this.emailJSONData = JSON.stringify(data);
    });

    if(this.offlineData==[]){
      this.isData = false;
      console.log(this.isData);
    }
    else{
      this.isData = true;
    }
  }
  dismiss() {
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
      cc: 'stephen@stemsoftware.com',
      //bcc: ['john@doe.com', 'jane@doe.com'],
      attachments: [
        //'file://img/logo.png',
        //'res://icon.png',
        //'base64:icon.png//iVBORw0KGgoAAAANSUhEUg...',
        'file://'+this.emailJSONData.toString()+'.json'
      ],
      subject: 'Offline Data Submissions',
      // body: this.emailJSONData.toString(),
      isHtml: false
    };

    // Send a text message using default options
    this.emailComposer.open(email);
    }
}
