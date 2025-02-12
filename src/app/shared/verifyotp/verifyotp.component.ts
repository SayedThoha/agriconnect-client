import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonService } from '../services/common.service';
import { MessageToasterService } from '../services/message-toaster.service';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { ExpertService } from '../services/expert.service';
import { otpPattern } from '../regexp/regexp';
import { HeaderComponent } from '../header/header.component';
import { ButtonModule } from 'primeng/button';
import { AutoUnsubscribe } from '../../core/decorators/auto-usub.decorator';

@AutoUnsubscribe
@Component({
  selector: 'app-verifyotp',
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent, ButtonModule],
  templateUrl: './verifyotp.component.html',
  styleUrl: './verifyotp.component.css',
})
export class VerifyotpComponent implements OnInit {
  timerInterval!: ReturnType<typeof setInterval>;
  counter = 59;
  email!: string;
  
  new_email!: string | null;
  role!: string;
  otpForm!: FormGroup;
  constructor(
    private formbuilder: FormBuilder,
    private commonservice: CommonService,
    private userService: UserService,
    private showMessage: MessageToasterService,
    private router: Router,
    private expertService: ExpertService
  ) {}

  ngOnInit() {
    this.email = this.commonservice.getEmailFromLocalStrorage();
    this.new_email = localStorage.getItem('new_email');
    this.role = this.commonservice.getRoleFromLocalStorage();
    this.counterFn();
    this.otpForm = this.formbuilder.group({
      otp: ['', [Validators.required, Validators.pattern(otpPattern)]],
    });
  }

  counterFn() {
    this.timerInterval = setInterval(() => {
      this.counter--;
      if (this.counter === 0) {
        clearInterval(this.timerInterval);
      }
    }, 1000);
  }

  resendClicked() {
    this.counter = 59;
    this.counterFn();
    if (this.commonservice.getAuthFromLocalStorage() === 'expert') {
      this.expertService.resendOtp({ email: this.email }).subscribe({
        next: (response) => {
          this.showMessage.showSuccessToastr(response.message);
          this.otpForm.reset();
        },
      });
    } else {
      this.userService.resendOtp({ email: this.email }).subscribe({
        next: (response) => {
          this.showMessage.showSuccessToastr(response.message);
          this.otpForm.reset();
        },
      });
    }
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  onSubmit() {
    if (this.otpForm.invalid) {
      this.markFormGroupTouched(this.otpForm);
      return;
    } else {
      let otpdata;
      // console.log(this.role);

      if (this.role === 'user_new_email' || this.role === 'expert_new_email') {
        otpdata = {
          email: this.email,
          new_email: this.new_email,
          otp: this.otpForm.value.otp as string,
          role: this.role,
        };
      } else {
        otpdata = {
          email: this.email,
          otp: this.otpForm.value.otp as string,
        };
      }
      // console.log('otpdata:', otpdata);
      if (this.commonservice.getAuthFromLocalStorage() === 'expert') {
        this.expertService.verifyOtp(otpdata).subscribe({
          next: (response) => {
            if (this.role === 'expertRegistration') {
              //if it is user registration verification
              this.showMessage.showSuccessToastr(response.message);
              this.router.navigate(['/expert/registrationCompleted']);
              localStorage.removeItem('email');
            } else if (this.role === 'userForgetPassword') {
              //if it is password verification
              this.showMessage.showSuccessToastr(response.message);
              this.router.navigate(['/expert/new_password']);
            } else if (
              this.role === 'expertVerification' ||
              this.role === 'expert_new_email'
            ) {
              //if it is userverification or updating new email
              this.showMessage.showSuccessToastr(response.message);
              localStorage.removeItem('expertToken');
              localStorage.removeItem('email');
              localStorage.removeItem('new_email');
              localStorage.removeItem('role');
              this.router.navigate(['/expert/expertLogin']);
            }
          },
          error: (error) => {
            // console.log(error.error.message);
            this.showMessage.showErrorToastr(error.error.message);
          },
        });
       
      } else if (this.commonservice.getAuthFromLocalStorage() === 'user') {
        this.userService.verifyOtp(otpdata).subscribe({
          next: (response) => {
            // console.log('role for otp:', this.role);
            if (this.role === 'userRegistration') {
              //if it is user registration verification
              this.showMessage.showSuccessToastr(response.message);
              this.router.navigate(['/user/registrationCompleted']);
              localStorage.removeItem('email');
            } else if (this.role === 'userForgetPassword') {
              //if it is password verification
              this.showMessage.showSuccessToastr(response.message);
              this.router.navigate(['/user/new_password']);
            } else if (
              this.role === 'userVerification' ||
              this.role === 'user_new_email'
            ) {
              //if it is userverification or updating new email
              this.showMessage.showSuccessToastr(response.message);
              localStorage.removeItem('userToken');
              localStorage.removeItem('email');
              localStorage.removeItem('new_email');
              localStorage.removeItem('role');
              this.router.navigate(['user/login']);
            }
          },
          error: (error) => {
            // console.log(error.error.message)
            this.showMessage.showErrorToastr(error.error.message);
          },
        });
      }
    }
  }
  
}
