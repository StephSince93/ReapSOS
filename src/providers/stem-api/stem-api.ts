import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/retry';


@Injectable()
export class StemApiProvider {
  //api urls will change according to which build is being tested
      private apiloginUrl:string = 'https://sandbox.stemsoftware.com/api.php?action=Newreaplogin';
      //private apiloginUrl:string = 'http://10.0.0.140/api.php?action=Newreaplogin';
      private apisubmitSafteyUrl:string = 'https://sandbox.stemsoftware.com/api.php?action=SaveASIsafetyform';
      //private apisubmitSafteyUrl:string = 'http://10.0.0.140/api.php?action=SaveASIsafetyform';
      private apiGetUrl:string = 'https://sandbox.stemsoftware.com/api.php?action=GetASIData';
      private apiGetDemoUrl:string = 'https://sandbox.stemsoftware.com/api.php?action=GetDemoInvoiceData';
      //private apiGetUrl:string = 'http://10.0.0.140/api.php?action=GetASIData';
      private getMd5Check:string = 'https://sandbox.stemsoftware.com/api.php?action=GetMd5Check';
      //private getMd5Check:string = 'http://10.0.0.140/api.php?action=GetMd5Check';
      private apiUpdateGPSUrl:string = 'https://sandbox.stemsoftware.com/api.php?action=ASIGPSUpdate';
      //private apiUpdateGPSUrl:string = 'https://sandbox.stemsoftware.com/api.php?action=ASIGPSUpdate';
      //private apiUpdateGPSUrl:string = 'https://v3.stemsoftware.com/api.php?action=ASIGPSUpdate';
  constructor(public http: HttpClient) {
    //console.log('Hello RestProvider Provider');
  }


//POST login info
 validateUser(data) {
 //console.log(data.userName,data.passWord)
   return this.http.post(this.apiloginUrl, data, {responseType: 'text'}).retry(3);
 }
 //POST form submitBOL
  submitSafetyForm(data,authToken){
    //console.log(data,authToken);
    const httpOptions = {
        headers: new HttpHeaders({
            'Accept': 'application/json, text/plain',
            'Content-Type':  'application/json',
            'Authorization': authToken
          })
 };
  return this.http.post(this.apisubmitSafteyUrl, JSON.stringify(data), httpOptions||{reportProgress:true})
  .retry(3); // This will retry 3 times in case there's an error

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
   return this.http.get(this.apiGetUrl, httpOptions).retry(3);
 }
 //GET DemoInvoice
getDemoInvoiceData(authToken){

    const httpOptions = {
        headers: new HttpHeaders({
            'Accept': 'application/json, text/plain',
            'Content-Type':  'application/json',
            'Authorization': authToken
          })
 };
 //console.log(authToken);
 return this.http.get(this.apiGetDemoUrl,{responseType: 'text'}).retry(3);
}
 getMD5Check(authToken,checkMD5){
   const httpOptions = {
       headers: new HttpHeaders({
           'Accept': 'application/json, text/plain',
           'Content-Type':  'application/json',
           'Authorization': authToken
         })
      };
  return this.http.post(this.getMd5Check,{'md5':checkMD5}, httpOptions).retry(3);
       }
  updateGPSLoc(data,authToken){
          const httpOptions = {
              headers: new HttpHeaders({
                  'Accept': 'application/json, text/plain',
                  'Content-Type':  'application/json',
                  'Authorization': authToken
                })
       };

           //console.log(data,authToken);
  return  this.http.post(this.apiUpdateGPSUrl, JSON.stringify(data), httpOptions).retry(3);
      }
}
