import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../services/common.service';
import { Store } from '@ngrx/store';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { AuthGoogleService } from '../services/googleauth.service';
import { logoutUser } from '../../core/store/user/user.actions';
import { logoutExpert } from '../../core/store/expert/expert.actions';

import { ExpertNotificationComponent } from '../../features/expert/expert-notification/expert-notification.component';
import { NotificationComponent } from '../../features/user/notification/notification.component';

@Component({
  selector: 'app-header',
  imports: [
    CommonModule,
    ButtonModule,
    NotificationComponent,
    ExpertNotificationComponent,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  user!: boolean;
  expert!: boolean;
  nobody!: boolean;

  activeTab: string = '';

  constructor(
    private router: Router,
    private commonService: CommonService,
    private store: Store,
    private authService: AuthService,
    private authGoogleService: AuthGoogleService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.checkuser();

    const storedTab = localStorage.getItem('activeTab');
    if (storedTab) {
      this.activeTab = storedTab;
    }

    this.authService.authState$.subscribe((isLoggedIn) => {
      // console.log('Google authState updated:', isLoggedIn);
      this.checkuser();
    });
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
    localStorage.setItem('activeTab', tab);
  }

  checkuser() {
    const user = this.authService.checkUserLoggedIn();
    const expert = this.authService.checkExpertLoggedIn();

    if (user) {
      this.user = true;
      this.expert = false;
      this.nobody = false;
    } else if (expert) {
      this.expert = true;
      this.user = false;
      this.nobody = false;
    } else if (!user && !expert) {
      this.nobody = true;
      this.user = false;
      this.expert = false;
    }

    this.cdr.detectChanges();
  }

  home() {
    this.setActiveTab('home');
    this.router.navigate(['/home']);
  }

  expertSignIn() {
    this.setActiveTab('expertLogin');
    localStorage.setItem('auth', 'expert');
    // console.log(this.commonService.getAuthFromLocalStorage());
    this.router.navigate(['/expert/expertLogin']);
  }

  userLogin() {
    this.setActiveTab('userLogin');
    localStorage.setItem('auth', 'user');
    // console.log(this.commonService.getAuthFromLocalStorage());
    this.router.navigate(['/user/login']);
  }

  userHome() {
    this.setActiveTab('userHome');
    // console.log(this.commonService.getAuthFromLocalStorage());
    this.router.navigate(['/user/userHome']);
  }

  userProfile() {
    this.setActiveTab('userProfile');
    this.router.navigate(['/user/user_profile']);
  }

  userChat() {
    this.setActiveTab('userChat');
    this.router.navigate(['/user/userchat']);
  }

  expertsListing() {
    this.setActiveTab('expertListing');
    this.router.navigate(['/user/expert_listing']);
  }

  expertProfile() {
    this.setActiveTab('expertProfile');
    this.router.navigate(['/expert/expert_profile']);
  }

  expertChat() {
    this.setActiveTab('expertChat');
    this.router.navigate(['/expert/expert_chat']);
  }
  expertHome() {
    this.setActiveTab('expertHome');
    this.router.navigate(['/expert/expertHome']);
  }
  bookings() {
    this.setActiveTab('bookings');
    this.router.navigate(['/expert/bookings']);
  }
  user_bookings() {
    this.router.navigate(['/user/bookings']);
  }

  userLogout() {
    if (this.authService.checkUserLoggedIn()) {
      this.authGoogleService.logout();
      this.store.dispatch(logoutUser());
      localStorage.removeItem('userToken');
      localStorage.removeItem('userRefreshToken');
      this.router.navigate(['/home']);
      localStorage.removeItem('auth');
    } else if (this.authService.checkExpertLoggedIn()) {
      this.store.dispatch(logoutExpert());
      localStorage.removeItem('expertToken');
      localStorage.removeItem('expertRefreshToken');
      this.router.navigate(['/home']);
      localStorage.removeItem('auth');
    }

    this.activeTab = '';
    localStorage.removeItem('activeTab');
    this.cdr.detectChanges();
  }
}
