import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../../shared/header/header.component';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../shared/services/user.service';
import { MessageToasterService } from '../../../shared/services/message-toaster.service';
import { namePattern, passwordPattern } from '../../../shared/regexp/regexp';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'app-usersignup',
  imports: [
    HeaderComponent,
    ReactiveFormsModule,
    CommonModule,
    ButtonModule,
    FormsModule,
  ],
  templateUrl: './usersignup.component.html',
  styleUrl: './usersignup.component.css',
})
export class UsersignupComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private showMessage: MessageToasterService
  ) {}

  user_registration_form!: FormGroup;

  title = 'Register your details';

  ngOnInit() {
    this.user_registration();
  }

  close() {
    this.router.navigate(['/user/login']);
  }

  user_registration() {
    this.user_registration_form = this.formBuilder.group({
      firstname: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.pattern(namePattern),
        ],
      ],
      lastname: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.pattern(namePattern),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      // profile_pic:[null,Validators.required],
      password: [
        '',
        [Validators.required, Validators.pattern(passwordPattern)],
      ],
      confirmPassword: ['', Validators.required],
    });
  }

  onsubmit() {
    // console.log('onsubmit entered', this.user_registration_form);
    const password = this.user_registration_form.get('password')?.value;
    if (this.user_registration_form.invalid) {
      if (this.firstnameError()) {
        this.showMessage.showErrorToastr(this.firstnameError());
      }
      if (this.lastnameError()) {
        this.showMessage.showErrorToastr(this.lastnameError());
      }
      if (this.emailError()) {
        this.showMessage.showErrorToastr(this.emailError());
      }
      if (this.passwordError()) {
        this.showMessage.showErrorToastr(this.passwordError());
      }
      if (this.confirm_passwordError()) {
        this.showMessage.showErrorToastr(this.confirm_passwordError());
      }
    } else {
      if (
        password != this.user_registration_form.get('confirmPassword')?.value
      ) {
        this.showMessage.showErrorToastr('Passwords do not match');
        return;
      }
      console.log('form submitted');
      const data = {
        firstName: this.user_registration_form.get('firstname')?.value,
        lastName: this.user_registration_form.get('lastname')?.value,
        email: this.user_registration_form.get('email')?.value,
        password: this.user_registration_form.get('password')?.value,
      };
      this.userService.userRegister(data).subscribe({
        next: (response) => {
          console.log('Server response:', response);
          localStorage.setItem(
            'email',
            this.user_registration_form.get('email')?.value
          );
          localStorage.setItem('role', 'userRegistration');
          this.router.navigate(['/user/verifyOtp']);
          this.showMessage.showSuccessToastr('Registered successfully');
        },
        error: (error) => {
          // const errorMessage = error.error?.message || 'An unknown error occurred';
          // console.log('Error:', error);  // Log the full error to inspect its structure
          this.showMessage.showErrorToastr(error.error.message);
        },
      });
    }
  }

  //email error
  emailError(): string {
    const email = this.user_registration_form.get('email');
    if (email?.errors?.['required']) {
      return 'Email is required';
    } else if (email?.errors?.['email']) {
      return 'Invalid Email';
    }
    return '';
  }

  //password Error

  passwordError(): string {
    const password = this.user_registration_form.get('password');
    if (password?.errors?.['required']) {
      return 'Password is required';
    } else if (password?.errors?.['pattern']) {
      return 'Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one digit, and one special character (?@$!%*).';
    }
    return '';
  }

  //confirm password error
  confirm_passwordError(): string {
    const password = this.user_registration_form.get('confirmPassword');
    if (password?.errors?.['required']) {
      return 'Password is required';
    }
    return '';
  }

  // firstname error handling
  firstnameError(): string {
    const name = this.user_registration_form.get('firstname');

    if (name?.invalid) {
      if (name?.errors?.['required']) {
        return `First Name is required`;
      } else if (name.errors?.['minlength']) {
        return `First Name should contain minimum 2 letters`;
      } else if (name.errors?.['pattern']) {
        return `First Name is invalid`;
      }
    }
    return ``;
  }

  // lastname error handling
  lastnameError(): string {
    const name = this.user_registration_form.get('lastname');

    if (name?.invalid) {
      if (name?.errors?.['required']) {
        return `Last Name is required`;
      } else if (name?.errors?.['minlength']) {
        return `Last Name should contain minimum 2 letters`;
      } else if (name?.errors?.['pattern']) {
        return `Last Name is invalid`;
      }
    }
    return ``;
  }
}
