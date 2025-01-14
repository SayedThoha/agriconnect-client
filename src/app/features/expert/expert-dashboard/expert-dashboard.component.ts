import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ChartModule } from 'primeng/chart';
import { ExpertService } from '../../../shared/services/expert.service';
import { MessageToasterService } from '../../../shared/services/message-toaster.service';

@Component({
  selector: 'app-expert-dashboard',
  imports: [ChartModule,RouterModule,CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './expert-dashboard.component.html',
  styleUrl: './expert-dashboard.component.css',
})
export class ExpertDashboardComponent  {



}
