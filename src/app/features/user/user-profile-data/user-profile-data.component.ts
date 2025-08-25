import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UserService } from '../../../shared/services/user.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MessageToasterService } from '../../../shared/services/message-toaster.service';
import { Router } from '@angular/router';
import { namePattern } from '../../../shared/regexp/regexp';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { AutoUnsubscribe } from '../../../core/decorators/auto-usub.decorator';
import { Subscription } from 'rxjs';
import { UploadService } from '../../../shared/services/upload.service';

@Component({
  selector: 'app-user-profile-data',
  imports: [ReactiveFormsModule, FormsModule, CommonModule, ButtonModule],
  templateUrl: './user-profile-data.component.html',
  styleUrl: './user-profile-data.component.css',
})
@AutoUnsubscribe
export class UserProfileDataComponent implements OnInit {
  user_profile_data: any = { firstName: '', lastName: '' };
  userId!: any;
  email_edit = false;
  name_edit = false;
  url: any = null;
  imagePath!: any;
  profile_pic_event!: Event;

  edit_profile_picture!: FormGroup;
  name_form!: FormGroup;
  email_form!: FormGroup;

  profileDataSubscription!: Subscription;

  constructor(
    private userService: UserService,
    private showMessage: MessageToasterService,
    private formBuilder: FormBuilder,
    private router: Router,
    private uploadService: UploadService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.profileData();
    this.initializeForms();
    this.name_form.get('firstName')?.disable();
    this.name_form.get('lastName')?.disable();
    this.email_form.get('email')?.disable();
  }

  selectedFile: File | null = null;
  previewUrl: string | null = null;

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.uploadImage();
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  uploadImage() {
    if (this.selectedFile) {
      this.uploadService
        .uploadImage(this.selectedFile, 'AgriConnect')
        .subscribe({
          next: (imageUrl) => {
            this.url = imageUrl;
            this.upload_image_to_server();
          },
          error: (error) => console.error('Error uploading image:', error),
        });
    }
  }

  upload_image_to_server() {
    const data = {
      userId: this.userId,
      image_url: this.url,
    };
    this.userService.edit_user_profile_picture(data).subscribe({
      next: (Response) => {
        this.showMessage.showSuccessToastr(Response.message);
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.showMessage.showErrorToastr(error.error.message);
      },
    });
  }

  triggerFileInput() {
    const fileInput = document.getElementById(
      'upload_profile'
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  private initializeForms(): void {
    this.edit_profile_picture = this.formBuilder.group({
      profile_picture: [null, Validators.required],
    });

    this.name_form = this.formBuilder.group({
      firstName: [
        this.user_profile_data.firstName,
        [
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern(namePattern),
        ],
      ],
      lastName: [
        this.user_profile_data.lastName,
        [
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern(namePattern),
        ],
      ],
    });

    this.email_form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  close_name() {
    this.name_form.patchValue({
      firstName: this.user_profile_data.firstName,
      lastName: this.user_profile_data.lastName,
    });
    this.name_edit = !this.name_edit;
    if (this.name_edit) {
      this.name_form.get('firstName')?.enable();
      this.name_form.get('lastName')?.enable();
    } else {
      this.name_form.get('firstName')?.disable();
      this.name_form.get('lastName')?.disable();
    }
  }

  close_email() {
    this.email_form.patchValue({
      email: this.user_profile_data.email,
    });
    this.email_edit = !this.email_edit;

    if (this.email_edit) {
      this.email_form.get('email')?.enable();
    } else {
      this.email_form.get('email')?.disable();
    }
  }

  submit_name() {
    if (this.name_form.invalid) {
      this.markFormGroupTouched(this.name_form);
      return;
    } else {
      if (
        this.name_form.value.firstName === this.user_profile_data.firstName &&
        this.name_form.value.lastName === this.user_profile_data.lastName
      ) {
        this.close_name();
        return;
      }
      const data = {
        _id: this.userId,
        firstName: this.name_form.value.firstName,
        lastName: this.name_form.value.lastName,
        email: this.user_profile_data.email,
      };
      this.userService.editUserProfile_name(data).subscribe({
        next: (response) => {
          this.showMessage.showSuccessToastr(response.message);
          this.user_profile_data.firstName = data.firstName;
          this.user_profile_data.lastName = data.lastName;
          this.close_name();
        },
        error: (error) => {
          console.error('Error response:', error);
          this.showMessage.showErrorToastr(error.error.message);
          this.close_name();
        },
      });
    }
  }

  submit_email() {
    if (this.email_form.invalid) {
      this.markFormGroupTouched(this.email_form);
      return;
    } else {
      if (this.email_form.value.email === this.user_profile_data.email) {
        this.close_email();
        return;
      }
      const data = {
        userId: this.userId,
        email: this.email_form.value.email,
      };
      this.userService.opt_for_new_email(data).subscribe({
        next: (Response) => {
          this.showMessage.showSuccessToastr(
            Response.message || 'Email update OTP sent successfully.'
          );
          if (data.email) {
            localStorage.setItem('email', this.user_profile_data.email);
            localStorage.setItem('new_email', data.email);
            localStorage.setItem('role', 'user_new_email');
          }
          this.router.navigate(['/user/verifyOtp']);
        },
        error: (error) => {
          this.showMessage.showErrorToastr(error.error.message);
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

  profileData() {
    this.userId = localStorage.getItem('userId');
    this.profileDataSubscription = this.userService
      .getuserDetails({ _id: this.userId })
      .subscribe({
        next: (response) => {
          this.user_profile_data = response;
          this.url = this.user_profile_data.profile_picture;
          this.name_form.patchValue({
            firstName: this.user_profile_data.firstName,
            lastName: this.user_profile_data.lastName,
          });
          this.email_form.patchValue({
            email: this.user_profile_data.email,
          });
        },
        error: (error) => {
          console.error(error);
          this.showMessage.showErrorToastr('Error in fetching profile data');
        },
      });
  }
}
