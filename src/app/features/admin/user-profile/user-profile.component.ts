import { Component, OnInit } from '@angular/core';
import { userdata } from '../models/userModel';
import { ActivatedRoute } from '@angular/router';
import { AdminServiceService } from '../services/admin-service.service';
import { MessageToasterService } from '../../../shared/services/message-toaster.service';
import { AutoUnsubscribe } from '../../../core/decorators/auto-usub.decorator';

@Component({
  selector: 'app-user-profile',
  imports: [],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
@AutoUnsubscribe
export class UserProfileComponent implements OnInit {

  userId!:string;
  userdata!:userdata;
  constructor(
    private _route:ActivatedRoute,
    private _adminService:AdminServiceService,
    private _messageService:MessageToasterService,
  ){}

  ngOnInit(){
    this.userId = this._route.snapshot.paramMap.get('id')!;
    this.userDetails()
  }

  userDetails(){
    const data={_id:this.userId}
    this._adminService.userDetails(data).subscribe({
      next:(Response)=>{
        this.userdata=Response
      },
      error:(error)=>{
        this._messageService.showErrorToastr(error.error.message)
      }
    })
  }
}
