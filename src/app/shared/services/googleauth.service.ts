import { Injectable, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { Store } from '@ngrx/store';
import { authConfig } from '../../features/user/authConfig';
import { CommonService } from './common.service';
import { googleLogin } from '../../core/store/user/user.actions';
import { MessageToasterService } from './message-toaster.service';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGoogleService {
  private oAuthService = inject(OAuthService);
  private router = inject(Router);
  private store = inject(Store);
  private commonService = inject(CommonService);
  private showMessage = inject(MessageToasterService);
  private authService=inject(AuthService);

  // BehaviorSubject for auth status
//   private authStatusSubject = new BehaviorSubject<boolean>(false);
//   authStatus$ = this.authStatusSubject.asObservable();

  constructor() {
    this.initConfiguration();
  }


 

  initConfiguration() {
    this.oAuthService.configure(authConfig);
    this.oAuthService.setupAutomaticSilentRefresh();

    this.oAuthService.loadDiscoveryDocumentAndTryLogin().then(() => {
      const hasValidToken =
        this.oAuthService.hasValidIdToken() &&
        this.oAuthService.hasValidAccessToken();
    //   if (this.oAuthService.hasValidIdToken()) {
        if (hasValidToken) {
        // this.authStatusSubject.next(true);
        this.handleGoogleLogin();
      }else{
        // this.authStatusSubject.next(false); 
      }
    });
  }

  private async handleGoogleLogin() {
    try {
      const token = this.oAuthService.getIdToken();
      if (token  && this.oAuthService.hasValidIdToken()) {
        this.store.dispatch(googleLogin({ token }));
        // this.authStatusSubject.next(true);
      }else {
        // this.authStatusSubject.next(false); // Explicitly handle the failure case
      }
    } catch (error) {
      console.error('Google login failed:', error);
      this.showMessage.showErrorToastr('Google login failed');
      this.logout();
    }
  }

  login() {
    this.oAuthService.initLoginFlow();
    
    
  }

  logout() {
    this.oAuthService.logOut();
    this.authService.setLoginState(false);
    // this.authStatusSubject.next(false);
    // localStorage.removeItem('userToken');
    // localStorage.removeItem('userId');
    // localStorage.removeItem('auth');
    this.router.navigate(['/home']);
  }
}
