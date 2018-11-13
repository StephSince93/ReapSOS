import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/retry';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';

@Injectable()
export class StemApiProvider {
  //api urls will change according to which build is being tested
      private apiloginUrl:string = 'https://v3.stemsoftware.com/api.php?action=Newreaplogin';
      //private apiloginUrl:string = 'http://10.0.0.21/api.php?action=Newreaplogin';
      private apisubmitFormUrl:string = 'https://v3.stemsoftware.com/api.php?action=SaveDevonianform';
      //private apisubmitFormUrl:string = 'http://10.0.0.21/api.php?action=SaveDevonianform';
      private apiGetUrl:string = 'https://v3.stemsoftware.com/api.php?action=GetDevonianData';
      //private apiGetUrl:string = 'http://10.0.0.21/api.php?action=GetDevonianData';
      //private getMd5Check:string = 'https://sandbox.stemsoftware.com/api.php?action=GetMd5Check';
      //private getMd5Check:string = 'http://10.0.0.140/api.php?action=GetMd5Check';
      private apiUpdateGPSUrl:string = 'https://v3.stemsoftware.com/api.php?action=DevonianGPSUpdate';
      //private apiUpdateGPSUrl:string = 'http://10.0.0.21/api.php?action=DevonianGPSUpdate';
  constructor(public http: HttpClient) {
    //console.log('Hello RestProvider Provider');
  }


//POST login info
 validateUser(data) {
   //console.log(data.userName,data.passWord)
   return this.http.post(this.apiloginUrl, data, {responseType: 'text'})
   .retry(3).timeout(15000).delay(2000);// This will retry 3 times in case there's an error
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
  .retry(3).timeout(20000).delay(2000);// This will retry 3 times in case there's an error

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
  .retry(3).timeout(15000).delay(2000);// This will retry 3 times in case there's an error
      }
}
