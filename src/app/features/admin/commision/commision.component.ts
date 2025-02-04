import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AdminServiceService } from '../services/admin-service.service';
import { MessageToasterService } from '../../../shared/services/message-toaster.service';
import { payOutPattern } from '../../../shared/regexp/regexp';
import { CommonModule } from '@angular/common';
import { AutoUnsubscribe } from '../../../core/decorators/auto-usub.decorator';

@AutoUnsubscribe
@Component({
  selector: 'app-commision',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './commision.component.html',
  styleUrl: './commision.component.css',
})
export class CommisionComponent implements OnInit {
  payOut: string | null | undefined;
  edit = false;
  payOutForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private adminService: AdminServiceService,
    private messageService: MessageToasterService
  ) {}

  ngOnInit(): void {
    

    const adminDetails= localStorage.getItem('admindetails');
    if (adminDetails) {
      try {
        const parsedDetails = JSON.parse(adminDetails); // Parse the JSON string
        this.payOut = parsedDetails.payOut; // Extract only the payOut value
      } catch (error) {
        console.error("Error parsing admin details:", error);
        this.payOut = undefined; // Handle parsing error gracefully
      }
    }

    console.log(this.payOut)
    this.initialiseForms();
  }

  initialiseForms(): void {
    this.payOutForm = this.formBuilder.group({
      payOut: [
        this.payOut,
        [Validators.required, Validators.pattern(payOutPattern)],
      ],
    });
  }

  Submit() {
    this.edit = !this.edit;
    this.payOut = this.payOutForm.value.payOut;
    this.adminService.editpayOut({ payOut: this.payOut }).subscribe({
      next: (Response) => {
        this.messageService.showSuccessToastr(Response.message);
      },
      error: (error) => {
        this.messageService.showErrorToastr(error.message.message);
      },
    });
  }
}
