import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, AlertController, LoadingController } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { SelectSearchableComponent } from 'ionic-select-searchable';
import { Geolocation } from '@ionic-native/geolocation';

import { SuccessPage } from '../success/success';
import { ReapService } from '../../services/reap-service';
import { StemApiProvider } from '../../providers/stem-api/stem-api';

class Location {
  public ID: number;
  public Location: string;
  public Lan: number;
  public Lon: number;
}

@IonicPage()
@Component({
  selector: 'page-well-locations',
  templateUrl: 'well-locations.html',
})
export class WellLocationsPage {
  locationsArray: Location[];
  location: Location;
  private lon:any;
  private lat:any;
  private newGPSLoc:any [] = [];
  res:any = {};//API submission response
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public geolocation: Geolocation,
              public platform: Platform,
              public reap: ReapService,
              public alertCtrl: AlertController,
              public stemAPI: StemApiProvider,
              public loadingCtrl: LoadingController) {
              this.locationsArray = this.reap.getLocations;
  }
  ionViewDidLoad() {
      //console.log(this.personnel);

      /* Ensure the platform is ready */
  this.platform.ready().then(() => {
      /* Perform initial geolocation */
      this.geolocation.getCurrentPosition().then((resp) => {
          this.lat = resp.coords.latitude.toFixed(8);
          this.lon = resp.coords.longitude.toFixed(8);
          //console.log(this.lonlat);
        }).catch((error) => {
          console.log('Error getting location', error);
        });
      });
    }
    locationChange(event: { component: SelectSearchableComponent, value: any }) {
      // console.log('value:', event.value);
      // console.log(event.component);
      // console.log(event.value['Lat']);
      //this.wellLocation=(event.value['Lat'],event.value['Lon']);
  }
  updateLocation(){
    this.platform.ready().then(() => {
        /* Perform initial geolocation */
        this.geolocation.getCurrentPosition().then((resp) => {
            this.lat = resp.coords.latitude.toFixed(8);
            this.lon = resp.coords.longitude.toFixed(8);
            console.log(this.lon);
            console.log(this.lat);
          }).catch((error) => {
            console.log('Error getting location', error);
          });
        });
  }
  submitAssetLoc(form: NgForm){
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
             this.newGPSLoc.push({'ID':form.value["Location"]["ID"]},{'Lat':form.value["Lat"]},{'Lon':form.value["Lon"]});
             console.log(this.newGPSLoc);

            loading.present();

            this.stemAPI.updateGPSLoc(this.newGPSLoc,this.reap.token).then((result) =>{

              //converts result to JSON response
              this.res = JSON.stringify(result);
              this.res = JSON.parse(this.res);
              console.log(this.res);
              setTimeout(() => {
                              loading.dismiss();
                            }, 2000);
                              setTimeout(() => {

                                //this.storage.set('globalBolChemicals',this.reap.bolGlobalChemicals);// Sets local storage for chemicals user submits to BOL for future use until they confirm BOL
                                this.navCtrl.push(SuccessPage,{'success':this.res.MSG});//goes to success page
                             }, 2000);
            }, (err) => {
              //converts result to JSON response
              setTimeout(() => {
                  loading.dismiss();
              }, 2000);
            let alert = this.alertCtrl.create({
                  title: 'Error Submitting, ',
                  message: 'Try submitting again, If issues persists contact stem support.',
                  buttons: [
                           {
                             text: 'Acknowledged',
                              role: 'Yes',
                             handler: () => {
                                //resets data saved in array when API call fails to prevent double submission
                                this.newGPSLoc = [];
                             }
                           }
                           // ,
                           // {
                           //   text: 'Cancel',
                           //    role: 'Cancel',
                           //   handler: () => {
                           //
                           //   }
                           // }
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
