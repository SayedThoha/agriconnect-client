import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { MessageToasterService } from '../../../shared/services/message-toaster.service';
import { ExpertService } from '../../../shared/services/expert.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { CalendarModule } from 'primeng/calendar';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'app-slot-adding',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    TableModule,
    ScrollPanelModule,
    CalendarModule,
    DatePickerModule
  ],
  templateUrl: './slot-adding.component.html',
  styleUrl: './slot-adding.component.css',
  
})
export class SlotAddingComponent implements OnInit {
  date!: Date;
  minDate!: Date;
  maxDate!: Date;
  slots: any[] = [];
  clickedSlots: any = [];
  preSelected_slots: any[] = [];
  slots_for_display: any[] = [];
  existingSlots: any[] = [];
  expertId: any = [];

  constructor(
    private messageservice: MessageToasterService,
    private expertService: ExpertService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    this.expertId = localStorage.getItem('expertId');
    let today = new Date();
    this.minDate = new Date();
    this.maxDate = new Date(today.setMonth(today.getMonth() + 1));
    this.date = new Date();
    this.getSlots();
  
  }

  getSlots() {
    this.expertService.getSlots({ _id: this.expertId }).subscribe({
      next: (Response) => {
       
        this.slots = Response;
        
        this.sort_slots()
        this.onDateChange(this.date);
        
      },
      error: (error) => {
        console.log(error.error.message);
      },
    });
  }

  onDateChange(event: any) {
    this.date = event;
    this.generateISO8601Dates(this.date);
    // console.log('onDateChange', event);
    this.removeExistingSlots();
  }

  addSlots(time: string, index: number) {
  
    if (!this.date) {
      this.messageservice.showErrorToastr('select any date!!');
    } else {
      const data = { time: time, _id: this.expertId }; 
    
      this.expertService.addSlots(data).subscribe({
        next: (Response) => {
          // console.log('API Response:', Response);
        
          this.messageservice.showSuccessToastr('slot added');
          
        
          // this.slots = [...this.slots, Response.data]; 
          this.slots.push(Response.data);
          
          this.slots_for_display.splice(index, 1);
          this.sort_slots();
        
          // this.cdr.detectChanges();
          

        },error: (error) => {
          this.messageservice.showErrorToastr(error.error.message);
        },
      });
    }
  }

  generateISO8601Dates(inputDate: any) {
    const baseDate = new Date(inputDate);
    this.slots_for_display = [];

    // Set time to 9:00 AM if before
    if (baseDate.getHours() < 9) {
      baseDate.setHours(9, 0, 0, 0);
    } else {
      let minutes = baseDate.getMinutes();
      if (minutes > 0 && minutes <= 30) {
        baseDate.setMinutes(30);
      } else if (minutes > 30) {
        baseDate.setHours(baseDate.getHours() + 1);
        baseDate.setMinutes(0);
      } else {
        baseDate.setMinutes(0);
      }
      baseDate.setSeconds(0);
      baseDate.setMilliseconds(0);
    }
    let currentTime = baseDate;
    while (
      currentTime.getHours() < 20 ||
      (currentTime.getHours() === 20 && currentTime.getMinutes() <= 30)
    ) {
      this.slots_for_display.push(currentTime.toISOString());
      currentTime = new Date(currentTime.getTime() + 30 * 60000);
    }
    this.removeExistingSlots();
  }

  removeExistingSlots(): void {
    // Ensure existingSlots is up-to-date
    this.existingSlots = this.slots.map((slot: { time: any }) => slot.time);

    // Filter out existing slots from slots_for_display
    this.slots_for_display = this.slots_for_display.filter(
      (slotDate: string) => {
        return !this.existingSlots.includes(slotDate);
      }
    );
  }

  remove_slot(slot: any, i: number) {
    // console.log('date in display while removing slot:', this.date);
    // console.log('slot date while removing:', slot.time);
    this.expertService.removeSlot({ _id: slot._id }).subscribe({
      next: (Response) => {
        this.messageservice.showSuccessToastr(Response.message);
        this.slots.splice(i, 1);
        // Normalize `this.date` to UTC midnight
        const displayDate = new Date(
          Date.UTC(
            this.date.getFullYear(),
            this.date.getMonth(),
            this.date.getDate()
          )
        )
          .toISOString()
          .split('T')[0]; // yyyy-MM-dd
        const slotDate = new Date(slot.time).toISOString().split('T')[0]; // yyyy-MM-dd
        if (slotDate === displayDate) {
          this.slots_for_display.push(slot.time);
          this.sort_slots_for_display();
          this.cdr.detectChanges(); // Trigger change detection after modifying the array
        }
      },
      error: (error) => {
        this.messageservice.showErrorToastr(error.error.message);
      },
    });
  }

  sort_slots_for_display() {
    this.slots_for_display.sort((a: any, b: any) => {
      return new Date(a).getTime() - new Date(b).getTime();
    });
  }

  sort_slots() {
    this.slots.sort((a: any, b: any) => {
      return new Date(a.time).getTime() - new Date(b.time).getTime();
    });
    // console.log('slots length:', this.slots.length);
  }

  defaultSlots() {
    if (this.slots_for_display.length === 0) {
      this.messageservice.showErrorToastr('No slots available');
    } else {
      this.expertService
        .add_all_slots({
          slots: this.slots_for_display,
          expertId: this.expertId,
        })
        .subscribe({
          next: (Response) => {
            this.messageservice.showSuccessToastr('Slots added successfully');
            this.slots.push(...Response);
            
            this.sort_slots();
            this.slots_for_display = [];
            
          },
          error: (error) => {
            this.messageservice.showErrorToastr(error.error.message);
          },
        });
    }
  }


}


