import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../shared/services/user.service';
import { MessageToasterService } from '../../../shared/services/message-toaster.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-user-prescription-history',
  imports: [CommonModule, FormsModule, TableModule],
  templateUrl: './user-prescription-history.component.html',
  styleUrl: './user-prescription-history.component.css',
})
export class UserPrescriptionHistoryComponent implements OnInit {
  prescription!: any;
  prescription_to_display!: any;
  constructor(
    private messageService: MessageToasterService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userService
      .prescription_history({ userId: localStorage.getItem('userId') })
      .subscribe({
        next: (response) => {
          this.prescription = response;
          this.prescription_to_display = this.prescription;
        },
        error: (error) => {
          this.messageService.showErrorToastr(error.error.message);
        },
      });
  }

  showDetails(prescription: any) {}
}
