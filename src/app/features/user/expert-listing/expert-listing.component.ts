import { Component } from '@angular/core';
import { HeaderComponent } from '../../../shared/header/header.component';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { expertData, specialisation } from '../../admin/models/expertModel';
import { UserService } from '../../../shared/services/user.service';
import { MessageToasterService } from '../../../shared/services/message-toaster.service';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs';
import { AutoUnsubscribe } from '../../../core/decorators/auto-usub.decorator';
@AutoUnsubscribe
@Component({
  selector: 'app-expert-listing',
  imports: [HeaderComponent, CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './expert-listing.component.html',
  styleUrl: './expert-listing.component.css',
})
export class ExpertListingComponent {
  specialisations: specialisation[] = [];
  experts: expertData[] = [];
  displayed_expert: expertData[] = [];
  searchForm!: FormGroup;

  constructor(
    private userService: UserService,
    private messageService: MessageToasterService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initialseForms();
    this.getSpecialisations();
    this.getExpertDetails();
    this.setupSearchSubscription();
   
  }

  initialseForms(): void {
    this.searchForm = this.formBuilder.group({
      searchData: ['', Validators.required],
    });
  }

  setupSearchSubscription() {
    this.searchForm
      .get('searchData')
      ?.valueChanges.pipe(debounceTime(300)) // Adjust debounce time as needed
      .subscribe((value) => {
        this.filterExperts(value);
      });
  }

  filterExperts(searchTerm: string | null) {
    if (searchTerm) {
      const regex = new RegExp(searchTerm, 'i');
      this.displayed_expert = this.displayed_expert.filter(
        (expert) =>
          regex.test(expert.firstName) ||
          regex.test(expert.lastName) ||
          regex.test(expert.specialisation)
      );
    } else {
      this.displayed_expert = this.experts;
    }
  }

  getSpecialisations() {
    this.userService.getSpecialisation().subscribe({
      next: (Response) => {
        this.specialisations = Response;
      },
      error: (error) => {
        this.messageService.showErrorToastr(error.error.message);
      },
    });
  }

  getExpertDetails() {
    this.userService.getExperts().subscribe({
      next: (Response) => {
        console.log(Response)
        this.experts = Response;

        this.displayed_expert = this.experts;
        this.displayed_expert.forEach((data) => {
          console.log(data);
          console.log('profile pic', data.profile_picture);
        });
      },
      error: (error) => {
        console.error(error);
        this.messageService.showErrorToastr(error.error.message);
      },
    });
  }

  specialisedExperts(data: any) {
    if (data === 'all') {
      this.displayed_expert = this.experts;
    } else {
      this.displayed_expert = this.experts.filter((expert) => {
        return expert.specialisation === data;
      });
    }
  }

  expertProfile(data: any) {
    this.router.navigate(['/user/expert_profile', data]);
  }
}
