import { ChangeDetectorRef, Component } from '@angular/core';
import { AdminServiceService } from '../services/admin-service.service';
import { MessageToasterService } from '../../../shared/services/message-toaster.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { debounceTime, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AutoUnsubscribe } from '../../../core/decorators/auto-usub.decorator';
import { AppointMent } from '../models/appointmentModel';
@AutoUnsubscribe
@Component({
  selector: 'app-payment-history',
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './payment-history.component.html',
  styleUrl: './payment-history.component.css',
})
export class PaymentHistoryComponent {
  payments!: AppointMent[];
  payments_to_display!: AppointMent[];
  searchForm!: FormGroup;
  paymentForm!: FormGroup;

  paymentHistorySubscription!: Subscription;
  constructor(
    private adminService: AdminServiceService,
    private messageService: MessageToasterService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initialiseForms();
    this.getAppointmentDetails();
    this.paymentForm.get('status')?.valueChanges.subscribe((value) => {
      if (value) this.paymentFormSubmit();
    });
    this.setupSearchSubscription();
  }

  getAppointmentDetails() {
    this.paymentHistorySubscription = this.adminService
      .getAppointment()
      .subscribe({
        next: (Response) => {
          this.payments = Response;
          this.payments_to_display = this.payments;
        },
        error: (error) => {
          this.messageService.showErrorToastr(error.error.message);
        },
      });
  }

  initialiseForms(): void {
    this.searchForm = this.formBuilder.group({
      searchData: ['', Validators.required],
    });

    this.paymentForm = this.formBuilder.group({
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
      this.payments_to_display = this.payments_to_display.filter(
        (appointment: any) =>
          regex.test(appointment.expertId.firstName) ||
          regex.test(appointment.slotId.bookingAmount) ||
          regex.test(appointment.payment_method)
      );
    } else {
      this.payments_to_display = this.payments;
    }
  }

  paymentFormSubmit() {
    if (this.paymentForm.valid) {
      const selectedStatus = this.paymentForm.value.status;
      if (selectedStatus === 'all') {
        this.payments_to_display = this.payments;
      } else if (selectedStatus === 'onlinePayment') {
        this.payments_to_display = this.payments.filter(
          (item: { payment_method: string }) =>
            item.payment_method === 'online_payment'
        );
      } else if (selectedStatus === 'walletPayment') {
        this.payments_to_display = this.payments.filter(
          (item: { payment_method: string }) =>
            item.payment_method === 'wallet_payment'
        );
      }
      this.cdr.detectChanges();
    }
  }
}
