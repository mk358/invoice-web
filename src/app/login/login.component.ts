import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from '../common.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  constructor(private service: CommonService, private formBuilder: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.initForm();
    this.isAlreadyLoggedIn();
  }

  initForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required]]
    })
  }
  isAlreadyLoggedIn(){
    let userData: any = sessionStorage.getItem('userData');
    let token: any = sessionStorage.getItem('token');
    let email: any = sessionStorage.getItem('email');
    if (userData) {
      this.service.userData = this.service.decryptData(userData);
      this.service.token = token;
      this.service.secretKey = email;
      this.router.navigate(['/home'])
    } else {
      this.service.userData = {};
      this.service.secretKey = "";
      this.service.token = "";
      this.router.navigate(['/login'])
    }
  }
  submit() {
    if (this.loginForm.valid) {
      let userData = this.loginForm.value;
      this.service.signIn(userData).subscribe((res: any) => {
        if (res.isSuccess) {
          sessionStorage.setItem('token', res.token);
          sessionStorage.setItem('email', res.data.email);
          this.service.updateUserData(res);
          this.router.navigate(['/home'])
        } else {
          this.service.showAlert('error', res.message || 'Error occured!')
        }
      }, (error: any) => {
        this.service.showAlert('error', error.message || 'Error occured!')
      })
    } else {
      this.service.showAlert("error", "Please fill all required fields!")
    }
  }

}
