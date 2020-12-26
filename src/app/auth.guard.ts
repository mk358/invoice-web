import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
  constructor(private service: CommonService, private router: Router){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.isAlreadyLoggedIn();
  }
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.isAlreadyLoggedIn();
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.isAlreadyLoggedIn();
  }
  isAlreadyLoggedIn(){
    let userData: any = sessionStorage.getItem('userData');
    let token: any = sessionStorage.getItem('token');
    let email: any = sessionStorage.getItem('email');
    if (userData) {
      this.service.token = token;
      this.service.secretKey = email;
      this.service.userData = this.service.decryptData(userData);
      return true;
    } else {
      this.service.userData = {};
      this.service.secretKey = "";
      this.service.token = "";
      this.service.showAlert("warning", "Unauthorized to access");
      this.router.navigate(['/login']);
      return false;
    }
  }
}
