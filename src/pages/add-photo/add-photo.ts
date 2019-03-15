import { Component } from '@angular/core';
import {  IonicPage, NavController, NavParams,ToastController, LoadingController } from 'ionic-angular';
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
              private reap: ReapService) {
  }

  takePhoto(){
  const options: CameraOptions = {
      quality: 100,//testing picture parameters
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      saveToPhotoAlbum: false,
      correctOrientation: true,
      targetHeight: 900,//testing picture parameters
      targetWidth: 600//testing picture parameters
  }
  this.camera.getPicture(options).then((imageData) => {
  // imageData is either a base64 encoded string or a file URI
  // If it's base64:
  //this.imageURI = 'data:image/jpeg;base64,' + imageData;
  this.imageURI = normalizeURL(imageData);
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
