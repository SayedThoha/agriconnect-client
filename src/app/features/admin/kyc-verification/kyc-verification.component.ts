import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AdminServiceService } from '../services/admin-service.service';
import { MessageToasterService } from '../../../shared/services/message-toaster.service';
import { CapitaliseFirstPipe } from '../../../shared/pipes/capitalise-first.pipe';
import { AutoUnsubscribe } from '../../../core/decorators/auto-usub.decorator';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-kyc-verification',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormsModule,
    CapitaliseFirstPipe,
  ],
  templateUrl: './kyc-verification.component.html',
  styleUrl: './kyc-verification.component.css',
})
@AutoUnsubscribe
export class KycVerificationComponent implements OnInit {
  expert_kyc_details!: any;
  expert_id!: string | null;

  kyc_verification_form!: FormGroup;

  kycVerificationSubscription!: Subscription;
  constructor(
    private _router: Router,
    private _adminService: AdminServiceService,
    private _messagService: MessageToasterService,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.expert_id = localStorage.getItem('expert_id_for_kyc_details');
    this.initializeForm();
    this.get_expert_kyc_details_from_id(this.expert_id as string);
  }

  get_expert_kyc_details_from_id(_id: string) {
    this.kycVerificationSubscription = this._adminService
      .get_expert_kyc_details_from_id({ expertId: _id })
      .subscribe({
        next: (Response) => {
          this.expert_kyc_details = Response;
          console.log('expert kyc details', this.expert_kyc_details);
          this.setFormData();
        },
        error: (error) => {
          this._messagService.showErrorToastr(error.error.message);
        },
      });
  }

  private initializeForm() {
    this.kyc_verification_form = this._formBuilder.group({
      id_proof_type: ['', Validators.required],
      id_proof: ['', Validators.required],
      expert_licence: ['', Validators.required],
      qualification_certificate: ['', Validators.required],
      experience_certificate: ['', Validators.required],
      specialisation: ['', Validators.required],
      current_working_address: ['', Validators.required],
    });
  }

  setFormData() {
    this.kyc_verification_form.setValue({
      id_proof_type: this.expert_kyc_details.id_proof_type,
      id_proof: this.expert_kyc_details.id_proof,
      expert_licence: this.expert_kyc_details.expert_licence,
      qualification_certificate:
        this.expert_kyc_details.qualification_certificate,
      experience_certificate: this.expert_kyc_details.exp_certificate,
      specialisation: this.expert_kyc_details.specialization,
      current_working_address: this.expert_kyc_details.current_working_address,
    });
  }

  file_download(name: string, index: Number = -1) {
    const pdf_name = name;
    let pdfUrl = this.expert_kyc_details.expertId[pdf_name];
    this._router.navigate(['/admin/adminHome/pdf_viewer'], {
      queryParams: { url: encodeURIComponent(pdfUrl) },
    });
  }

  submit_kyc_verification_form() {
    const data = {
      _id: this.expert_kyc_details._id,
      expert_id: this.expert_kyc_details.expertId._id,
      id_proof_type: this.kyc_verification_form.value.id_proof_type,
      id_proof: this.kyc_verification_form.value.id_proof,
      expert_licence: this.kyc_verification_form.value.expert_licence,
      qualification_certificate:
        this.kyc_verification_form.value.qualification_certificate,
      exp_certificate: this.kyc_verification_form.value.experience_certificate,
      specialisation: this.kyc_verification_form.value.specialisation,
      current_working_address:
        this.kyc_verification_form.value.current_working_address,
    };

    this._adminService.submit_kyc_details(data).subscribe({
      next: (Response) => {
        if (Response.message === 'KYC verification done') {
          this._messagService.showSuccessToastr(Response.message);
          this._router.navigate(['/admin/adminHome/expert_listing']);
        } else {
          this._messagService.showWarningToastr(Response.message);
        }
      },
      error: (error) => {
        this._messagService.showErrorToastr(error.error.message);
      },
    });
  }

  previous_page() {
    this._router.navigate(['/admin/adminHome/expert_listing']);
  }
}
