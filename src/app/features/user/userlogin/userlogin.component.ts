import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import {
  GoogleSigninButtonModule,
  SocialUser,
} from '@abacritt/angularx-social-login';
import { AuthGoogleService } from '../../../shared/services/googleauth.service';

@Component({
  selector: 'app-userlogin',
  imports: [
    CommonModule,
    HeaderComponent,
    ReactiveFormsModule,
    ButtonModule,
    FormsModule,
    GoogleSigninButtonModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatCardModule,
  ],
  templateUrl: './userlogin.component.html',
  styleUrl: './userlogin.component.css',
})
export class UserloginComponent implements OnInit {
  loginForm!: FormGroup;
  auth!: string;

  user: SocialUser | null = null;
  private gauthService = inject(AuthGoogleService);

  constructor(
    private formbuilder: FormBuilder,
    private router: Router,
    private store: Store,
    private commonService: CommonService
  ) {}

  ngOnInit() {
    this.user_login();
    this.auth = this.commonService.getAuthFromLocalStorage();
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
      this.router.navigate(['/user/verifyEmail']);
    } else if (this.commonService.getAuthFromLocalStorage() === 'expert') {
      this.router.navigate(['/expert/verifyEmail']);
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

      return;
    } else {
      const data = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password,
      };

      if (this.auth === 'expert') {
        this.store.dispatch(loginExpert({ data }));
      } else if (this.auth === 'user') {
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

  signInWithGoogle() {
    this.gauthService.login();
  }
}
