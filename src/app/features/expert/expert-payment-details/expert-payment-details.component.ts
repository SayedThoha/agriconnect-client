import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MessageToasterService } from '../../../shared/services/message-toaster.service';
import { ExpertService } from '../../../shared/services/expert.service';
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

@AutoUnsubscribe
@Component({
  selector: 'app-expert-payment-details',
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './expert-payment-details.component.html',
  styleUrl: './expert-payment-details.component.css',
})
export class ExpertPaymentDetailsComponent implements OnInit {
  payments!: any;
  payments_to_display!: any;
  expertId!: any;
  searchForm!: FormGroup;
  paymentForm!: FormGroup;

  bookingDetailsSubscription!:Subscription

  constructor(
    private messageService: MessageToasterService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private expertService: ExpertService
  ) {}

  ngOnInit(): void {
    this.initialiseForms();
    this.getAppointmentDetails();
    this.paymentForm.get('status')?.valueChanges.subscribe((value) => {
      if (value) this.paymentFormSubmit();
    });
    this.expertId = localStorage.getItem('expertId');
    this.setupSearchSubscription();
  }

  getAppointmentDetails() {
  this.bookingDetailsSubscription= this.expertService
      .get_booking_details_of_expert({
        expertId: localStorage.getItem('expertId'),
      })
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
      ?.valueChanges.pipe(debounceTime(300)) // Adjust debounce time as needed
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
    console.log('payment form submit');
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
