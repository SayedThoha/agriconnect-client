import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MessageToasterService } from '../../../shared/services/message-toaster.service';
import { ExpertService } from '../../../shared/services/expert.service';
import {
  consultationFeePattern,
  experiencePattern,
  mobilepattern,
  namePattern,
  passwordPattern,
} from '../../../shared/regexp/regexp';
import { CommonModule } from '@angular/common';
import { ImageUploadService } from '../../../shared/services/image-upload.service';
import { firstValueFrom } from 'rxjs';
import { HeaderComponent } from '../../../shared/header/header.component';
import { UploadService } from '../../../shared/services/upload.service';

@Component({
  selector: 'app-expertsignup',
  imports: [ReactiveFormsModule, CommonModule, HeaderComponent, FormsModule],
  templateUrl: './expertsignup.component.html',
  styleUrl: './expertsignup.component.css',
})
export class ExpertsignupComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private showMessage: MessageToasterService,
    private expertService: ExpertService,
    private uploadService: UploadService
  ) {}

  registration_form!: FormGroup;
  title = 'Expert Registration';
  specialisation: any = [];
  url!: any;

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  ngOnInit() {
    this.expert_registration();
    this.getSpecialisation();
  }

  expert_registration() {
    this.registration_form = this.formBuilder.group({
      firstName: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.pattern(namePattern),
        ],
      ],
      lastName: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.pattern(namePattern),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      contactno: ['', [Validators.required, Validators.pattern(mobilepattern)]],
      profile_picture: [null, Validators.required],
      specialisation: ['', Validators.required],
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
      identity_proof_type: ['', Validators.required],
      identity_proof: [null, Validators.required],
      expert_licence: [null, Validators.required],
      qualification_certificate: [[], Validators.required],
      experience_certificate: [[], Validators.required],
      password: [
        '',
        [Validators.required, Validators.pattern(passwordPattern)],
      ],
      confirm_password: ['', Validators.required],
    });
  }

  getSpecialisation() {
    this.expertService.getSpecialisation().subscribe({
      next: (Response) => {
        this.specialisation = Response.specialisation;
      },
    });
  }

  onFileSelected(event: Event, controlName: string): void {
    const inputFile = event.target as HTMLInputElement;
    // console.log(`${controlName} files:`, inputFile.files);
    if (inputFile.files && inputFile.files.length > 0) {
      if (controlName === 'profile_picture') {
        // const file=Array.from(inputFile.files).filter(file => file.type === '.jpg, .jpeg, .png');
        const file = Array.from(inputFile.files).find(
          (file) =>
            file.type === 'image/jpeg' ||
            file.type === 'image/jpg' ||
            file.type === 'image/png'
        );
        // console.log('Profile picture file:', file);
        if (file) {
          this.registration_form.patchValue({
            profile_picture: file,
          });
        } else {
          this.registration_form.get('controlName')?.reset();
          this.showMessage.showErrorToastr(
            'Please upload .jpg, .jpeg, or .png images only'
          );
        }
      } else {
        const file = Array.from(inputFile.files).filter(
          (file) => file.type === 'application/pdf'
        );
        // console.log(`${controlName} PDF files:`, file);
        // Check if the selected file is a PDF
        if (file.length > 0) {
          if (controlName === 'identity_proof') {
            this.registration_form.patchValue({
              identity_proof: file[0],
            });
          } else if (controlName === 'experience_certificate') {
            this.registration_form.patchValue({
              experience_certificate: file,
            });
          } else if (controlName === 'qualification_certificate') {
            this.registration_form.patchValue({
              qualification_certificate: file,
            });
          } else if (controlName === 'expert_licence') {
            this.registration_form.patchValue({
              expert_licence: file[0],
            });
          }
        } else {
          this.showMessage.showErrorToastr('upload pdf file only!!');
        }
      }
    }
  }

  onsubmit() {
    // console.log('Form values:', this.registration_form.value);
    // console.log('Files to upload:', {
    //   profile_picture: this.registration_form.get('profile_picture')?.value,
    //   identity_proof: this.registration_form.get('identity_proof')?.value,
    //   expert_licence: this.registration_form.get('expert_licence')?.value,
    //   qualification_certificate: this.registration_form.get(
    //     'qualification_certificate'
    //   )?.value,
    //   experience_certificate: this.registration_form.get(
    //     'experience_certificate'
    //   )?.value,
    // });
    const password = this.registration_form.value.password;
    if (this.registration_form.invalid) {
      this.markFormGroupTouched(this.registration_form);
      return;
    } else {
      const confirmPassword = this.registration_form.value.confirm_password;

      if (password !== confirmPassword) {
        this.showMessage.showErrorToastr('Passwords do not match');
        return;
      }

      const formData = new FormData();
      const uploadPromises: Promise<any>[] = []; // To store all upload tasks

      const profile_picture =
        this.registration_form.get('profile_picture')?.value;
      const identity_proof =
        this.registration_form.get('identity_proof')?.value;
      const expert_licence =
        this.registration_form.get('expert_licence')?.value;
      const qualification_certificate = this.registration_form.get(
        'qualification_certificate'
      )?.value;
      const experience_certificate = this.registration_form.get(
        'experience_certificate'
      )?.value;

      if (profile_picture) {
        const profileUpload$ = this.uploadService.uploadImage(
          profile_picture,
          'AgriConnect'
        );

        uploadPromises.push(
          firstValueFrom(profileUpload$).then((imageUrl: string) => {
            // console.log('Image uploaded successfully:', imageUrl);
            // Apply transformation to crop or pad image to 200x200
            const transformedUrl = this.applyTransformation(imageUrl, 200, 200);
            // console.log('Transformed Image URL:', transformedUrl);
            this.registration_form.patchValue({
              profile_picture: transformedUrl,
            });
          })
        );
      }

      if (identity_proof) {
        const identityproofUpload$ = this.uploadService.uploadImage(
          identity_proof,
          'AgriConnect'
        );

        uploadPromises.push(
          firstValueFrom(identityproofUpload$).then((fileUrl: string) => {
            // console.log('Identity proof uploaded successfully:', fileUrl);
            this.registration_form.patchValue({
              identity_proof: fileUrl,
            });
          })
        );
      }

      if (expert_licence) {
        const expertLicenseUpload$ = this.uploadService.uploadImage(
          expert_licence,
          'AgriConnect'
        );

        uploadPromises.push(
          firstValueFrom(expertLicenseUpload$).then((fileUrl: string) => {
            // console.log('expert license uploaded successfully:', fileUrl);
            this.registration_form.patchValue({
              expert_licence: fileUrl,
            });
          })
        );
      }

      if (qualification_certificate) {
        qualification_certificate.forEach((file: File) => {
          const qualificationCertificateUpload$ =
            this.uploadService.uploadImage(file, 'AgriConnect');
          // .toPromise();
          uploadPromises.push(
            firstValueFrom(qualificationCertificateUpload$).then(
              (fileUrl: unknown) => {
                // console.log(
                //   'Qualification certificate uploaded successfully:',
                //   fileUrl
                // );
                const existingFiles =
                  this.registration_form.get('qualification_certificate')
                    ?.value || [];
                existingFiles.push(fileUrl);
                this.registration_form.patchValue({
                  qualification_certificate: existingFiles,
                });
              }
            )
          );
        });
      }

      if (experience_certificate) {
        experience_certificate.forEach((file: File) => {
          const experienceCertificateUpload$ = this.uploadService.uploadImage(
            file,
            'AgriConnect'
          );
          // .toPromise();

          uploadPromises.push(
            firstValueFrom(experienceCertificateUpload$).then(
              (fileUrl: unknown) => {
                // console.log(
                //   'Experience certificate uploaded successfully:',
                //   fileUrl
                // );
                const existingFiles =
                  this.registration_form.get('experience_certificate')?.value ||
                  [];
                existingFiles.push(fileUrl);
                this.registration_form.patchValue({
                  experience_certificate: existingFiles,
                });
              }
            )
          );
        });
      }

      Promise.all(uploadPromises)
        .then(() => {
          // console.log('All uploads completed.');
          Object.keys(this.registration_form.controls).forEach((key) => {
            const control = this.registration_form.get(key);
            if (control) {
              if (
                key === 'qualification_certificate' ||
                key === 'experience_certificate'
              ) {
                control.value.forEach((file: File) =>
                  formData.append(key, file)
                );
              } else {
                formData.append(key, control.value);
              }
            }
          });
          // console.log('formdata:', formData);

          // Call the expert service
          this.expertService.expertRegister(formData).subscribe({
            next: (Response) => {
              // console.log("response:",Response);

              localStorage.setItem(
                'email',
                this.registration_form.get('email')?.value
              );
              localStorage.setItem('role', 'expertRegistration');
              this.router.navigate(['/expert/verifyOtp']);
              this.showMessage.showSuccessToastr('Registered successfully');
            },
            error: (error) => {
              console.log("Error:",error.message);
              this.showMessage.showErrorToastr(error.message);
            },
          });
        })
        .catch((error) => {
          console.log("error in catch:",error);

          this.showMessage.showErrorToastr('Error uploading files');
        });
    }
  }

  applyTransformation(imageUrl: string, width: number, height: number): string {
    // Find the index of the upload path to inject the transformation
    const uploadIndex = imageUrl.indexOf('/upload/') + 8; // 8 is the length of '/upload/'

    // Create the transformation string to crop the image
    const transformation = `c_fill,g_auto,w_${width},h_${height}`;

    // Insert the transformation into the URL
    const transformedUrl = `${imageUrl.slice(
      0,
      uploadIndex
    )}${transformation}/${imageUrl.slice(uploadIndex)}`;

    return transformedUrl;
  }

  close() {
    this.router.navigate(['/expert/login']);
  }
}
