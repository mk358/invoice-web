import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from '../common.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  forgotForm: FormGroup;
  isSubmitted: Boolean = false;
  userNo: any;
  constructor(private service: CommonService, private router: Router, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.initForm();
  }
  initForm(){
    this.forgotForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      newPassword: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
    });
  }
  validateEmail(){
    let userEmail: any = this.forgotForm.value.email;
    this.service.getUsersByEmail(userEmail).subscribe((res: any) => {
      if (res.isSuccess) {
        this.isSubmitted = true;
        this.userNo = res.data && res.data.userId;
        sessionStorage.setItem('token', res.token);
      } else {
        this.service.showAlert('error', res.message || 'Error occured!')
      }
    }, (error: any) => {
      this.service.showAlert('error', error.message || 'Error occured!')
    })
  }
  submit() {
    let formValue: any = this.forgotForm.value;
    if (this.isSubmitted && formValue.newPassword === formValue.confirmPassword) {
      let obj: any = {
        userNo: this.userNo,
        newPassword: formValue.newPassword
      }
      this.service.updateUserPassword(obj).subscribe((res: any) => {
        if (res.isSuccess) {
          this.service.showAlert('success', 'Password updated successfully! Login again to use the application.');
          this.router.navigate(['/login']);
          sessionStorage.clear();
        } else {
          this.service.showAlert('error', res.message || 'Error occured!')
        }
      }, (error: any) => {
        this.service.showAlert('error', error.message || 'Error occured!')
      })
    } else if (formValue.newPassword === formValue.confirmPassword) {
      this.service.showAlert('warning', 'New password and confirm passward should match!')
    }
  }
}
