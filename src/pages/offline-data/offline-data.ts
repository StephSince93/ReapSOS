import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { EmailComposer } from '@ionic-native/email-composer';
import { File } from '@ionic-native/file';

import { ReapService } from '../../services/reap-service';
import { StemApiProvider } from '../../providers/stem-api/stem-api';

export interface WriteOptions {
  create?: boolean;
  replace?: boolean;
  append?: boolean;
  truncate?: number;
}
@IonicPage()
@Component({
  selector: 'page-offline-data',
  templateUrl: 'offline-data.html',
})
export class OfflineDataPage {
  public offlineData:any [] =[];
  public isData:boolean = false;
  public emailJSONData:any = [];
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public storage: Storage,
              public viewCtrl: ViewController,
              private emailComposer: EmailComposer,
              public reap: ReapService,
              public stemAPI: StemApiProvider,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              private file: File) {

  }
  ionViewDidLoad(){
      this.storage.get('offlineSubmission').then((data)=>{
          this.offlineData=data;
          // console.log(data);
          // var test = JSON.stringify(data[0]["Info"])
          //  console.log(test);
          this.emailJSONData = JSON.stringify(data);
          //this.saveAsCsv();
          this.anyData();
      });
  }
  anyData(){
    console.log(this.offlineData);
    try{
        if(this.offlineData==[]||this.offlineData==null||!this.offlineData.length){
          this.isData = false;
          //console.log(this.isData);
        }
        else{
          this.isData = true;
        }
    }catch(e){
        this.reap.presentAlert('Error','Error Grabbing API data, please re-sync in settings','Dismiss')
        this.navCtrl.pop();
      }
  }

  saveAsCsv() {
    var csv: any = this.convertToCSV(JSON.stringify(this.offlineData))
    var fileName: any = "data.csv"
    this.file.writeFile(this.file.tempDirectory,fileName, csv)
      .then(
      _ => {
        alert('Success ;-)')
      }
      )
      .catch(
      err => {
          this.reap.presentToast('Data no workie');
        //    this.file.writeExistingFile(this.file.externalRootDirectory, fileName, csv)
        //   .then(
        //   _ => {
        // alert('Success ;-)')
        //   }
        //   )
        //   .catch(
        //   err => {
        //     alert('Failure')
        //   }
        //   )
      }
      )

  }

  convertToCSV(data) {
    var json = data.wo
    var fields = Object.keys(json[0])
    var replacer = function(key, value) { return value === null ? '' : value }
    var csv = json.map(function(row){
  return fields.map(function(fieldName){
      return JSON.stringify(row[fieldName], replacer)
    }).join(',')
  })
  csv.unshift(fields.join(',')) // add header column

console.log(csv.join('\r\n'))
    // console.log(data)
    //
    // var formCount = data.length
    // console.log(formCount)
    // //Header
    // for (var i = 0; i < formCount; i++) {
    //   var innerData = data[i]["Info"][i]
    //   console.log(innerData);
    //   if(innerData['wo']){

    //   }
    // }

    // //Teams
    // for (var i = 0; i < innerData; i++) {
    //   line = ''
    //   for (var j = 0; j < formCount; j++) {
    //     if (line != '') line += ';'
    //
    //     line += data[j][i]
    //
    //   }
    //   csv += line + '\r\n'
    // }
    // console.log(csv);

    return csv
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
          // if(data[4]['Equipment']!=[]){
          //   for(let i=0;i<data[4]['Equipment'].length;i++){
          //     console.log(data[4]['Equipment'][i]['Name']);
          //     data[4]['Equipment'][i]['Name']= data[4]['Equipment'][i]['Name'].replace(/['"]+/g, '');
          //     console.log(data[4]['Equipment'][i]['Name']);
          //   }
          // }
          API = this.stemAPI.submitSaulsburyForm(data,this.reap.token);

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
      //console.log(data,type,index);
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
