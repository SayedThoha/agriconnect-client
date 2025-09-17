import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageToasterService } from '../../../shared/services/message-toaster.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from '../../../shared/services/user.service';
import { HeaderComponent } from '../../../shared/header/header.component';
import { CommonModule } from '@angular/common';
import { CapitaliseFirstPipe } from '../../../shared/pipes/capitalise-first.pipe';
import { AutoUnsubscribe } from '../../../core/decorators/auto-usub.decorator';
import { Subscription } from 'rxjs';
import { FarmerDetails } from '../../../core/models/expertModel';
import { PaymentOrder, Slot } from '../../../core/models/slotModel';
import { RazorpayOptions } from '../../../core/models/razorPay';
// declare let Razorpay: any;
// declare global {
//   interface Window {
//     Razorpay: typeof Razorpay;
//   }
// }
@AutoUnsubscribe
@Component({
  selector: 'app-appointment-booking',
  imports: [
    HeaderComponent,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    CapitaliseFirstPipe,
  ],
  templateUrl: './appointment-booking.component.html',
  styleUrl: './appointment-booking.component.css',
})
export class AppointmentBookingComponent implements OnInit {
  slotId!: string;
  slotDetails!: Slot;
  visible = false;
  namePattern = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*\s*$/;
  agePattern = /^(?:[1-9][0-9]?|10[0-9])$/;
  isDisable = true;
  farmer_details!: FarmerDetails;
  userId = localStorage.getItem('userId');
  farmer_details_form!: FormGroup;
  payment_form!: FormGroup;

  appointmentBookingSubscription!: Subscription;
  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private messageService: MessageToasterService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.intialiseForms();
    this.appointmentBooking();
  }

  appointmentBooking() {
    this.slotId = localStorage.getItem('slotId')!;
    if (this.slotId) {
      this.appointmentBookingSubscription = this.userService
        .getSlot({ slotId: this.slotId })
        .subscribe({
          next: (Response) => {
            this.slotDetails = Response;
          },
          error: (error) => {
            this.messageService.showErrorToastr(error.error.message);
          },
        });
    }
  }

  intialiseForms(): void {
    this.farmer_details_form = this.formBuilder.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.pattern(this.namePattern),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      age: ['', [Validators.required, Validators.pattern(this.agePattern)]],
      gender: ['', Validators.required],
      address: ['', Validators.required],
      reason_for_visit: ['', Validators.required],
    });

    this.payment_form = this.formBuilder.group({
      payment_method: ['online_payment', Validators.required],
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

  farmer_details_form_submit() {
    if (this.farmer_details_form.invalid) {
      this.markFormGroupTouched(this.farmer_details_form);
      return;
    } else {
      this.farmer_details = {
        slotId: this.slotId,
        userId: this.userId,
        expertId: this.slotDetails.expertId._id,
        farmer_details: {
          name: this.farmer_details_form.value.name,
          email: this.farmer_details_form.value.email,
          age: this.farmer_details_form.value.age,
          gender: this.farmer_details_form.value.gender,
          address: this.farmer_details_form.value.address,
          reason_for_visit: this.farmer_details_form.value.reason_for_visit,
        },
      };
      this.isDisable = false;
    }
  }

  payment_form_submit() {
    if (this.slotId) {
      this.userService
        .check_if_the_slot_available({ slotId: this.slotId })
        .subscribe({
          next: () => {
            if (this.payment_form.value.payment_method === 'online_payment') {
              this.onlinePayment();
            } else if (
              this.payment_form.value.payment_method === 'wallet_payment'
            ) {
              this.walletPayment();
            } else {
              this.messageService.showSuccessToastr(
                'select any payment method'
              );
            }
          },
          error: (error) => {
            this.messageService.showErrorToastr(error.error.message);
          },
        });
    }
  }

  onlinePayment() {
    this.isDisable = true;

    this.userService
      .booking_payment({
        consultation_fee: this.slotDetails.expertId.consultation_fee,
      })
      .subscribe({
        next: (response) => {
          this.razorpayPopUp(response);
        },
        error: (error) => {
          console.error(error.message);
        },
      });
  }

  razorpayPopUp(res:PaymentOrder) {
    const RazorpayOptions:RazorpayOptions = {
      description: 'Agriconnect Razorpay payment',
      currency: 'INR',
      amount: res.fee,
      name: 'agriconnect',
      key: res.key_id,
      order_id: res.order_id,
      image:
        'https://imgs.search.brave.com/bmhZt0Gh9CjW_Wk8CCob0T2V4PS_bHQYW3lfF_Ptlso/rs:fit:500:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzA0LzM3LzM1LzA2/LzM2MF9GXzQzNzM1/MDY3Nl85Y1VibE1k/N29zNnNrZzA0VmE1/dUhhTWY1VFRaaEhX/Zy5qcGc',
      prefill: {
        name: 'agriconnect',
        email: 'devsaytho@gmail.com',
        contact: '8921535373',
      },
      theme: {
        color: '#6466e3',
      },
      modal: {
        ondismiss: () => {
          this.messageService.showWarningToastr('Payment Failed');
        },
      },
      handler: this.paymentSuccess.bind(this),
    };
    const rpz = new window.Razorpay(RazorpayOptions);
    rpz.open();
  }

  paymentSuccess() {
    this.farmer_details.payment_method = 'online_payment';
    this.farmer_details.payment_status = true;
    this.payment();
  }

  walletPayment() {
    this.isDisable = false;
    if (this.userId) {
      this.userService.userDetails({ userId: this.userId }).subscribe({
        next: (Response) => {
          if (Response.wallet) {
            if (Response.wallet < this.slotDetails.adminPaymentAmount) {
              this.messageService.showErrorToastr('Insufficient Balance!');
            } else {
              this.farmer_details.payment_method = 'wallet_payment';
              this.farmer_details.payment_status = true;
              this.payment();
            }
          }
        },
      });
    }
  }

  payment() {
    this.userService.appointmnet_booking(this.farmer_details).subscribe({
      next: (Response) => {
        this.messageService.showSuccessToastr(Response.message);

        this.router.navigate([
          '/user/success_payment',
          this.slotDetails.expertId._id,
        ]);
      },
      error: (error) => {
        console.error(error.error);
        this.messageService.showErrorToastr(error.error.message);
      },
    });
  }
}
