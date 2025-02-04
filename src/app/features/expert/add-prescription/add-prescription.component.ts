import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../../shared/header/header.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MessageToasterService } from '../../../shared/services/message-toaster.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ExpertService } from '../../../shared/services/expert.service';
import { FooterComponent } from '../../../shared/footer/footer.component';



@Component({
  selector: 'app-add-prescription',
  imports: [HeaderComponent,ReactiveFormsModule,FormsModule,CommonModule,FooterComponent],
  templateUrl: './add-prescription.component.html',
  styleUrl: './add-prescription.component.css'
})
export class AddPrescriptionComponent implements OnInit {

  appointmentId!:string|null
  prescriptionForm!:FormGroup
  constructor(
    private messageService:MessageToasterService,
    private router:Router,
    private route:ActivatedRoute,
    private expertService:ExpertService,
    private formBuilder:FormBuilder,
  ){}


  ngOnInit(): void {
    this.initialiseForms()
    this.appointmentId = this.route.snapshot.paramMap.get('appointmentId');
  }

initialiseForms():void{
  this.prescriptionForm=this.formBuilder.group({
    issue:['',Validators.required],
    prescription:['',Validators.required]
  })
}
  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
  
  onSubmit(){
    if(this.prescriptionForm.invalid){
      this.markFormGroupTouched(this.prescriptionForm);
      return
    }else{
      const data={
        appointmentId:this.appointmentId,
        issue:this.prescriptionForm.value.issue,
        prescription:this.prescriptionForm.value.prescription,
      }
      this.expertService.add_prescription(data).subscribe({
        next:(response)=>{
          this.messageService.showSuccessToastr(response.message)
          this.router.navigate(['/expert/expert_profile'])
        },error:(error)=>{
          this.messageService.showErrorToastr(error.error.message)
        }
      })
    }
  }

}
