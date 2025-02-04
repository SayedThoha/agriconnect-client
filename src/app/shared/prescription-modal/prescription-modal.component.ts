import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ExpertService } from '../services/expert.service';
import { MessageToasterService } from '../services/message-toaster.service';
import { UserService } from '../services/user.service';
import { CommonService } from '../services/common.service';

@Component({
  selector: 'app-prescription-modal',
  imports: [],
  templateUrl: './prescription-modal.component.html',
  styleUrl: './prescription-modal.component.css'
})
export class PrescriptionModalComponent implements OnInit,OnChanges {

  @Input() prescription_id: string | null = null;
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
    throw new Error('Method not implemented.');
  }
  // ngOnInit(): void {
  //   console.log('modal component loads');
    
  //   this.auth=this._commonService.getAuthFromLocalStorage()
  //   this.get_prescription()
  // }
  ngOnChanges(changes: SimpleChanges) {
    // Ensure the modal opens only when prescription_id changes
    if (changes['prescription_id'] && this.prescription_id) {
      this.openModal();
    }
  }

  get_prescription(){
    if(this.auth==='user'){
      this.userService.get_prescription_details({_id:this.prescription_id}).subscribe({
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
    }
  }

  closeModal() {
    const modal = document.getElementById('prescription-modal');
    if (modal) {
      modal.classList.add('hidden');
    }
  }
}
