import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../shared/services/user.service';
import { Router } from '@angular/router';
import { MessageToasterService } from '../../../shared/services/message-toaster.service';
import { AutoUnsubscribe } from '../../../core/decorators/auto-usub.decorator';
import { Subscription } from 'rxjs';
import { BookedSlot } from '../../../core/models/slotModel';

@AutoUnsubscribe
@Component({
  selector: 'app-user-next-appointment',
  imports: [CommonModule, FormsModule],
  templateUrl: './user-next-appointment.component.html',
  styleUrl: './user-next-appointment.component.css',
})
export class UserNextAppointmentComponent implements OnInit {
  roomId!: string;
  slotDetails: BookedSlot | null = null;
  link!: string;
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
    if (userId) {
      this.upcomingAppointmentSubscription = this.userService
        .upcoming_appointment({ _id: userId })
        .subscribe({
          next: (Response) => {
            if (!Response) {
              this.slotDetails = null;
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
  }

  checkAppointmentTime() {
    if (this.slotDetails && this.slotDetails.slotId.time) {
      const appointmentDate = new Date(this.slotDetails.slotId.time).getTime();
      const windowStart = appointmentDate - 30 * 60 * 1000;
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
        appointmentId: this.slotDetails!._id,
        roomId: this.roomId,
      })
      .subscribe({
        next: (Response) => {
          if (Response.roomId === this.roomId) {
            this.router.navigate([
              '/user/user_video_call_room',
              this.roomId,
              this.slotDetails!._id,
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
