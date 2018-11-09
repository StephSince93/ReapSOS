import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, AlertController, LoadingController } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { SelectSearchableComponent } from 'ionic-select-searchable';
import { Geolocation } from '@ionic-native/geolocation';
import { Storage } from '@ionic/storage';

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
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public geolocation: Geolocation,
              public platform: Platform,
              public reap: ReapService,
              public alertCtrl: AlertController,
              public stemAPI: StemApiProvider,
              public loadingCtrl: LoadingController,
              public storage: Storage) {
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
            // console.log(this.lon);
            // console.log(this.lat);
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
             //console.log(this.newGPSLoc);

            loading.present();

            this.stemAPI.updateGPSLoc(this.newGPSLoc,this.reap.token).subscribe((result) =>{

              //console.log(this.res);
              setTimeout(() => {
                              loading.dismiss();
                            }, 2000);
                              setTimeout(() => {

                                //this.storage.set('globalBolChemicals',this.reap.bolGlobalChemicals);// Sets local storage for chemicals user submits to BOL for future use until they confirm BOL
                                this.navCtrl.push(SuccessPage,{'Success':result['MSG']});//goes to success page
                             }, 2000);
            }, (err) => {
              //converts result to JSON response
              setTimeout(() => {
                  loading.dismiss();
              }, 2000);
            let alert = this.alertCtrl.create({
                  title: 'Error Submitting, ',
                  message: 'Try submitting again, or Sumbit offline.',
                  buttons: [
                           {
                             text: 'Try Submitting Again',
                              role: 'Yes',
                             handler: () => {
                                // this.submitClicked=false;//enables the submission button to resubmit
                                // this.submitData = [];//resets Submission so data isnt inserted twice
                             }
                           },
                           {
                         text: 'Submit Offline and Sync later',
                          role: 'Yes',
                         handler: () => {
                            /* allows user to submit offline and saves form data into a form variable
                            no data will be submitted until interenet connection is made via a sync or observable call */
                            /****** TESTING    *********************/
                            this.reap.formStart = null;
                            this.reap.offlineFormSubmissions.push({"Type":"GPS","Info":this.newGPSLoc,"Status":"Pending"});
                            this.storage.set('offlineSubmission',this.reap.offlineFormSubmissions);
                            this.newGPSLoc = [];

                            this.navCtrl.push(SuccessPage,{'Success':'Please go to support page and manually submit current form before submitting any new forms!'});
                         }
                       }
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
