import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { urls } from './url.config'

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  public apiURL = environment.apiURL;

  constructor(private http: HttpClient) { }
  
  getHeaderOptions() {
    let loggedUser: any = JSON.parse(sessionStorage.getItem('userDetails'));
    if (!loggedUser) {
      return;
    }
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'authorization': loggedUser.token.accessToken
      })
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
    let headerOptions: any = this.getHeaderOptions();
    return this.http.put(urls.loginURL, JSON.stringify(userObj), headerOptions)
      .pipe(catchError(this.handleError))
  }


}
