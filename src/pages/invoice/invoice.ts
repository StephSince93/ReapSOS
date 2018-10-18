import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
//import { CapturePage } from '../capture/capture';

@IonicPage()
@Component({
  selector: 'page-invoice',
  templateUrl: 'invoice.html',
})
export class InvoicePage {
  selectedInvoice: any [];
  constructor(public navCtrl: NavController,
              public navParams: NavParams) {
  this.selectedInvoice = Object.keys(navParams.get('Invoice')).map(k => navParams.get('Invoice')[k])
  }

  ionViewDidLoad() {
    console.log(this.selectedInvoice);
  }
  backtoInvoice(){
    //this.navCtrl.popTo(CapturePage);
  }
  takePicture(formID){
    console.log(formID);
      //this.navCtrl.push(CapturePage,{ID:formID});
  }
  requestInvoice(curInv){
    console.log(curInv);
  }
}
