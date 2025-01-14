import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MessageToasterService } from '../../../shared/services/message-toaster.service';
import { AdminServiceService } from '../services/admin-service.service';
import { CommonModule } from '@angular/common';
import { specialisation } from '../models/expertModel';

@Component({
  selector: 'app-specialisation',
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './specialisation.component.html',
  styleUrl: './specialisation.component.css',
})
export class SpecialisationComponent implements OnInit {
  namePattern = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*\s*$/;
  specialisation!: specialisation[];
  editData!: specialisation;
  edit = false;
  specialisationForm!: FormGroup;
  editspecialisationForm!: FormGroup;

  constructor(
    private adminService: AdminServiceService,
    private messageService: MessageToasterService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.getSpecialisation();
    this.getSpecialisation();
    this.initializeForms();
  }

  initializeForms() {
    this.specialisationForm = this.formBuilder.group({
      specialisation: [
        '',
        [
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern(this.namePattern),
        ],
      ],
    });

    this.editspecialisationForm = this.formBuilder.group({
      specialisation: [
        '',
        [
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern(this.namePattern),
        ],
      ],
    });
  }

  getSpecialisation() {
    this.adminService.getSpecialisation().subscribe({
      next: (Response) => {
        this.specialisation = Response;
      },
      error: (error) => {
        this.messageService.showErrorToastr(error.error.message);
      },
    });
  }

  //add spec
  addSubmit() {
    let data = this.specialisationForm.value.specialisation;
    if (this.specialisationForm.invalid) {
      if (this.specialisationError()) {
        this.messageService.showErrorToastr(this.specialisationError());
      }
    } else {
      let spec = this.specialisation.some(
        (spec) => spec.specialisation.toLowerCase() === data!.toLowerCase()
      );
      if (spec) {
        this.specialisationForm.reset();
        this.messageService.showWarningToastr(`${data} already exists!`);
      } else {
        if (data) {
          const Data = { specialisation: data };
          this.adminService.addSpecialisation(Data).subscribe({
            next: (Response) => {
              this.messageService.showSuccessToastr(Response.message);
              this.getSpecialisation();
              this.specialisationForm.reset();
            },
            error: (error) => {
              this.messageService.showErrorToastr(error.error.message);
              this.specialisationForm.reset();
            },
          });
        }
      }
    }
  }

  //edit call of a spec
  editSpec(data: specialisation) {
    this.editData = data;
    this.edit = true;
    this.editspecialisationForm.setValue({
      specialisation: data.specialisation,
    });
  }

  //closeEdit
  closeEdit() {
    this.edit = !this.edit;
  }

  //edit spec
  editSubmit() {
    let data = this.editData;
    if (this.editspecialisationForm.invalid) {
      if (this.editspecialisationError()) {
        this.messageService.showErrorToastr(this.editspecialisationError());
      }
    } else {
      if (data) {
        const spec = this.editspecialisationForm.value.specialisation;
        if (spec) data.specialisation = spec;
        this.adminService.editSpecialisation(data).subscribe({
          next: (Response) => {
            this.messageService.showSuccessToastr(Response.message);
          },
          error: (error) => {
            this.messageService.showErrorToastr(error.error.message);
          },
        });
      }
    }
    this.edit = !this.edit;
  }

  //delete spec
  deleteSpec(data: any) {
    const value = { _id: data._id, specialisation: data.specialisation };
    this.adminService.deleteSpecialisation(data).subscribe({
      next: (Response) => {
        this.messageService.showSuccessToastr(Response.message);
        this.specialisation = this.specialisation.filter(
          (data) => data._id != value._id
        );
      },
      error: (error) => {
        this.messageService.showErrorToastr(error.error.message);
      },
    });
  }

  //add spec error
  specialisationError(): string {
    const name = this.specialisationForm.get('specialisation');
    if (name?.invalid) {
      if (name?.errors?.['required']) {
        return `Specialisation is required`;
      } else if (name.errors?.['maxlength']) {
        return `Specialisation length upto max 50 letters`;
      } else if (name.errors?.['pattern']) {
        return `Specialisation is invalid`;
      }
    }
    return ``;
  }

  //edit specialization error
  editspecialisationError(): string {
    const name = this.editspecialisationForm.get('specialisation');
    if (name?.invalid) {
      if (name?.errors?.['required']) {
        return `Specialisation is required`;
      } else if (name.errors?.['maxlength']) {
        return `Specialisation length upto max 50 letters`;
      } else if (name.errors?.['pattern']) {
        return `Specialisation is invalid`;
      }
    }
    return ``;
  }
  
}
