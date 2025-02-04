import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PrescriptionModalComponent } from '../../../shared/prescription-modal/prescription-modal.component';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from '../../../shared/services/user.service';
import { MessageToasterService } from '../../../shared/services/message-toaster.service';
import { debounceTime } from 'rxjs';
import { AutoUnsubscribe } from '../../../core/decorators/auto-usub.decorator';
@AutoUnsubscribe
@Component({
  selector: 'app-booking-details',
  imports: [
    PrescriptionModalComponent,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './booking-details.component.html',
  styleUrl: './booking-details.component.css',
})
export class BookingDetailsComponent implements OnInit {
  userId!: any;
  appointments!: any;
  appointments_to_display!: any;
  searchForm!: FormGroup;
  consultationForm!: FormGroup;

  constructor(
    private userService: UserService,
    private messageService: MessageToasterService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initialiseForms();
    this.getAppointmentDetails();
    this.setupSearchSubscription();
    
  }

  getAppointmentDetails() {
    const userId = localStorage.getItem('userId');
    this.userService.get_booking_details_of_user({ userId: userId }).subscribe({
      next: (Response) => {
        this.appointments = Response;
        this.appointments_to_display = this.appointments;
      },
      error: (error) => {
        this.messageService.showErrorToastr(error.error.message);
      },
    });
  }

 
  openPrescriptionModal(prescription_id: string | null) {
    prescription_id = '66b43fa6725d8689a520191f';
    console.log('Opening prescription modal with ID:', prescription_id);
    const modal = document.querySelector(
      'app-prescription-modal'
    ) as unknown as PrescriptionModalComponent;
    if (modal) {
      modal.prescription_id = prescription_id;
      if (prescription_id) {
        modal.openModal;
      } else {
        console.error('Invalid prescription ID:', prescription_id);
      }
    }
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
      ?.valueChanges.pipe(debounceTime(300)) // Adjust debounce time as needed
      .subscribe((value) => {
        this.filterExperts(value);
      });
  }

  filterExperts(searchTerm: string | null) {
    if (searchTerm) {
      const regex = new RegExp(searchTerm, 'i');
      this.appointments_to_display = this.appointments_to_display.filter(
        (appointment: any) =>
          regex.test(appointment.userId.firstName) ||
          regex.test(appointment.userId.lastName) ||
          regex.test(appointment.expertId.firstName) ||
          regex.test(appointment.expertId.lastName)
      );
    } else {
      this.appointments_to_display = this.appointments;
    }
  }

  consultationFormSubmit() {
    if (this.consultationForm.valid) {
      const selectedStatus = this.consultationForm.value.status;
      if (selectedStatus == 'all') {
        this.appointments_to_display = this.appointments;
      } else if (selectedStatus == 'pending') {
        this.appointments_to_display = this.appointments.filter(
          (item: { consultation_status: string }) =>
            item.consultation_status == 'pending'
        );
      } else if (selectedStatus == 'consulted') {
        this.appointments_to_display = this.appointments.filter(
          (item: { consultation_status: string }) =>
            item.consultation_status == 'consulted'
        );
      } else if (selectedStatus == 'not_consulted') {
        this.appointments_to_display = this.appointments.filter(
          (item: { consultation_status: string }) =>
            item.consultation_status == 'not_consulted'
        );
      } else if (selectedStatus == 'cancelled') {
        this.appointments_to_display = this.appointments.filter(
          (item: { consultation_status: string }) =>
            item.consultation_status == 'cancelled'
        );
      }
      this.cdr.detectChanges();
    }
  }

  changeStatus(data: any) {
    const slotId = data.slotId._id;
    this.userService.cancelSlot({ slotId: slotId }).subscribe({
      next: (Response) => {
        this.messageService.showSuccessToastr(Response.message);
        this.updateInTable(slotId);
      },
      error: (error) => {
        console.log('error:', error.error);
        this.messageService.showErrorToastr(error.error.message);
      },
    });
  }

  updateInTable(slotId: any) {
    this.appointments_to_display = this.appointments_to_display.map(
      (item: { slotId: any; consultation_status: string }) => {
        if (item.slotId._id === slotId) {
          item.consultation_status = 'cancelled';
        }
        return item;
      }
    );
    this.cdr.detectChanges();
  }
}
