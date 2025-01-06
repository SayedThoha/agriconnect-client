import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../services/common.service';
import { Store } from '@ngrx/store';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-header',
  imports: [CommonModule, ButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  user!: boolean;
  expert!: boolean;
  nobody!: boolean;

  constructor(
    private router: Router,
    private commonService: CommonService,
    private store: Store,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.checkuser();
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
  }

  home() {
    this.router.navigate(['/home']);
  }

  expertSignIn() {
    localStorage.setItem('auth', 'expert');
    console.log(this.commonService.getAuthFromLocalStorage());
    this.router.navigate(['/expert/expertLogin']);
  }

  userLogin() {
    localStorage.setItem('auth', 'user');
    console.log(this.commonService.getAuthFromLocalStorage());
    this.router.navigate(['/user/login']);
  }

  userHome() {
    this.router.navigate(['/user/userHome']);
  }

  userProfile() {
    this.router.navigate(['/user/user_profile']);
  }

  userChat() {
    this.router.navigate(['/user/userchat']);
  }

  expertsListing() {
    this.router.navigate(['/user/expert_listing']);
  }

  expertProfile() {
    this.router.navigate(['/expert/expert_profile']);
  }

  expertChat() {
    this.router.navigate(['/expert/expert_chat']);
  }
  expertHome() {
    this.router.navigate(['/expert/expertHome']);
  }
  bookings() {
    this.router.navigate(['expert/bookings']);
  }
  user_bookings() {
    this.router.navigate(['user/bookings']);
  }

  userLogout() {
    if (this.authService.checkUserLoggedIn()) {
      localStorage.removeItem('userToken');
      this.router.navigate(['/home']);
      localStorage.removeItem('auth');
    } else if (this.authService.checkExpertLoggedIn()) {
      localStorage.removeItem('expertToken');
      this.router.navigate(['/home']);
      localStorage.removeItem('auth');
    }
  }
}
