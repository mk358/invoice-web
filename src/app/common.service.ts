import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { urls } from './url.config';
import { ToastrService } from 'ngx-toastr';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  public apiURL = environment.apiURL;
  userData:any = {};
  secretKey: any = "";
  token: any = "";
  userChange: Subject<any> = new Subject<any>();

  constructor(private http: HttpClient, private toastr: ToastrService) { }
  
  getHeaderOptions(noAuth?: boolean) {
    // let loggedUser: any = this.decryptData(sessionStorage.getItem('userData'));
    // if (!loggedUser) {
    //   return;
    // }
    let headerObj: any = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
    if (!noAuth) {
      headerObj['authorization'] = (sessionStorage.getItem('token'));
    }
    return {
      headers: new HttpHeaders(headerObj)
    };
  }

  /* Handle Error */
  public handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(`Backend returned code ${error.status}, ` + `body was: `, error.error);
    }
    return throwError(error.error);
  }

  signIn(userObj): Observable<any> {
    let headerOptions: any = this.getHeaderOptions(true);
    return this.http.post(this.apiURL+urls.loginURL, (userObj), headerOptions)
      .pipe(catchError(this.handleError))
  }

  getUsersList(): Observable<any>{
    let headerOptions: any = this.getHeaderOptions();
    return this.http.get(this.apiURL+urls.getUsers, headerOptions)
      .pipe(catchError(this.handleError))
  }

  getUsersByID(userID: any): Observable<any>{
    let headerOptions: any = this.getHeaderOptions();
    return this.http.get(this.apiURL+urls.getUsers + "/"+ userID, headerOptions)
      .pipe(catchError(this.handleError))
  }

  getUsersByEmail(userEmail: any): Observable<any>{
    let headerOptions: any = this.getHeaderOptions();
    return this.http.post(this.apiURL+urls.getUsers + "/email/"+ userEmail, headerOptions)
      .pipe(catchError(this.handleError))
  }

  updateUserPassword(userData: any) {
    let headerOptions: any = this.getHeaderOptions();
    return this.http.post(this.apiURL+urls.getUsers + "/changePassword", userData, headerOptions)
      .pipe(catchError(this.handleError))
  }

  updateUsersByID(userID: any, userData: any): Observable<any>{
    let headerOptions: any = this.getHeaderOptions();
    return this.http.post(this.apiURL+urls.getUsers + "/"+ userID, userData, headerOptions)
      .pipe(catchError(this.handleError))
  }

  getInvoiceList(): Observable<any>{
    let headerOptions: any = this.getHeaderOptions();
    return this.http.get(this.apiURL+urls.invoice, headerOptions)
      .pipe(catchError(this.handleError))
  }

  getInvoiceByID(invoiceID: any): Observable<any>{
    let headerOptions: any = this.getHeaderOptions();
    return this.http.get(this.apiURL+urls.invoice + "/"+ invoiceID, headerOptions)
      .pipe(catchError(this.handleError))
  }

  updateInvoiceByID(invoiceID: any, invoiceData: any): Observable<any>{
    let headerOptions: any = this.getHeaderOptions();
    return this.http.post(this.apiURL+urls.invoice + "/"+ invoiceID, invoiceData, headerOptions)
      .pipe(catchError(this.handleError))
  }

  createInvoice(invoiceData: any): Observable<any>{
    let headerOptions: any = this.getHeaderOptions();
    return this.http.post(this.apiURL+urls.invoice, invoiceData, headerOptions)
      .pipe(catchError(this.handleError))
  }

  showAlert(type: any, message: any, title?: any) {
    if (type === "success"){
      this.toastr.success(message, (title ? title : 'Success'), {timeOut: 3000});
    } else if (type === "warning"){
      this.toastr.warning(message, (title ? title : 'Warning'), {timeOut: 3000});
    } else if (type === "info"){
      this.toastr.info(message, (title ? title : 'Info'), {timeOut: 3000});
    } else if (type === "error"){
      this.toastr.error(message, (title ? title : 'Error'), {timeOut: 3000});
    }
  }

  updateUserData(res: any) {
    this.secretKey = res.data && res.data.email;
    this.userData = res.data;
    this.token = res.token;
    sessionStorage.setItem('userData', this.encryptData(res.data));
    this.userChange.next(this.userData)
  }

  encryptData(data) {

    try {
      return CryptoJS.AES.encrypt(JSON.stringify(data), this.secretKey).toString();
    } catch (e) {
      console.log(e);
    }
  }

  decryptData(data) {

    try {
      if (data) {
        const bytes = CryptoJS.AES.decrypt(data, this.secretKey);
        if (bytes.toString()) {
          return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        }
        return data;
      }
    } catch (e) {
      console.log(e);
    }
  }

}
