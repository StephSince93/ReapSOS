import { Component } from '@angular/core';
import {  IonicPage, NavController, NavParams,ToastController, LoadingController, Platform } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { normalizeURL } from 'ionic-angular';

import { ReapService } from '../../services/reap-service';
@IonicPage()
@Component({
  selector: 'page-add-photo',
  templateUrl: 'add-photo.html',
})
export class AddPhotoPage {
  imageURI:any;
  imageFileName:any;
  formID:any;
  constructor(public navCtrl: NavController,
              public toastCtrl: ToastController,
              public loadingCtrl: LoadingController,
              public navParams: NavParams,
              private camera: Camera,
              private reap: ReapService,
              private platform: Platform) {
  }

  takePhoto(){
  const options: CameraOptions = {
      quality: 75,//testing picture parameters
      //destinationType: this.platform.is('ios') ? this.camera.DestinationType.FILE_URI : this.camera.DestinationType.DATA_URL,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      saveToPhotoAlbum: false,
      correctOrientation: true,
      targetHeight: 1024,//testing picture parameters
      targetWidth: 768//testing picture parameters
  }
  this.camera.getPicture(options).then((imageData) => {
  // imageData is either a base64 encoded string or a file URI
  // If it's base64:

      //get photo from the camera based on platform type
      // if (this.platform.is('ios'))
      // this.imageURI = normalizeURL(imageData);
      // else
      this.imageURI = "data:image/jpeg;base64," + imageData;

  }, (err) => {
  // Handle error
  //console.log(err);
  this.reap.presentToast(err);
  });
}


uploadPhoto(){

  this.reap.totalPhotos(this.imageURI);
  this.navCtrl.pop();

 }
}
