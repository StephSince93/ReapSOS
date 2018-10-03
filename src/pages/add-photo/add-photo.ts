import { Component } from '@angular/core';
import {  IonicPage, NavController, NavParams,ToastController, LoadingController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';

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
      quality: 50,//testing picture parameters
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      saveToPhotoAlbum: true,
      correctOrientation: true,
      targetHeight: 100,//testing picture parameters
      targetWidth: 100//testing picture parameters
  }
  this.camera.getPicture(options).then((imageData) => {
  // imageData is either a base64 encoded string or a file URI
  // If it's base64:
  this.imageURI = 'data:image/jpeg;base64,' + imageData;
  }, (err) => {
  // Handle error
  console.log(err);
  this.presentToast(err);
  });
}

// getPhoto(){
// const options: CameraOptions = {
//     quality: 70,
//     encodingType: this.camera.EncodingType.JPEG,
//     mediaType: this.camera.MediaType.PICTURE,
//     destinationType: this.camera.DestinationType.DATA_URL,
//     sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
//     saveToPhotoAlbum: false,
//     correctOrientation: true
//     }
//   this.camera.getPicture(options).then((imageData) => {
//     // imageData is either a base64 encoded string or a file URI
//     // If it's base64:
//   this.imageURI = 'data:image/jpeg;base64,' + imageData;
//         }, (err) => {
//           console.log(err);
//           this.presentToast(err);
//         });
//     }

// cropPhoto(){
//   const options: CameraOptions = {
//       quality: 70,
//       encodingType: this.camera.EncodingType.JPEG,
//       mediaType: this.camera.MediaType.PICTURE,
//       destinationType: this.camera.DestinationType.DATA_URL,
//       sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
//       saveToPhotoAlbum: false,
//       allowEdit: true,
//       correctOrientation: true
//       }
//     this.camera.getPicture(options).then((imageData) => {
//        // imageData is either a base64 encoded string or a file URI
//        // If it's base64:
//       this.imageURI = 'data:image/jpeg;base64,' + imageData;
//           }, (err) => {
//             console.log(err);
//             this.presentToast(err);
//       });
//   }

uploadPhoto(){

  this.reap.totalPhotos(this.imageURI);
  this.navCtrl.pop();
//   let loader = this.loadingCtrl.create({
//     content: "Uploading..."
//   });
//   loader.present();
//       //create file transfer object
//       const fileTransfer: FileTransferObject = this.transfer.create();
//
//   let options: FileUploadOptions = {
//     fileKey: 'uploaded_file',
//     fileName: 'upload.jpg',
//     httpMethod: 'POST',
//     chunkedMode: false,
//     mimeType: "image/jpeg",
//     params:{'uploaded_file': this.imageURI,ID:this.formID},
//     headers: {Authorization: "Authorization"}
//   }
//
// fileTransfer.upload(this.imageURI,'http://10.0.0.140/api.php?action=ReceiveDemoInvoicePics',options,true)
//   .then(data => {
//     //console.log(data.response);
//     //console.log(res+" Uploaded Successfully");
//     loader.dismiss();
//     this.presentToast("Image uploaded successfully");
//     this.navCtrl.popTo( this.navCtrl.getByIndex(1));
//   }, (err) => {
//     loader.dismiss();
//     this.presentToast(err);
//   });
    }
  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom',
      dismissOnPageChange: false,
      cssClass: 'customToast'
    });

    toast.onDidDismiss(() => {
      //console.log('Dismissed toast');
    });

    toast.present();
    }
}
