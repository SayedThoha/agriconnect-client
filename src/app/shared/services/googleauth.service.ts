import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { CommonService } from './common.service';
import { MessageToasterService } from './message-toaster.service';

import { AuthService } from './auth.service';
import { Auth, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';
@Injectable({
  providedIn: 'root',
})
export class AuthGoogleService {
  private auth = inject(Auth);
  private router = inject(Router);
  private store = inject(Store);
  private messageToaster = inject(MessageToasterService);
  private commonService = inject(CommonService);
  private authService = inject(AuthService);

  async login() {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(this.auth, provider);
      const user = result.user;

      this.authService.setLoginState(true);
      localStorage.setItem('userToken', await user.getIdToken());
      localStorage.setItem('userId', user.uid);
      this.messageToaster.showSuccessToastr('Google login successful!');

      this.router.navigate(['/user/userHome']);
    } catch (error) {
      console.error('Google login failed:', error);
      this.messageToaster.showErrorToastr(
        'Google login failed. Please try again.'
      );
    }
  }

  async logout() {
    try {
      await this.auth.signOut();
      // this.commonService.logoutGoogleUser();
      localStorage.removeItem('userToken');
      localStorage.removeItem('userId');
      this.authService.setLoginState(false);
      this.router.navigate(['/home']);
    } catch (error) {
      console.error('Logout failed:', error);
      this.messageToaster.showErrorToastr('Logout failed. Please try again.');
    }
  }
}
