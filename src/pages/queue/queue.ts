import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, NavParams } from 'ionic-angular';

import { InvoicePage } from '../invoice/invoice';
import { StemApiProvider } from '../../providers/stem-api/stem-api';
import { ReapService } from '../../services/reap-service';
import { SafePipe } from '../../pipes/safe/safe';
@IonicPage()
@Component({
  selector: 'page-queue',
  templateUrl: 'queue.html',
  providers: [SafePipe]
})
export class QueuePage {
  private isEmpty:boolean = true;
  private token:any = "JNiVVYMfwlpPrduBuzykRpH0LwUKyCOuaXRngqtREzI=";
  private queueData:any = {};
  private finalData:any [];
  private searchData:any;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public safePipe: SafePipe,
              public reap: ReapService,
              private stemAPI: StemApiProvider,
              private loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    //try block for data coming in from api
  try{
  // API POST authentication

  this.stemAPI.getDemoInvoiceData(this.token).subscribe((result) =>{
    //console.log(result);
    //console.log(result.toString().replace(/\s/g,''));
    this.queueData = result.toString().replace(/\s/g,'');
    this.finalData = JSON.parse(this.queueData);

    if(this.finalData['data']){
      console.log(this.finalData['data'])
        this.isEmpty = true;
        console.log('empty data');
      console.log(this.finalData);

  }else{
    //console.log('not empty data');
    this.isEmpty = false;
    for(var i =0;i<this.finalData.length-1;i++){
    this.safePipe.transform(this.finalData[i]['Color']);
    //console.log(this.finalData[i]['Color']);
      }
    }
    //console.log(this.finalData);
      this.initializeItems();
          }, (err) => {
        console.log(err);
        });
    //catches import of data if the queue is empty
    } catch(e){
    //empties array
    this.finalData = [];
    console.log(e);
   }
}
   initializeItems(){
      this.searchData = this.finalData;
    }
    getItems(ev: any) {
      //reloads view
       this.initializeItems();
    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
    //console.log(val);
          this.searchData.filter((data)=>{
            //console.log(data.Company);
            if(!data.Company){console.log('here1'); return false;}else{console.log('here2');
              //console.log(data.Company.toLowerCase().indexOf(val.toLowerCase()) > -1);
                return (data.Company.toLowerCase().indexOf(val.toLowerCase()) > -1);
                }
            });
          }
     }
     itemSelected(i){
       console.log(this.finalData[i]);
       this.navCtrl.push(InvoicePage,{'Invoice':this.finalData[i]});

     }
  doRefresh(refresher){
     //refreshes page and check for new data
     this.ionViewDidLoad();
    setTimeout(() => {

      refresher.complete();
    }, 1000);
  }

}
