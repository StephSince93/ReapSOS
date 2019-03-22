import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController,AlertController,ModalController } from 'ionic-angular';
import { StemApiProvider } from '../../providers/stem-api/stem-api';
import { NgForm } from '@angular/forms';
import { Storage } from '@ionic/storage';

import { ReapService } from '../../services/reap-service';
import { MenuPage } from '../menu/menu';
import { TermsOfServicePage } from '../terms-of-service/terms-of-service';
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
    res:any = {};
    didAcceptTOS:boolean = false;
    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public stemAPI: StemApiProvider,
                private loadingCtrl: LoadingController,
                private alertCtrl: AlertController,
                private storage: Storage,
                private modalCtrl: ModalController,
                public reap: ReapService) {
                  /* Verifies if the user is authenticated */
                //console.log(this.storage.get('authToken'));
                this.storage.get('authToken').then((data)=>{
                  if(data!=null){
                    this.navCtrl.push(MenuPage);
                  }
                });
              }

    onSubmit(form: NgForm){
            const loading = this.loadingCtrl.create({
              content: 'Signing in...'
    });
    loading.present();
    //console.log(form.value);
    // API POST authentication
    this.stemAPI.validateUser(form.value).subscribe((result) =>{
    form.reset();//clears values of the form after data is saved to array
    this.res = JSON.parse(result.toString());//converts result to array
    //console.log(this.res);
    if(this.res.token!=""){//sets authtoken to local storage
      this.storage.set('authToken',this.res.token)
      }
    if(this.res.fullName!=""){//sets groupName directed to GET data
      this.storage.set('fullName',this.res.fullName)
    }
    if(this.res.userName!=""){//sets groupName directed to GET data
      this.storage.set('userName',this.res.userName)
    }
    if(this.res.groupName!=""){//sets groupName directed to GET data
      this.storage.set('groupName',this.res.groupName)
    }
    else{
      this.storage.set('groupName',"")
    }
      //console.log(localStorage);
      if(this.res.status == true){
        setTimeout(() => {
          this.reap.initialLogin = true;//Initial Login Variable
            this.navCtrl.push(MenuPage);
            loading.dismiss();
          }, 1000);
      }
        else{
            loading.dismiss();
            const alert = this.alertCtrl.create({
            title: this.res.msg,
            buttons: ['Dismiss']
            });
        alert.present();
            }
      //console.log(result.toString());
            }, (err) => {
            loading.dismiss();
            const alert = this.alertCtrl.create({
              title: err.msg,
              buttons: ['Dismiss']
            });
            alert.present();
            //console.log(err);
      });
    }
    viewTOS(){
      const modal = this.modalCtrl.create(TermsOfServicePage);
      modal.present();
    }
  }
