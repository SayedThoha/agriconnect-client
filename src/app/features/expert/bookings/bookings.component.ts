import { Component, OnInit } from '@angular/core';
import { MessageToasterService } from '../../../shared/services/message-toaster.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ExpertService } from '../../../shared/services/expert.service';
import { debounceTime, Subscription } from 'rxjs';
import { HeaderComponent } from '../../../shared/header/header.component';
import { CommonModule } from '@angular/common';
import { AutoUnsubscribe } from '../../../core/decorators/auto-usub.decorator';
import { BookedSlot } from '../../../core/models/slotModel';
import { AppointmentCodePipe } from '../../../shared/pipes/appointment-code.pipe';
@AutoUnsubscribe
@Component({
  selector: 'app-bookings',
  imports: [
    HeaderComponent,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AppointmentCodePipe,
  ],
  templateUrl: './bookings.component.html',
  styleUrl: './bookings.component.css',
})
export class BookingsComponent implements OnInit {
  payments!: BookedSlot[];
  payments_to_display!: BookedSlot[];
  expertId!: string | null;
  searchForm!: FormGroup;
  appoinmentDetailsSubscription!: Subscription;
  constructor(
    private messageService: MessageToasterService,
    private formBuilder: FormBuilder,
    private expertService: ExpertService
  ) {}

  ngOnInit(): void {
    this.initialiseForms();
    this.getAppointmentDetails();

    this.expertId = localStorage.getItem('expertId');
    this.setupSearchSubscription();
  }

  getAppointmentDetails() {
    const expertId = localStorage.getItem('expertId');
    if (expertId) {
      this.appoinmentDetailsSubscription = this.expertService
        .get_bookings_of_expert({ expertId: expertId })
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
          regex.test(appointment.userId.firstName) ||
          regex.test(appointment.userId.lastName) ||
          regex.test(appointment.consultation_status)
      );
    } else {
      this.payments_to_display = this.payments;
    }
  }
}
