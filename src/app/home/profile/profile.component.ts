import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/common.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {

  isProfile: boolean = true;
  profileForm: FormGroup;
  userEmail: any = "";
  userID: any = "";
  userValue: any;
  forgotForm: FormGroup;
  isSubmitted: Boolean = false;
  userNo: any;

  constructor(private service: CommonService, private router: Router, private formBuilder: FormBuilder ) { }

  ngOnInit(): void {
    this.userEmail = this.service.userData.email;
    this.userID = this.service.userData.userNo;
    this.userValue = this.service.userChange.subscribe((value: any) => {
      this.userEmail = value.email;
      this.userID = value.userNo;
    })
    this.initForm();
    this.getUserDetails();
  }
  ngOnDestroy(): void {
    this.userValue.unsubscribe();
  }
  getUserDetails(){
    if (this.userID) {
      this.service.getUsersByID(this.userID).subscribe((res: any) => {
        if (res.isSuccess) {
          this.initForm(res.data);
          this.service.updateUserData(res);
        }
      })
    }
  }
  initForm(obj?: any){
    this.profileForm = this.formBuilder.group({
      firstName: [obj ? obj.firstName : '', [Validators.required]],
      lastName: [obj ? obj.lastName : '', [Validators.required]],
      email: [{value: obj ? obj.email : this.userEmail, disabled: true}, [Validators.required]],
      addressLine: [obj ? obj.addressLine : '', [Validators.required]],
      contactNumber: [obj ? obj.contactNumber : '', [Validators.required]],
      contactNumber2: [obj ? obj.contactNumber2 : ''],
      companyName: [obj ? obj.companyName : '', [Validators.required]],
      GSTIN: [obj ? obj.GSTIN : '', [Validators.required]],
      websiteURL: [obj ? obj.websiteURL : ''],
      userImg: [obj ? obj.userImg : '', [Validators.required]],
      logoImg: [obj ? obj.logoImg : '', [Validators.required]],
      signature: [obj ? obj.signature : ''],
    })
    this.forgotForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      newPassword: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
    });
  }
  fileProcess(event, from) {
    // console.log(event, from)
    var file = event.target.files[0];
    var reader = new FileReader();
    reader.onloadend = () => {
      // console.log('RESULT', reader.result)
      let obj: any = {};
      obj[from] = reader.result;
      this.profileForm.patchValue(obj);
    }
    reader.readAsDataURL(file);
  }

  getErrorClass(field: any) {
    return (this.profileForm['controls'][field].touched && this.profileForm['controls'][field].errors)
  }
  getFieldValue(field: any) {
    return this.profileForm['controls'][field].value;
  }

  submit() {
    if (this.profileForm.valid){
      let userData: any = this.profileForm.value;
      console.log(userData);
      this.service.updateUsersByID(this.userID, userData).subscribe((res: any) => {
        if (res.isSuccess){
          this.service.showAlert('success', 'Profile Data updated successfully!');
          this.service.updateUserData(res);
        }
      })//*/
    } else {
      this.profileForm.markAllAsTouched();
      this.service.showAlert('error', 'Please fill all required fields!');
    }
  }
  validateEmail(){
    let userEmail: any = this.forgotForm.value.email;
    this.service.getUsersByEmail(userEmail).subscribe((res: any) => {
      if (res.isSuccess) {
        this.isSubmitted = true;
        this.userNo = res.data && res.data.userId;
        sessionStorage.setItem('token', res.token);
      }
    })
  }
  submitFP() {
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
        }
      })
    } else if (formValue.newPassword === formValue.confirmPassword) {
      this.service.showAlert('warning', 'New password and confirm passward should match!')
    }
  }

}
