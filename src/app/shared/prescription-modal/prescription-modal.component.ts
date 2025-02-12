import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ExpertService } from '../services/expert.service';
import { MessageToasterService } from '../services/message-toaster.service';
import { UserService } from '../services/user.service';
import { CommonService } from '../services/common.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AutoUnsubscribe } from '../../core/decorators/auto-usub.decorator';

@Component({
  selector: 'app-prescription-modal',
  imports: [CommonModule,FormsModule],
  templateUrl: './prescription-modal.component.html',
  styleUrl: './prescription-modal.component.css'
})
@AutoUnsubscribe
export class PrescriptionModalComponent implements OnInit,OnChanges {

  @Input() 
  prescription_id: string | null = null;
  modal!: { _id: string; };
  auth!:string
  issue!:string
  prescription_note!:string

  constructor(
    private commonService:CommonService,
    private userService:UserService,
    private expertService:ExpertService,
    private messageService:MessageToasterService
  ){}

  
  ngOnInit(): void {
    // console.log('modal component loads');
    
    this.auth=this.commonService.getAuthFromLocalStorage()
    this.get_prescription()
  }

  ngOnChanges(changes: SimpleChanges) {
    // Ensure the modal opens only when prescription_id changes
    if (changes['prescription_id'] && this.prescription_id) {
      this.get_prescription();
      this.openModal();
    }
  }

  get_prescription(){
    this.auth = this.commonService.getAuthFromLocalStorage();
    if(this.auth==='user' && this.prescription_id){
      // console.log("prescription_id",this.prescription_id)
      this.userService.get_prescription_details({_id:this.prescription_id}).subscribe({
        next:(Response)=>{
          this.issue=Response.issue
          this.prescription_note=Response.prescription
        },error:(error)=>{
          this.messageService.showErrorToastr(error.error.message)
        }
      })
    }

    if(this.auth==='expert' && this.prescription_id){
      // console.log("prescription_id",this.prescription_id)
      this.expertService.get_prescription_details({_id:this.prescription_id}).subscribe({
        next:(Response)=>{
          this.issue=Response.issue
          this.prescription_note=Response.prescription
        },error:(error)=>{
          this.messageService.showErrorToastr(error.error.message)
        }
      })
    }
  }

  openModal() {
    const modal = document.getElementById('prescription-modal');
    if (modal) {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    }
  }

  closeModal() {
    const modal = document.getElementById('prescription-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  }
}
