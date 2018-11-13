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
    });

    if(this.offlineData=[]){
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
        //'file://README.pdf'
      ],
      subject: 'Test',
      body: `
      <div *ngFor="let data of offlineData;let i = index">

        <div *ngIf="data?.Type=='GPS'">
          <h1>'+{{i+1}}+'</h1>
          <h2 class="bold">Form - '+{{data?.Type}}+'</h2>
          <p>Well ID - '+{{data?.Info[0].ID}}+'</p>
          <p>Lat - '+{{data?.Info[1]['Lat']}}+'</p>
          <p>Lon - '+{{data?.Info[2].Lon}}+'</p>
        </div>


        <ion-card-content *ngIf="data?.Type=='Project'">
          <h1>{{i+1}}</h1>
          <h2 class="bold">Form - {{data?.Type}}</h2>
          <p>Project Name - {{data?.Info[0].project.projectName}}</p>
          <p>Location - {{data?.Info[0].project.Location.Location}}</p>
          <p>Company Man - {{data?.Info[0].project.companyMan}}</p>
          <p>AFE - {{data?.Info[0].project.orderNumber}}</p>
        </ion-card-content>

        <ion-card-content *ngIf="data?.Type=='WO'">
          <h1>{{i+1}}</h1>
          <h2 class="bold">Form - Work Order</h2>
          <p>Project - {{data?.Info[0].wo[0].project.Name}}</p>
          <p>Location - {{data?.Info[0].wo[0].Location.Location}}</p>
          <p>Company Man - {{data?.Info[0].wo[0].companyMan}}</p>
          <p>Current Date - {{data?.Info[0].wo[0].currentDate}}</p>
          <p>AFE - {{data?.Info[0].wo[0].workOrder}}</p>
          <p>Foreman - {{data?.Info[0].wo[0].foreman}}</p>
          <p>Start Time - {{data?.Info[0].wo[0].startTime}}</p>
          <p>End Time - {{data?.Info[0].wo[0].endTime}}</p>
          <p>Representative - {{data?.Info[0].wo[0].representative}}</p>
          <p>Job Description - {{data?.Info[0].wo[0].description}}</p>

          <br>
          <h2 class="bold">Sub Form - Equipment</h2>
          <br>
          <div *ngFor="let subData of data.Info[4].Equipment">
          <p>Name - {{subData?.Name}}</p>
          <p>Starting Odometer - {{subData?.Odometer}}</p>
          <p>Ending Odometer - {{subData?.endingOdometer}}</p>
          <br>
          </div>

          <br>
          <h2 class="bold">Sub Form - Labor</h2>
          <br>
          <div *ngFor="let subData of data.Info[5].Labor">
          <p>Empoloyee - {{subData?.FullName}}</p>
          <p>Hours - {{subData?.Hours}}</p>
          <br>
          </div>

          <br>
          <h2 class="bold">Sub Form - Extra Labor</h2>
          <br>
          <div *ngFor="let subData of data.Info[9].extraLabor">
          <p>Name - {{subData?.Name}}</p>
          <p>Hours - {{subData?.Hours}}</p>
          <br>
          </div>

          <br>
          <h2 class="bold">Sub Form - Misc.</h2>
          <br>
          <div *ngFor="let subData of data.Info[6].Misc">
          <p>Description - {{subData?.description}}</p>
          <p>Quantity - {{subData?.quantity}}</p>
          <br>
          </div>

          <br>
          <h2 class="bold">Sub Form - Job Description</h2>
          <br>
          <div *ngFor="let subData of data.Info[7].JobDescription">
          <p>Job Description - {{subData?.jobDescription.ItemDescription}}</p>
          <p>Quantity - {{subData?.quantity}}</p>
          <p>Hours/Days/Cost - {{subData?.each}}</p>
          <br>
          </div>
          </ion-card-content>
      </ion-card>
      `,
      isHtml: true
    };

    // Send a text message using default options
    this.emailComposer.open(email);
    }
}
