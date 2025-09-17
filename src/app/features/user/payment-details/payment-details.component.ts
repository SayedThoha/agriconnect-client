import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MessageToasterService } from '../../../shared/services/message-toaster.service';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from '../../../shared/services/user.service';
import { debounceTime, Subscription } from 'rxjs';
import { AutoUnsubscribe } from '../../../core/decorators/auto-usub.decorator';
import { AppointMent } from '../../admin/models/appointmentModel';
import { AppointmentCodePipe } from '../../../shared/pipes/appointment-code.pipe';
import { Router } from '@angular/router';
@AutoUnsubscribe
@Component({
  selector: 'app-payment-details',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AppointmentCodePipe,
  ],
  templateUrl: './payment-details.component.html',
  styleUrl: './payment-details.component.css',
})
export class PaymentDetailsComponent implements OnInit {
  payments!: AppointMent[];
  payments_to_display!: AppointMent[];
  userId!: string | null;
  searchForm!: FormGroup;
  paymentForm!: FormGroup;
  slotId!: string;

  bookingDetailsSubscription!: Subscription;
  constructor(
    private messageService: MessageToasterService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getAppointmentDetails();
    this.initialiseForms();
    this.paymentForm.get('status')?.valueChanges.subscribe((value) => {
      if (value) this.paymentFormSubmit();
    });
    this.userId = localStorage.getItem('userId');
    this.setupSearchSubscription();
  }

  getAppointmentDetails() {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.bookingDetailsSubscription = this.userService
        .get_booking_details_of_user({ userId: userId })
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
        (appointment) =>
          regex.test(appointment.expertId.firstName) ||
          regex.test(appointment.slotId.bookingAmount.toString()) ||
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
