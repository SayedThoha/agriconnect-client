import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
  selector: 'app-appointment-history',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './appointment-history.component.html',
  styleUrl: './appointment-history.component.css',
})
export class AppointmentHistoryComponent implements OnInit {
  appointments!: AppointMent[];
  appointments_to_display!: AppointMent[];
  searchForm!: FormGroup;
  consultationForm!: FormGroup;

  appointMentSubscription!: Subscription;

  constructor(
    private adminService: AdminServiceService,
    private messageService: MessageToasterService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.initialiseForms();
    this.getAppointmentDetails();
    this.consultationForm.get('status')?.valueChanges.subscribe((value) => {
      if (value) this.consultationFormSubmit();
    });
    this.setupSearchSubscription();
  }

  getAppointmentDetails() {
    this.appointMentSubscription = this.adminService
      .getAppointment()
      .subscribe({
        next: (Response) => {
          this.appointments = Response;
          this.appointments_to_display = this.appointments;
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

    this.consultationForm = this.formBuilder.group({
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
      this.appointments_to_display = this.appointments_to_display.filter(
        (appointment: AppointMent) =>
          regex.test(appointment.userId.firstName) ||
          regex.test(appointment.userId.lastName) ||
          regex.test(appointment.expertId.firstName) ||
          regex.test(appointment.expertId.lastName) ||
          regex.test(appointment.consultation_status)
      );
    } else {
      this.appointments_to_display = this.appointments;
    }
  }

  consultationFormSubmit() {
    if (this.consultationForm.valid) {
      const selectedStatus = this.consultationForm.value.status;

      if (selectedStatus === 'all') {
        this.appointments_to_display = this.appointments;
      } else if (selectedStatus === 'pending') {
        this.appointments_to_display = this.appointments.filter(
          (item: { consultation_status: string }) =>
            item.consultation_status === 'pending'
        );
      } else if (selectedStatus === 'consulted') {
        this.appointments_to_display = this.appointments.filter(
          (item: { consultation_status: string }) =>
            item.consultation_status === 'consulted'
        );
      } else if (selectedStatus === 'not_consulted') {
        this.appointments_to_display = this.appointments.filter(
          (item: { consultation_status: string }) =>
            item.consultation_status === 'not_consulted'
        );
      } else if (selectedStatus === 'cancelled') {
        this.appointments_to_display = this.appointments.filter(
          (item: { consultation_status: string }) =>
            item.consultation_status === 'cancelled'
        );
      }
      this.cdr.detectChanges();
    }
  }
}
