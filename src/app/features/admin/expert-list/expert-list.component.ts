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
import { debounceTime } from 'rxjs';
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
  constructor(
    private _adminService: AdminServiceService,
    private _messageservice: MessageToasterService,
    private _router: Router,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.initializeForms();
    this.getAllExperts();
    this.setupSearchSubscription();
    this.verificationForm.get('status')?.valueChanges.subscribe((value) => {
      console.log('Status changed to:', value);
      if (value) this.verificationFormSubmit();
    });
  }

  private initializeForms(): void {
    this.searchForm = this._formBuilder.group({
      searchData: ['', Validators.required],
    });

    this.verificationForm = this._formBuilder.group({
      status: ['all'],
    });
  }

  setupSearchSubscription() {
    this.searchForm
      .get('searchData')
      ?.valueChanges.pipe(debounceTime(300)) // Adjust debounce time as needed
      .subscribe((value) => {
        this.filterExperts(value);
      });
  }

  filterExperts(searchTerm: string | null) {
    if (searchTerm) {
      const regex = new RegExp(searchTerm, 'i');
      this.experts_to_display = this.experts.filter(
        (experts: any) =>
          regex.test(experts.firstName) ||
          regex.test(experts.lastName) ||
          regex.test(experts.email)
      );
    } else {
      this.experts_to_display = this.experts;
    }
  }

  verificationFormSubmit() {
    console.log('verification form submit');

    if (this.verificationForm.valid) {
      const selectedStatus = this.verificationForm.value.status;
      console.log('status:', selectedStatus);
      if (selectedStatus === 'all') {
        this.experts_to_display = this.experts;
      } else if (selectedStatus === 'verified') {
        this.experts_to_display = this.experts.filter(
          (item: any) => item.kyc_verification === true
        );
      } else if (selectedStatus === 'not_verified') {
        this.experts_to_display = this.experts.filter(
          (item: any) => item.kyc_verification === false
        );
      } else if (selectedStatus === 'blocked') {
        this.experts_to_display = this.experts.filter(
          (item: any) => item.blocked === true
        );
      } else if (selectedStatus === 'unblocked') {
        this.experts_to_display = this.experts.filter(
          (item: any) => item.blocked === false
        );
      }
      // this.cdr.detectChanges();
    }
  }

  kyc_verification(data: any) {
    const _id = data;
    console.log('_id for expert kyc from expert listing component:', _id);
    localStorage.setItem('expert_id_for_kyc_details', _id);
    this._router.navigate(['admin/adminHome/checkDocumentsKyc']);
  }

  getAllExperts() {
    const queryparams = { expert: 'all' };
    this._adminService.getExperts(queryparams).subscribe({
      next: (Response) => {
        console.log('get expert details', Response);
        this.experts = Response;
        this.experts_to_display = this.experts;
      },
      error: (error) => {
        console.log('got error');
        this._messageservice.showErrorToastr(error.message);
      },
    });
  }

  changeStatus(data: any) {
    const datas = { _id: data._id };
    console.log('queryparams:', datas);
    this._adminService.expertBlock(datas).subscribe({
      next: (Response) => {
        console.log('status changes');
        // data.blocked=!data.blocked
        data.blocked === true ? (data.blocked = false) : (data.blocked = true);
      },
      error: (error) => {
        console.log('got error', error);
        this._messageservice.showErrorToastr(error.message);
      },
    });
  }
}
