import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ChartModule } from 'primeng/chart';
import { ExpertService } from '../../../shared/services/expert.service';
import { MessageToasterService } from '../../../shared/services/message-toaster.service';
import { AutoUnsubscribe } from '../../../core/decorators/auto-usub.decorator';
@AutoUnsubscribe
@Component({
  selector: 'app-expert-dashboard',
  imports: [
    ChartModule,
    RouterModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './expert-dashboard.component.html',
  styleUrl: './expert-dashboard.component.css',
})
export class ExpertDashboardComponent implements OnInit {
  data!: any;
  options!: any;
  revenue!: number;
  booked_Slots!: any;
  total_revenue!: number;
  total_users!: number;
  total_booking!: number;
  total_upcoming_booking!: number;
  total_consulted_bookings!: number;
  total_not_consulted_bookings!: number;
  total_cancelled_bookings!: number;
  graph_data_based_on: string = 'weekly';
  total_upcoming_booking_count!:number

  constructor(
    private expertService: ExpertService,
    private messageService: MessageToasterService
  ) {}

  ngOnInit() {
    this.get_Slot_Details();
  }

  updateGraphDetails() {
    this.graph_details(this.graph_data_based_on);
  }

  get_Slot_Details() {
    // console.log('  client side');
    const expertId = localStorage.getItem('expertId');
    this.expertService
      .get_expert_dashboard_details({ expertId: expertId })
      .subscribe({
        next: (Response) => {
          console.log("dashboard details",Response)
          this.booked_Slots = Response;
          this.get_dashboard_display_contents();
          this.graph_details(this.graph_data_based_on);
        },
        error: (error) => {
          this.messageService.showErrorToastr(error.error.message);
        },
      });
  }

  get_dashboard_display_contents() {
    this.total_revenue = this.booked_Slots.reduce((acc: number, data: any) => {
      if (
        data.consultation_status === 'consulted' ||
        data.consultation_status === 'not_consulted'
      ) {
        return (
          acc + (data.slotId.bookingAmount - data.slotId.adminPaymentAmount)
        );
      }
      return acc;
    }, 0);
    this.total_upcoming_booking = this.booked_Slots.reduce(
      (acc: number, data: any) => {
        if (data.consultation_status === 'pending') {
          return (
            acc + (data.slotId.bookingAmount - data.slotId.adminPaymentAmount)
          );
        }
        return acc;
      },
      0
    );
    const users = new Set(
      this.booked_Slots.map((item: any) => item.userId.toString())
    );
    this.total_users = users.size;
    this.total_booking = this.booked_Slots.reduce((acc: number, data: any) => {
      if (
        data.consultation_status == 'pending' ||
        data.consultation_status == 'consulted'
      ) {
        return acc + 1;
      }
      return acc;
    }, 0);

    this.total_consulted_bookings = this.booked_Slots.reduce(
      (acc: number, data: any) => {
        if (data.consultation_status === 'consulted') {
          return acc + 1;
        }
        return acc;
      },
      0
    );
    this.total_not_consulted_bookings = this.booked_Slots.reduce(
      (acc: number, data: any) => {
        if (data.consultation_status === 'not_consulted') {
          return acc + 1;
        }
        return acc;
      },
      0
    );
    this.total_cancelled_bookings = this.booked_Slots.reduce(
      (acc: number, data: any) => {
        if (data.consultation_status === 'cancelled') {
          return acc + 1;
        }
        return acc;
      },
      0
    );

     // Calculate the number of upcoming bookings
  this.total_upcoming_booking_count = this.booked_Slots.filter(
    (data: any) => data.consultation_status === 'pending'
  ).length;
  }

  graph_details(graph_data_based_on: string) {
    if (!this.booked_Slots) {
      this.messageService.showErrorToastr(
        'Error in fetching slot details from server'
      );
      return;
    }
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--text-color-secondary'
    );
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
    // const processedData = this.processMonthlyData();
    let processedData;
    if (graph_data_based_on === 'weekly') {
      processedData = this.processWeeklyData();
    } else {
      processedData = this.processMonthlyData();
    }
    this.data = {
      labels: processedData.labels,
      datasets: [
        {
          type: 'line',
          label: 'Bookings',
          borderColor: documentStyle.getPropertyValue('--blue-500'),
          borderWidth: 2,
          fill: false,
          tension: 0.4,
          data: processedData.bookings,
        },
        {
          type: 'bar',
          label: 'Consulted',
          backgroundColor: documentStyle.getPropertyValue('--green-500'),
          data: processedData.consulted,
          borderColor: 'white',
          borderWidth: 2,
        },
        {
          type: 'bar',
          label: 'Cancelled',
          backgroundColor: documentStyle.getPropertyValue('--orange-500'),
          data: processedData.cancelled,
        },
        {
          type: 'bar',
          label: 'Not Consulted',
          backgroundColor: documentStyle.getPropertyValue('--red-500'),
          data: processedData.notConsulted,
        },
      ],
    };

    this.options = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
        },
        y: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
        },
      },
    };
  }
  processWeeklyData() {
    const daysOfWeek = [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ];
    const weeklyData = {
      labels: daysOfWeek,
      bookings: new Array(7).fill(0),
      consulted: new Array(7).fill(0),
      cancelled: new Array(7).fill(0),
      notConsulted: new Array(7).fill(0),
    };

    this.booked_Slots.forEach((slot: any) => {
      const day = new Date(slot.created_time).getDay(); // Get day of the week (0-6, 0 is Sunday)
      const dayIndex = (day + 6) % 7; // Adjust to (0-6, 0 is Monday)

      weeklyData.bookings[dayIndex]++;
      if (slot.consultation_status === 'consulted') {
        weeklyData.consulted[dayIndex]++;
      } else if (slot.consultation_status === 'cancelled') {
        weeklyData.cancelled[dayIndex]++;
      } else if (slot.consultation_status === 'not-consulted') {
        weeklyData.notConsulted[dayIndex]++;
      }
    });
    // console.log('weeklyData:', weeklyData);

    return weeklyData;
  }
  processMonthlyData() {
    const monthsOfYear = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    // console.log('bookedSlots:',this.booked_Slots);
    const monthlyData = {
      labels: monthsOfYear,
      bookings: new Array(12).fill(0),
      consulted: new Array(12).fill(0),
      cancelled: new Array(12).fill(0),
      notConsulted: new Array(12).fill(0),
    };

    this.booked_Slots.forEach((slot: any) => {
      const month = new Date(slot.created_time).getMonth(); // Get month (0-11)
      monthlyData.bookings[month]++;
      if (slot.consultation_status === 'consulted') {
        monthlyData.consulted[month]++;
      } else if (slot.consultation_status === 'cancelled') {
        monthlyData.cancelled[month]++;
      } else if (slot.consultation_status === 'not-consulted') {
        monthlyData.notConsulted[month]++;
      }
    });
    // console.log(monthlyData);
    return monthlyData;
  }
}
