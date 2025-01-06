import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../../shared/header/header.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../../shared/services/common.service';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { passwordPattern } from '../../../shared/regexp/regexp';
import { loginUser } from '../../../core/store/user/user.actions';
import { loginExpert } from '../../../core/store/expert/expert.actions';
import { ButtonModule } from 'primeng/button';

import { SocialAuthService, GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
@Component({
  selector: 'app-userlogin',
  imports: [

    CommonModule,
    HeaderComponent,
    ReactiveFormsModule,
    ButtonModule,
    FormsModule,
    GoogleSigninButtonModule
  ],
  templateUrl: './userlogin.component.html',
  styleUrl: './userlogin.component.css',
  
})
export class UserloginComponent implements OnInit {
  loginForm!: FormGroup;
  auth!: string;

  constructor(
    private formbuilder: FormBuilder,
    private router: Router,
    private store: Store,
    private commonService: CommonService,
    private authService:SocialAuthService
  ) {}

  ngOnInit() {
    this.user_login();
    this.auth = this.commonService.getAuthFromLocalStorage();
    this.authService.authState.subscribe((user) => {
      console.log(user)
      //perform further logics
    });
  }

  user_login() {
    this.loginForm = this.formbuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [Validators.required, Validators.pattern(passwordPattern)],
      ],
    });
  }

  forgetPassword() {
    if (this.commonService.getAuthFromLocalStorage() === 'user') {
      this.router.navigate(['/user/verify_email']);
    } else if (this.commonService.getAuthFromLocalStorage() === 'expert') {
      this.router.navigate(['/expert/verify_email']);
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
    if (this.loginForm.invalid) {
      this.markFormGroupTouched(this.loginForm);
      console.log('Form is invalid:', this.loginForm.value);
      return;
    } else {
      const data = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password,
      };
      console.log('Form submitted data:', data);
      console.log('auth:',this.auth)
      if (this.auth === 'expert') {
        this.store.dispatch(loginExpert({ data }));
        console.log('Dispatching loginExpert action');
      } else if (this.auth === 'user') {
        console.log('Form data:', this.loginForm.value); 
        this.store.dispatch(loginUser({ data }));
      }
    }
  }

  user_registeration() {
    if (this.auth === 'expert') {
      this.router.navigate(['/expert/expertRegister']);
    } else if (this.auth === 'user') {
      this.router.navigate(['/user/userRegister']);
    }
  }
}
