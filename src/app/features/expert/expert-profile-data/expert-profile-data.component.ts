/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../shared/services/common.service';
import { ExpertService } from '../../../shared/services/expert.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MessageToasterService } from '../../../shared/services/message-toaster.service';
import { ImageUploadService } from '../../../shared/services/image-upload.service';
import { Router, RouterModule } from '@angular/router';
import {
  consultationFeePattern,
  experiencePattern,
  mobilepattern,
  namePattern,
} from '../../../shared/regexp/regexp';
import { CommonModule } from '@angular/common';
import { AutoUnsubscribe } from '../../../core/decorators/auto-usub.decorator';
import { Subscription } from 'rxjs';
import { UploadService } from '../../../shared/services/upload.service';

@AutoUnsubscribe
@Component({
  selector: 'app-expert-profile-data',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './expert-profile-data.component.html',
  styleUrl: './expert-profile-data.component.css',
})
export class ExpertProfileDataComponent implements OnInit {
  expertId!: string;
  expertDetails!: any;
  edit = false;
  url!: string;

  email_edit = false;
  name_edit = false;

  editProfileForm!: FormGroup;
  email_form!: FormGroup;

  expertDetailsSubscription!: Subscription;
  constructor(
    private commonService: CommonService,
    private expertService: ExpertService,
    private formBuilder: FormBuilder,
    private showMessage: MessageToasterService,
    private imageuploadService: ImageUploadService,
    private router: Router,
    private uploadService: UploadService
  ) {}

  ngOnInit(): void {
    this.getExpertDetails();
    this.initializeForms();
    this.editProfileForm.get('firstName')?.disable();
    this.editProfileForm.get('lastName')?.disable();
    this.editProfileForm.get('contactno')?.disable();
    this.editProfileForm.get('experience')?.disable();
    this.editProfileForm.get('current_working_address')?.disable();
    this.editProfileForm.get('consultation_fee')?.disable();
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
            const transformedUrl = this.applyTransformation(imageUrl, 200, 200);

            this.url = transformedUrl;
            this.upload_image_to_server();
          },
          error: (error) => console.error('Error uploading image:', error),
        });
    }
  }

  applyTransformation(imageUrl: string, width: number, height: number): string {
    const uploadIndex = imageUrl.indexOf('/upload/') + 8;

    const transformation = `c_fill,g_auto,w_${width},h_${height}`;

    const transformedUrl = `${imageUrl.slice(
      0,
      uploadIndex
    )}${transformation}/${imageUrl.slice(uploadIndex)}`;

    return transformedUrl;
  }

  upload_image_to_server() {
    const data = {
      expertId: this.expertId,
      image_url: this.url,
    };
    this.expertService.edit_expert_profile_picture(data).subscribe({
      next: (Response) => {
        this.showMessage.showSuccessToastr(Response.message);
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

  initializeForms(): void {
    this.editProfileForm = this.formBuilder.group({
      firstName: [
        '',
        [
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern(namePattern),
        ],
      ],
      lastName: [
        '',
        [
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern(namePattern),
        ],
      ],
      contactno: ['', [Validators.required, Validators.pattern(mobilepattern)]],
      current_working_address: [
        '',
        [Validators.required, Validators.maxLength(150)],
      ],
      experience: [
        '',
        [Validators.required, Validators.pattern(experiencePattern)],
      ],
      consultation_fee: [
        '',
        [Validators.required, Validators.pattern(consultationFeePattern)],
      ],
    });

    this.email_form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  submit_profile_details() {
    if (this.editProfileForm.invalid) {
      this.markFormGroupTouched(this.editProfileForm);
      return;
    } else {
      if (
        this.editProfileForm.value.firstName === this.expertDetails.firstName &&
        this.editProfileForm.value.lastName === this.expertDetails.lastName &&
        this.editProfileForm.value.contactno === this.expertDetails.contactno &&
        this.editProfileForm.value.consultation_fee ===
          this.expertDetails.consultation_fee &&
        this.editProfileForm.value.current_working_address ===
          this.expertDetails.current_working_address &&
        this.editProfileForm.value.experience === this.expertDetails.experience
      ) {
        this.close_name();
        return;
      }
      const data = {
        _id: this.expertId,
        firstName: this.editProfileForm.value.firstName,
        lastName: this.editProfileForm.value.lastName,
        contactno: this.editProfileForm.value.contactno,
        experience: this.editProfileForm.value.experience,
        current_working_address:
          this.editProfileForm.value.current_working_address,
        consultation_fee: this.editProfileForm.value.consultation_fee,
      };
      this.expertService.editExpertProfile(data).subscribe({
        next: (response) => {
          this.showMessage.showSuccessToastr(response.message);
          this.expertDetails.firstName = data.firstName;
          this.expertDetails.lastName = data.lastName;
          this.expertDetails.contactno = data.contactno;
          this.expertDetails.current_working_address =
            data.current_working_address;
          this.expertDetails.experience = data.experience;
          this.expertDetails.consultation_fee = data.consultation_fee;
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
      if (this.email_form.value.email === this.expertDetails.email) {
        this.close_email();
        return;
      }
      const data = {
        expertId: this.expertId,
        email: this.email_form.value.email,
      };
      this.expertService.opt_for_new_email(data).subscribe({
        next: (Response) => {
          this.showMessage.showSuccessToastr(Response.message);
          if (data.email) {
            localStorage.setItem('email', this.expertDetails.email);
            localStorage.setItem('new_email', data.email);
            localStorage.setItem('role', 'expert_new_email');
          }
          this.router.navigate(['expert/verifyOtp']);
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

  close_name() {
    this.editProfileForm.patchValue({
      firstName: this.expertDetails.firstName,
      lastName: this.expertDetails.lastName,
      contactno: this.expertDetails.contactno,
      experience: this.expertDetails.experience,
      current_working_address: this.expertDetails.current_working_address,
      consultation_fee: this.expertDetails.consultation_fee,
    });
    this.name_edit = !this.name_edit;
    if (this.name_edit) {
      this.editProfileForm.get('firstName')?.enable();
      this.editProfileForm.get('lastName')?.enable();
      this.editProfileForm.get('contactno')?.enable();
      this.editProfileForm.get('experience')?.enable();
      this.editProfileForm.get('current_working_address')?.enable();
      this.editProfileForm.get('consultation_fee')?.enable();
    } else {
      this.editProfileForm.get('firstName')?.disable();
      this.editProfileForm.get('lastName')?.disable();
      this.editProfileForm.get('contactno')?.disable();
      this.editProfileForm.get('experience')?.disable();
      this.editProfileForm.get('current_working_address')?.disable();
      this.editProfileForm.get('consultation_fee')?.disable();
    }
  }

  close_email() {
    this.email_form.patchValue({
      email: this.expertDetails.email,
    });
    this.email_edit = !this.email_edit;
    if (this.email_edit) {
      this.email_form.get('email')?.enable();
    } else {
      this.email_form.get('email')?.disable();
    }
  }

  getExpertDetails() {
    this.expertId = this.commonService.getExpertIdFromLocalStorage();
    this.expertDetailsSubscription = this.expertService
      .getExpertDetails({ _id: this.expertId })
      .subscribe({
        next: (Response) => {
          this.expertDetails = Response;
          this.url = Response.profile_picture ?? '';
          this.editProfileForm.patchValue({
            firstName: this.expertDetails.firstName,
            lastName: this.expertDetails.lastName,
            contactno: this.expertDetails.contactno.toString(),
            current_working_address: this.expertDetails.current_working_address,
            experience: this.expertDetails.experience,
            consultation_fee: this.expertDetails.consultation_fee.toString(),
          });

          this.email_form.patchValue({ email: this.expertDetails.email });
        },
        error: (error) => {
          this.showMessage.showErrorToastr(error.error.message);
        },
      });
  }

  changeEdit() {
    this.edit = !this.edit;
  }
}
