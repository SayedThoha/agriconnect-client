import { Component, OnInit } from '@angular/core';
import { expertData } from '../models/expertModel';
import { AdminServiceService } from '../services/admin-service.service';
import { MessageToasterService } from '../../../shared/services/message-toaster.service';
import { Router, RouterModule } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { debounceTime, Subscription } from 'rxjs';
import { AutoUnsubscribe } from '../../../core/decorators/auto-usub.decorator';

@Component({
  selector: 'app-expert-list',
  imports: [ReactiveFormsModule, FormsModule, CommonModule, RouterModule],
  templateUrl: './expert-list.component.html',
  styleUrl: './expert-list.component.css',
})
@AutoUnsubscribe
export class ExpertListComponent implements OnInit {
  experts!: expertData[];
  experts_to_display!: expertData[];
  searchForm!: FormGroup;
  verificationForm!: FormGroup;

  expertListSubscription!: Subscription;
  constructor(
    private adminService: AdminServiceService,
    private messageservice: MessageToasterService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.initializeForms();
    this.getAllExperts();
    this.setupSearchSubscription();
    this.verificationForm.get('status')?.valueChanges.subscribe((value) => {
      if (value) this.verificationFormSubmit();
    });
  }

  private initializeForms(): void {
    this.searchForm = this.formBuilder.group({
      searchData: ['', Validators.required],
    });

    this.verificationForm = this.formBuilder.group({
      status: ['all'],
    });
  }

  setupSearchSubscription() {
    this.searchForm
      .get('searchData')
      ?.valueChanges.pipe(debounceTime(300))
      .subscribe((value) => {
        this.filterExperts(value);
      });
  }

  filterExperts(searchTerm: string | null) {
    if (searchTerm) {
      const regex = new RegExp(searchTerm, 'i');
      this.experts_to_display = this.experts.filter(
        (experts) =>
          regex.test(experts.firstName) ||
          regex.test(experts.lastName) ||
          regex.test(experts.email)
      );
    } else {
      this.experts_to_display = this.experts;
    }
  }

  verificationFormSubmit() {
    if (this.verificationForm.valid) {
      const selectedStatus = this.verificationForm.value.status;

      if (selectedStatus === 'all') {
        this.experts_to_display = this.experts;
      } else if (selectedStatus === 'verified') {
        this.experts_to_display = this.experts.filter(
          (item: expertData) => item.kyc_verification === true
        );
      } else if (selectedStatus === 'not_verified') {
        this.experts_to_display = this.experts.filter(
          (item: expertData) => item.kyc_verification === false
        );
      } else if (selectedStatus === 'blocked') {
        this.experts_to_display = this.experts.filter(
          (item: expertData) => item.blocked === true
        );
      } else if (selectedStatus === 'unblocked') {
        this.experts_to_display = this.experts.filter(
          (item: expertData) => item.blocked === false
        );
      }
    }
  }

  kyc_verification(data?: string) {
    const _id = data;
    if (_id) {
      localStorage.setItem('expert_id_for_kyc_details', _id);
      this.router.navigate(['admin/adminHome/checkDocumentsKyc']);
    }
  }

  getAllExperts() {
    const queryparams = { expert: 'all' };
    this.expertListSubscription = this.adminService
      .getExperts(queryparams)
      .subscribe({
        next: (Response) => {
          this.experts = Response;
          this.experts_to_display = this.experts;
        },
        error: (error) => {
          console.error('got error');
          this.messageservice.showErrorToastr(error.message);
        },
      });
  }

  changeStatus(data: expertData) {
    const datas = { _id: data._id };

    this.adminService.expertBlock(datas).subscribe({
      next: () => {
        // data.blocked === true ? (data.blocked = false) : (data.blocked = true);
        data.blocked = !data.blocked;
      },
      error: (error) => {
        console.error('got error', error);
        this.messageservice.showErrorToastr(error.message);
      },
    });
  }
}
