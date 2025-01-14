import { Component, OnInit } from '@angular/core';
import { kyc_verification } from '../models/expertModel';
import { AdminServiceService } from '../services/admin-service.service';
import { MessageToasterService } from '../../../shared/services/message-toaster.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-kyc',
  imports: [CommonModule,FormsModule,RouterModule],
  templateUrl: './kyc.component.html',
  styleUrl: './kyc.component.css'
})
export class KycComponent implements OnInit{

  kycdatas!:kyc_verification[]

  constructor(
    private _adminService:AdminServiceService,
    private _messageService:MessageToasterService
  ){}

  
  ngOnInit(){
    this.kycData()
  }

  kycData(){
    this._adminService.kycdata().subscribe({
      next:(Response)=>{
        this.kycdatas=Response
      },
      error:(error)=>{
        this._messageService.showErrorToastr(error.error.message)
      }
    })
  }

}
