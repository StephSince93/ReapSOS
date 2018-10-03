import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs/Observable';
// import { interval } from 'rxjs/observable/interval';
// import { of } from 'rxjs/observable/of';
// import { _throw } from 'rxjs/observable/throw';
// import { mergeMap, retry } from 'rxjs/operators';
import {  retry } from 'rxjs/operators';


@Injectable()
export class StemApiProvider {
  //api urls will change according to which build is being tested
      private apiloginUrl:string = 'https://sandbox.stemsoftware.com/api.php?action=Newreaplogin';
      //private apiloginUrl:string = 'http://10.0.0.140/api.php?action=Newreaplogin';
      private apisubmitSafteyUrl:string = 'https://sandbox.stemsoftware.com/api.php?action=SaveASIsafetyform';
      //private apisubmitSafteyUrl:string = 'http://10.0.0.140/api.php?action=SaveASIsafetyform';
      private apiGetUrl:string = 'https://sandbox.stemsoftware.com/api.php?action=GetASIData';
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
 return new Promise((resolve, reject) => {
   this.http.post(this.apiloginUrl, data, {responseType: 'text'})
     .subscribe(res => {
       resolve(res);
     }, (err) => {
       console.log(err);
       retry(2);
       reject(err);
     })
  });
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
  return new Promise((resolve, reject) => {
    this.http.post(this.apisubmitSafteyUrl, JSON.stringify(data), httpOptions||{reportProgress:true})
    .subscribe(res=>  {

      resolve(res);
    }, (err) => {
      console.log(err);
      retry(2);
      console.log(retry(2));
      reject(err);
    });
  });
 }
   //GET BOLdata details
 getData(authToken){

      const httpOptions = {
          headers: new HttpHeaders({
              'Accept': 'application/json, text/plain',
              'Content-Type':  'application/json',
              'Authorization': authToken
            })
   };
   //console.log(authToken);
   return new Promise((resolve, reject) => {
     this.http.get(this.apiGetUrl, httpOptions)
     .subscribe(res=>  {
       resolve(res);
     }, (err) => {
       console.log(err);
       //retry(2);
       reject(err);
     });
   });
 }
 getMD5Check(authToken,checkMD5){
   const httpOptions = {
       headers: new HttpHeaders({
           'Accept': 'application/json, text/plain',
           'Content-Type':  'application/json',
           'Authorization': authToken
         })
      };
         return new Promise((resolve, reject) => {
           this.http.post(this.getMd5Check,{'md5':checkMD5}, httpOptions)
           .subscribe(res=>  {
             resolve(res);
           }, (err) => {
             console.log(err);
             retry(2);
             reject(err);
           });
         });
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
           return new Promise((resolve, reject) => {
             this.http.post(this.apiUpdateGPSUrl, JSON.stringify(data), httpOptions)
             .subscribe(res=>  {
               resolve(res);
             }, (err) => {
               reject(err);
             });
           });
      }
}
