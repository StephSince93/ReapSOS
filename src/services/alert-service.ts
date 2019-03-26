import { AlertController, NavController } from "ionic-angular";
import { Injectable } from '@angular/core';


@Injectable()
export abstract class AlertService {

  constructor(public alertCtrl: AlertController, public navCtrl: NavController) {

  }

  //Alert w/ two buttons
  protected presentAlert2(title:any,subTitle:any,button:any,button2:any){
    var cancel;
    var alert = this.alertCtrl.create({
         title: title,
        subTitle: subTitle,
         buttons: [
          {
            text: button,
            handler: (value) => {
              cancel = true;
              console.log(value)
              return value;
            }
          },
          {
            text: button2,
            role: button2,
            handler: () => {
              cancel = false;
              console.log(cancel)
            }
          }

         ]
       });
     return alert.present();

  }
}
