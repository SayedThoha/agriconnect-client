import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../shared/services/user.service';
import { MessageToasterService } from '../../../shared/services/message-toaster.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ImageUploadService } from '../../../shared/services/image-upload.service';
import { namePattern } from '../../../shared/regexp/regexp';
import { HeaderComponent } from '../../../shared/header/header.component';
import { UserSidebarComponent } from '../user-sidebar/user-sidebar.component';

@Component({
  selector: 'app-user-profile',
  imports: [CommonModule, ReactiveFormsModule, FormsModule,HeaderComponent,RouterModule,UserSidebarComponent],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
})
export class UserProfileComponent{
  
}
