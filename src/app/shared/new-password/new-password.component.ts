import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MessageToasterService } from '../services/message-toaster.service';
import { Router } from '@angular/router';
import { CommonService } from '../services/common.service';
import { UserService } from '../services/user.service';
import { ExpertService } from '../services/expert.service';
import { passwordPattern } from '../regexp/regexp';
import { UpdatePasswordRequest } from '../../core/models/commonModel';

@Component({
  selector: 'app-new-password',
  imports: [HeaderComponent, CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './new-password.component.html',
  styleUrl: './new-password.component.css',
})
export class NewPasswordComponent implements OnInit {
  email!: string; // Initialize later in ngOnInit
  newPasswordForm!: FormGroup; // Initialize later in ngOnInit

  constructor(
    private formBuilder: FormBuilder,
    private showMessage: MessageToasterService,
    private router: Router,
    private userService: UserService,
    private commonService: CommonService,
    private expertService: ExpertService
  ) {}

  ngOnInit(): void {
    this.email = this.commonService.getEmailFromLocalStrorage();

    this.newPasswordForm = this.formBuilder.group({
      newPassword: [
        '',
        [Validators.required, Validators.pattern(passwordPattern)],
      ],
      confirmPassword: ['', [Validators.required]],
    });
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
    if (this.newPasswordForm.invalid) {
      this.markFormGroupTouched(this.newPasswordForm);
      return;
    } else {
      if (
        this.newPasswordForm.value.newPassword !==
        this.newPasswordForm.value.confirmPassword
      ) {
        this.showMessage.showErrorToastr('Passwords are not matching');
      } else {
        const data: UpdatePasswordRequest = {
          email: this.email,
          password: this.newPasswordForm.value.newPassword || '',
        };
        if (this.commonService.getAuthFromLocalStorage() === 'user') {
          this.userService.updatePassword(data).subscribe({
            next: (response) => {
              localStorage.removeItem('email');
              this.showMessage.showSuccessToastr(response.message);
              this.router.navigate(['/user/login']);
            },
            error: (error) => {
              this.showMessage.showErrorToastr(error.error.message);
            },
          });
        } else if (this.commonService.getAuthFromLocalStorage() === 'expert') {
          this.expertService.updatePassword(data).subscribe({
            next: (Response) => {
              localStorage.removeItem('email');
              this.showMessage.showSuccessToastr(Response.message);
              this.router.navigate(['/expert/expertLogin']);
            },
            error: (error) => {
              this.showMessage.showErrorToastr(error.error.message);
            },
          });
        }
      }
    }
  }
}
