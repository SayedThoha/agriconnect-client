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
import { ExpertService } from '../../../shared/services/expert.service';
import { roomIdPattern } from '../../../shared/regexp/regexp';
import { CommonModule } from '@angular/common';
import { AutoUnsubscribe } from '../../../core/decorators/auto-usub.decorator';
import { Subscription } from 'rxjs';
import { BookedSlot } from '../../../core/models/slotModel';

@AutoUnsubscribe
@Component({
  selector: 'app-next-appointment',
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './next-appointment.component.html',
  styleUrl: './next-appointment.component.css',
})
export class NextAppointmentComponent implements OnInit {
  disable = false;
  roomId: string | null | undefined = '';
  upcoming_appointment: BookedSlot | null = null;
  roomIdForm!: FormGroup;

  nextAppointmentSubscription!: Subscription;
  constructor(
    private router: Router,
    private messageService: MessageToasterService,
    private expertService: ExpertService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initialiseForms();
    this.upcomingAppointment();
  }

  upcomingAppointment() {
    const expertId = localStorage.getItem('expertId');
    if (expertId) {
      this.nextAppointmentSubscription = this.expertService
        .upcomingAppointment({ expertId: expertId })
        .subscribe({
          next: (Response) => {
            if (!Response) {
              this.upcoming_appointment = null;
            } else {
              this.upcoming_appointment = Response;
              this.checkAppointmentTime();
            }
          },
          error: (error) => {
            this.messageService.showErrorToastr(error.error.message);
          },
        });
    }
  }
  checkAppointmentTime() {
    if (this.upcoming_appointment && this.upcoming_appointment.slotId.time) {
      const appointmentDate = new Date(
        this.upcoming_appointment.slotId.time
      ).getTime();

      const windowStart = appointmentDate - 60 * 60 * 1000;
      const windowEnd = appointmentDate + 30 * 60 * 1000;
      const currentDate = new Date().getTime();

      if (currentDate >= windowStart && currentDate <= windowEnd) {
        this.roomIdForm.get('roomId')?.enable();
      } else {
        this.roomIdForm.get('roomId')?.disable();
      }
    }
  }

  initialiseForms(): void {
    this.roomIdForm = this.formBuilder.group({
      roomId: [
        { value: '', disabled: true },
        [Validators.required, Validators.pattern(roomIdPattern)],
      ],
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

  roomIdFormSubmit() {
    if (this.roomIdForm.invalid) {
      this.markFormGroupTouched(this.roomIdForm);
      return;
    } else {
      this.roomId = this.roomIdForm.value.roomId;

      this.enterRoom();
    }
  }

  enterRoom() {
    this.expertService
      .share_roomId_through_email({
        roomId: this.roomId as string,
        slotId: this.upcoming_appointment!._id,
      })
      .subscribe({
        next: (Response) => {
          this.messageService.showSuccessToastr(Response.message);
        },
        error: (error) => {
          this.messageService.showErrorToastr(error.error.message);
        },
      });
    if (this.roomId) {
      this.router.navigate([
        '/expert/expert_video_call_room',
        this.roomId,
        this.upcoming_appointment!._id,
      ]);
    } else {
      this.messageService.showErrorToastr('enter the roomId');
    }
  }

  generateRoomId() {
    const timestamp = Date.now().toString(36);
    const randomString = Math.random().toString(36).substr(2, 8);
    this.roomId = `${timestamp}-${randomString}`;
  }
}
