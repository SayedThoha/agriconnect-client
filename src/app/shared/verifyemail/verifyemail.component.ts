import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MessageToasterService } from '../services/message-toaster.service';
import { UserService } from '../services/user.service';
import { ExpertService } from '../services/expert.service';
import { Router } from '@angular/router';
import { CommonService } from '../services/common.service';
import { CommonModule } from '@angular/common';
import { AutoUnsubscribe } from '../../core/decorators/auto-usub.decorator';

@AutoUnsubscribe
@Component({
  selector: 'app-verifyemail',
  imports: [HeaderComponent, ReactiveFormsModule, CommonModule,FormsModule],
  templateUrl: './verifyemail.component.html',
  styleUrl: './verifyemail.component.css',
})
export class VerifyemailComponent implements OnInit {
  verifyEmailForm!: FormGroup;
  constructor(
    private formbuilder: FormBuilder,
    private showMessage: MessageToasterService,
    private userservice: UserService,
    private expertService: ExpertService,
    private router: Router,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.initialisForms();
  }

  initialisForms(): void {
    this.verifyEmailForm = this.formbuilder.group({
      email: ['', [Validators.required, Validators.email]],
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
    if (this.verifyEmailForm.invalid) {
      this.markFormGroupTouched(this.verifyEmailForm);
      return;
    } else {
      const data = {
        email: this.verifyEmailForm.value.email,
      };
      localStorage.setItem('role', 'userForgetPassword');
      if (data.email) {
        localStorage.setItem('email', data.email);
      }

      if (this.commonService.getAuthFromLocalStorage() === 'user') {
        this.userservice.verifyEmail(data).subscribe({
          next: (response) => {
            this.showMessage.showSuccessToastr(response.message);
            this.router.navigate(['/user/verifyOtp']);
          },
          error: (error) => {
            // console.log(error.error.message)
            this.showMessage.showErrorToastr(error.error.message);
          },
        });
      } else if (this.commonService.getAuthFromLocalStorage() === 'expert') {
        this.expertService.verifyEmail(data).subscribe({
          next: (response) => {
            this.showMessage.showSuccessToastr(response.message);
            this.router.navigate(['/expert/verifyOtp']);
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
