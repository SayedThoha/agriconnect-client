import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../shared/services/user.service';
import { Router } from '@angular/router';
import { MessageToasterService } from '../../../shared/services/message-toaster.service';
import { AutoUnsubscribe } from '../../../core/decorators/auto-usub.decorator';
import { Subscription } from 'rxjs';

@AutoUnsubscribe
@Component({
  selector: 'app-user-next-appointment',
  imports: [CommonModule, FormsModule],
  templateUrl: './user-next-appointment.component.html',
  styleUrl: './user-next-appointment.component.css',
})
export class UserNextAppointmentComponent implements OnInit {
  roomId!: any;
  slotDetails!: any;
  link!: any;
  disable = false;
  noAppointmnet = false;

  upcomingAppointmentSubscription!: Subscription;
  constructor(
    private userService: UserService,
    private router: Router,
    private messageService: MessageToasterService
  ) {}

  ngOnInit(): void {
    this.upcomingAppointment();
  }

  upcomingAppointment() {
    const userId = localStorage.getItem('userId');

    this.upcomingAppointmentSubscription = this.userService
      .upcoming_appointment({ _id: userId })
      .subscribe({
        next: (Response) => {
          if (Object.entries(Response).length === 0) {
            this.slotDetails = 0;
          } else {
            this.slotDetails = Response;
            this.checkAppointmentTime();
          }
        },
        error: (error) => {
          this.messageService.showErrorToastr(error.error.message);
        },
      });
  }

  checkAppointmentTime() {
    if (this.slotDetails && this.slotDetails.dateOfBooking) {
      const appointmentDate = new Date(
        this.slotDetails.dateOfBooking
      ).getTime();
      const windowStart = appointmentDate;
      const windowEnd = appointmentDate + 30 * 60 * 1000;
      const currentDate = new Date().getTime();

      if (currentDate >= windowStart && currentDate <= windowEnd) {
        this.disable = false;
      } else {
        this.disable = true;
      }
    }
  }

  enterRoom() {
    this.userService
      .getUpcomingSlot({
        appointmentId: this.slotDetails._id,
        roomId: this.roomId,
      })
      .subscribe({
        next: (Response) => {
          if (Response.roomId === this.roomId) {
            this.router.navigate([
              '/user/user_video_call_room',
              this.roomId,
              this.slotDetails._id,
            ]);
          } else {
            this.messageService.showErrorToastr(
              'InCorrect roomId. Check once more'
            );
          }
        },
        error: (error) => {
          this.messageService.showErrorToastr(error.error.message);
        },
      });
  }

  expert_listing() {
    this.router.navigate(['/user/expert_listing']);
  }
}
