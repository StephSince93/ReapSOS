import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/retry';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';

@Injectable()
export class StemApiProvider {
      private v3URL:string = 'https://v3.stemsoftware.com/api.php?action=';
      //private sandboxURL:string = 'https://sandbox.stemsoftware.com/api.php?action=';
      private DanielsDevURL:string = 'http://10.0.0.21/api.php?action=';


  //api urls will change according to which build is being tested
      //private apiloginUrl:string = this.v3URL+'Newreaplogin';
      private apiloginUrl:string = this.DanielsDevURL+'Newreaplogin';
      //private apisubmitFormUrl:string = this.v3URL+'SaveDevonianform';
      private apisubmitFormUrl:string = this.DanielsDevURL+'SaveDevonianform';
      //private apiGetUrl:string = this.v3URL+'GetDevonianData';
      private apiGetUrl:string = this.DanielsDevURL+'GetDevonianData';
      //private apiUpdateGPSUrl:string = this.v3URL+'DevonianGPSUpdate';
      private apiUpdateGPSUrl:string = this.DanielsDevURL+'DevonianGPSUpdate';
      //private apiUpdateSigUrl:string = this.v3URL+'DevonianSigUpdate';
      private apiUpdateSigUrl:string = this.DanielsDevURL+'DevonianSigUpdate';
  constructor(public http: HttpClient) {
    //console.log('Hello RestProvider Provider');
  }


//POST login info
 validateUser(data) {
   //console.log(data.userName,data.passWord)
   return this.http.post(this.apiloginUrl, data, {responseType: 'text'})
   .retry(3).timeout(15000)// This will retry 3 times in case there's an error
 }
 //POST form submitBOL
  submitDevonianForm(data,authToken){
    //console.log(data,authToken);
    const httpOptions = {
        headers: new HttpHeaders({
            'Accept': 'application/json, text/plain',
            'Content-Type':  'application/json',
            'Authorization': authToken
          })
 };
  return this.http.post(this.apisubmitFormUrl, JSON.stringify(data), httpOptions||{reportProgress:true})
  .retry(3).timeout(20000)// This will retry 3 times in case there's an error

  }

   //GET Data
 getData(authToken){
      const httpOptions = {
          headers: new HttpHeaders({
              'Accept': 'application/json, text/plain',
              'Content-Type':  'application/json',
              'Authorization': authToken
            })
   };
   //console.log(authToken);
   return this.http.get(this.apiGetUrl, httpOptions)
   .retry(3).timeout(15000)// This will retry 3 times in case there's an error
 }

 // getMD5Check(authToken,checkMD5){
 //   const httpOptions = {
 //       headers: new HttpHeaders({
 //           'Accept': 'application/json, text/plain',
 //           'Content-Type':  'application/json',
 //           'Authorization': authToken
 //         })
 //      };
 //  return this.http.post(this.getMd5Check,{'md5':checkMD5}, httpOptions)
 //  .retry(3).timeout(15000).delay(2000);// This will retry 3 times in case there's an error
 //       }

  updateGPSLoc(data,authToken){
          const httpOptions = {
              headers: new HttpHeaders({
                  'Accept': 'application/json, text/plain',
                  'Content-Type':  'application/json',
                  'Authorization': authToken
                })
       };

           //console.log(data,authToken);
  return  this.http.post(this.apiUpdateGPSUrl, JSON.stringify(data), httpOptions)
  .retry(3).timeout(15000)// This will retry 3 times in case there's an error
  }


  updateSig(data,authToken){
          const httpOptions = {
              headers: new HttpHeaders({
                  'Accept': 'application/json, text/plain',
                  'Content-Type':  'application/json',
                  'Authorization': authToken
                })
       };

           //console.log(data,authToken);
  return  this.http.post(this.apiUpdateSigUrl, JSON.stringify(data), httpOptions)
  .retry(3).timeout(15000)// This will retry 3 times in case there's an error
      }
}
