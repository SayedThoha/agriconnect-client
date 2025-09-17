import { Component, OnInit } from '@angular/core';
import { AdminServiceService } from '../services/admin-service.service';
import { MessageToasterService } from '../../../shared/services/message-toaster.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { userdata } from '../models/userModel';
import { debounceTime, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AutoUnsubscribe } from '../../../core/decorators/auto-usub.decorator';

@Component({
  selector: 'app-user-list',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
})
@AutoUnsubscribe
export class UserListComponent implements OnInit {
  users!: userdata[];
  users_to_display!: userdata[];
  status = 'all';

  searchForm!: FormGroup;
  statusForm!: FormGroup;

  userListSubscription!: Subscription;

  constructor(
    private _adminService: AdminServiceService,
    private _messageService: MessageToasterService,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.getAllUsers();
    this.initializeForm();
    this.setupSearchSubscription();
    this.statusForm.get('status')?.valueChanges.subscribe((value) => {
      if (value) this.getAllUsers();
    });
  }

  private initializeForm() {
    this.searchForm = this._formBuilder.group({
      searchData: ['', Validators.required],
    });

    this.statusForm = this._formBuilder.group({
      status: ['all'],
    });
  }

  setupSearchSubscription() {
    this.searchForm
      .get('searchData')
      ?.valueChanges.pipe(debounceTime(300))
      .subscribe((value) => {
        this.filterExperts(value);
      });
  }

  filterExperts(searchTerm: string | null) {
    if (searchTerm) {
      const regex = new RegExp(searchTerm, 'i');
      this.users_to_display = this.users.filter(
        (users) =>
          regex.test(users.firstName) ||
          regex.test(users.lastName) ||
          regex.test(users.email)
      );
    } else {
      this.users_to_display = this.users;
    }
  }

  statusFormSubmit() {
    if (this.statusForm.valid) {
      const selectedStatus = this.statusForm.value.status;
      if (selectedStatus) {
        if (selectedStatus === 'all') {
          this.users_to_display = this.users;
        } else if (selectedStatus === 'true') {
          this.users_to_display = this.users_to_display.filter(
            (item) => item.blocked === true
          );
        } else if (selectedStatus === 'false') {
          this.users_to_display = this.users.filter(
            (item) => item.blocked === false
          );
        }
      }
    }
  }

  getAllUsers() {
    this.userListSubscription = this._adminService.getUsers().subscribe({
      next: (Response) => {
        this.users = Response;
        this.users_to_display = this.users;
      },
      error: (error) => {
        this._messageService.showErrorToastr(error.message);
      },
    });
  }

  changeStatus(data: userdata) {
    const queryparams = { _id: data._id };
    this._adminService.userBlock(queryparams).subscribe({
      next: () => {
        
        // data.blocked === true ? (data.blocked = false) : (data.blocked = true);
        data.blocked = !data.blocked;
      },
      error: (error) => {
        this._messageService.showErrorToastr(error.message);
      },
    });
  }
}
