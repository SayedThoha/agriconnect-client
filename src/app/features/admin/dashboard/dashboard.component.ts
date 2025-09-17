import { Component, OnInit } from '@angular/core';
import { AdminServiceService } from '../services/admin-service.service';
import { MessageToasterService } from '../../../shared/services/message-toaster.service';
import { ChartData, ChartOptions } from '../../../core/models/commonModel';
import { ChartModule } from 'primeng/chart';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AutoUnsubscribe } from '../../../core/decorators/auto-usub.decorator';
import { Subscription } from 'rxjs';
import { IBookedSlot } from '../models/dashboardModel';

@AutoUnsubscribe
@Component({
  selector: 'app-dashboard',
  imports: [
    ChartModule,
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  data!: ChartData;
  options!: ChartOptions;
  revenue!: number;
  booked_Slots!: IBookedSlot[];
  total_revenue!: number;
  total_users!: number;
  total_experts!: number;
  total_booking!: number;
  total_upcoming_booking!: number;
  total_consulted_bookings!: number;
  total_not_consulted_bookings!: number;
  total_cancelled_bookings!: number;
  graph_data_based_on = 'weekly';

  dashBoardSubscription!: Subscription;
  constructor(
    private adminService: AdminServiceService,
    private messageService: MessageToasterService
  ) {}

  ngOnInit() {
    this.get_Slot_Details();
  }

  updateGraphDetails() {
    this.graph_details(this.graph_data_based_on);
  }

  get_Slot_Details() {
    this.dashBoardSubscription = this.adminService
      .get_admin_dashboard_details()
      .subscribe({
        next: (Response) => {
          this.booked_Slots = Response.slotDetails;
          this.total_users = Response.user_count;
          this.total_experts = Response.expert_count;
          this.get_dashboard_display_contents();
          this.graph_details(this.graph_data_based_on);
        },
        error: (error) => {
          this.messageService.showErrorToastr(error.error.message);
        },
      });
  }

  get_dashboard_display_contents() {
    this.total_revenue = this.booked_Slots.reduce(
      (acc: number, data: IBookedSlot) => {
        if (
          data.consultation_status === 'consulted' &&
          typeof data.slotId !== 'string'
        ) {
          return acc + data.slotId.adminPaymentAmount;
        }
        return acc;
      },
      0
    );

    this.total_upcoming_booking = this.booked_Slots.reduce(
      (acc: number, data: IBookedSlot) => {
        if (data.consultation_status === 'pending') {
          return acc + 1;
        }
        return acc;
      },
      0
    );
    this.total_booking = this.booked_Slots.reduce(
      (acc: number, data: IBookedSlot) => {
        if (
          data.consultation_status === 'pending' ||
          data.consultation_status === 'consulted'
        ) {
          return acc + 1;
        }
        return acc;
      },
      0
    );

    this.total_consulted_bookings = this.booked_Slots.reduce(
      (acc: number, data: IBookedSlot) => {
        if (data.consultation_status === 'consulted') {
          return acc + 1;
        }
        return acc;
      },
      0
    );
    this.total_not_consulted_bookings = this.booked_Slots.reduce(
      (acc: number, data: IBookedSlot) => {
        if (data.consultation_status === 'not_consulted') {
          return acc + 1;
        }
        return acc;
      },
      0
    );
    this.total_cancelled_bookings = this.booked_Slots.reduce(
      (acc: number, data: IBookedSlot) => {
        if (data.consultation_status === 'cancelled') {
          return acc + 1;
        }
        return acc;
      },
      0
    );
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

    this.booked_Slots.forEach((slot: IBookedSlot) => {
      const day = new Date(slot.created_time).getDay();
      const dayIndex = (day + 6) % 7;
      weeklyData.bookings[dayIndex]++;
      if (slot.consultation_status === 'consulted') {
        weeklyData.consulted[dayIndex]++;
      } else if (slot.consultation_status === 'cancelled') {
        weeklyData.cancelled[dayIndex]++;
      } else if (slot.consultation_status === 'not-consulted') {
        weeklyData.notConsulted[dayIndex]++;
      }
    });
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
    const monthlyData = {
      labels: monthsOfYear,
      bookings: new Array(12).fill(0),
      consulted: new Array(12).fill(0),
      cancelled: new Array(12).fill(0),
      notConsulted: new Array(12).fill(0),
    };

    this.booked_Slots.forEach((slot: IBookedSlot) => {
      const month = new Date(slot.created_time).getMonth();
      monthlyData.bookings[month]++;
      if (slot.consultation_status === 'consulted') {
        monthlyData.consulted[month]++;
      } else if (slot.consultation_status === 'cancelled') {
        monthlyData.cancelled[month]++;
      } else if (slot.consultation_status === 'not-consulted') {
        monthlyData.notConsulted[month]++;
      }
    });
    return monthlyData;
  }
}
