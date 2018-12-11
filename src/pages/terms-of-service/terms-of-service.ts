import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-terms-of-service',
  templateUrl: 'terms-of-service.html',
})
export class TermsOfServicePage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl:ViewController) {

  }

  ionViewDidLoad() {

  }
  dismissModal() {
    this.viewCtrl.dismiss();
  }
}
