import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../../shared/header/header.component';
import { MessageToasterService } from '../../../shared/services/message-toaster.service';
import { UserService } from '../../../shared/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { expertData } from '../../admin/models/expertModel';
import { ConfirmationModalComponent } from '../../../shared/confirmation-modal/confirmation-modal.component';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { CapitaliseFirstPipe } from '../../../shared/pipes/capitalise-first.pipe';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { DatePickerModule } from 'primeng/datepicker';
import { AutoUnsubscribe } from '../../../core/decorators/auto-usub.decorator';
import { Subscription } from 'rxjs';

@AutoUnsubscribe
@Component({
  selector: 'app-user-expert-profile',
  imports: [
    HeaderComponent,
    ConfirmationModalComponent,
    FooterComponent,
    CapitaliseFirstPipe,
    FormsModule,
    CommonModule,
    ScrollPanelModule,
    DatePickerModule,
  ],
  templateUrl: './user-expert-profile.component.html',
  styleUrl: './user-expert-profile.component.css',
})
export class UserExpertProfileComponent implements OnInit {
  expertId!: string | null;
  expert!: expertData;
  slots: any[] = [];
  date!: Date;
  minDate!: Date;
  maxDate!: Date;
  slots_for_display: any[] = [];
  userId!: string | null;
  selectedTab = 'about';
  showModal = false;
  selectedSlot: any;

  expertDetailsSubscription!: Subscription;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private messageService: MessageToasterService
  ) {}

  ngOnInit(): void {
    this.date = new Date();
    this.userId = localStorage.getItem('userId');
    this.expertId = this.route.snapshot.paramMap.get('id');
    this.getExpertDetails(this.expertId);
    this.getSlots(this.expertId);
  }

  getSlotsForDisplay(date: any) {
    const selectedDate = new Date(date.setHours(0, 0, 0, 0));
    this.slots_for_display = this.slots.filter((slot: any) => {
      const DateinSlot = new Date(slot.time);
      const midnightDateinSlot = new Date(DateinSlot.setHours(0, 0, 0, 0));
      return midnightDateinSlot.getTime() === selectedDate.getTime();
    });
  }

  getExpertDetails(data: string | null) {
    this.expertDetailsSubscription = this.userService
      .getExpertDetails({ _id: data })
      .subscribe({
        next: (Response) => {
          this.expert = Response;
        },
        error: (error) => {
          this.messageService.showErrorToastr(error.error.message);
        },
      });
  }

  getSlots(expertId: any) {
    this.userService.getSlots({ _id: expertId }).subscribe({
      next: (Response) => {
        this.slots = Response;
        if (this.slots.length > 0) {
          this.minDate = new Date(this.slots[0].time);
          this.maxDate = new Date(this.slots[this.slots.length - 1].time);

          this.getSlotsForDisplay(this.date);
        }
      },
      error: (error) => {
        this.messageService.showErrorToastr(error.error.message);
      },
    });
  }

  confirmSlot(slot: any) {
    this.selectedSlot = slot;
    this.showModal = true;
  }

  onConfirmSlot() {
    localStorage.setItem('slotId', this.selectedSlot._id);
    this.router.navigate(['/user/appoinment_booking']);
  }

  onCancelSlot() {
    this.showModal = false;
  }

  slotBook(id: any) {
    this.userService
      .addSlot({ _id: id, expertId: this.expertId, userId: this.userId })
      .subscribe({
        next: () => {
          this.messageService.showSuccessToastr('booking Confirmed.');
        },
      });
  }

  chat() {
    this.router.navigate(['/user/userchat']);
  }

  selectTab(tab: string): void {
    this.selectedTab = tab;
  }
}
