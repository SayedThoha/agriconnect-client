import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
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
import { CommonModule } from '@angular/common';
import { AutoUnsubscribe } from '../../../core/decorators/auto-usub.decorator';
import { PrescriptionModalComponent } from '../../../shared/prescription-modal/prescription-modal.component';
@AutoUnsubscribe
@Component({
  selector: 'app-expert-booking-details',
  imports: [ReactiveFormsModule, FormsModule, CommonModule,PrescriptionModalComponent,],
  templateUrl: './expert-booking-details.component.html',
  styleUrl: './expert-booking-details.component.css',
})
export class ExpertBookingDetailsComponent implements OnInit {

   @ViewChild(PrescriptionModalComponent) prescriptionModal!: PrescriptionModalComponent;
  payments!: any;
  payments_to_display!: any;
  expertId!: string | null;
  searchForm!: FormGroup;
  consultationForm!: FormGroup;
  prescription_id: string | null = null;

  appoitmentDetailsSubscription!:Subscription

  constructor(
    private messageService: MessageToasterService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private expertService: ExpertService
  ) {}


  ngOnInit(): void {
    this.initialiseForms();
    this.getAppointmentDetails();
    this.consultationForm.get('status')?.valueChanges.subscribe((value) => {
      if (value) this.consultationFormSubmit();
    });
    this.expertId = localStorage.getItem('expertId');
    this.setupSearchSubscription();
  }



  getAppointmentDetails() {
   this.appoitmentDetailsSubscription= this.expertService
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
      this.payments_to_display = this.payments_to_display.filter(
        (appointment: any) =>
          regex.test(appointment.userId.firstName) ||
          regex.test(appointment.userId.lastName) ||
          regex.test(appointment.consultation_status)
      );
    } else {
      this.payments_to_display = this.payments;
    }
  }


  consultationFormSubmit() {
    if (this.consultationForm.valid) {
      const selectedStatus = this.consultationForm.value.status;
      if (selectedStatus === 'all') {
        this.payments_to_display = this.payments;
      } else if (selectedStatus === 'pending') {
        this.payments_to_display = this.payments.filter(
          (item: any) => item.consultation_status === 'pending'
        );
      } else if (selectedStatus === 'consulted') {
        this.payments_to_display = this.payments.filter(
          (item: any) => item.consultation_status === 'consulted'
        );
      } else if (selectedStatus === 'not_consulted') {
        this.payments_to_display = this.payments.filter(
          (item: any) => item.consultation_status === 'not_consulted'
        );
      } else if (selectedStatus === 'cancelled') {
        this.payments_to_display = this.payments.filter(
          (item: any) => item.consultation_status === 'cancelled'
        );
      }
      this.cdr.detectChanges();
    }
  }


  openPrescriptionModal(prescription_id: string | null) {
    console.log('Opening prescription modal with ID:', prescription_id);
    this.prescription_id = prescription_id;
    if (this.prescriptionModal) {
      this.prescriptionModal.prescription_id = prescription_id;
      this.prescriptionModal.get_prescription(); // Fetch prescription details
      this.prescriptionModal.openModal(); // Open the modal
    } else {
      console.error('Prescription modal is not available');
    }
  }
  

}
