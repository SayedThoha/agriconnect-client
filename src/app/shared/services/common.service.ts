import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { inject, Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  private http = inject(HttpClient);
  getEmailFromLocalStrorage(): string {
    return localStorage.getItem('email') as string;
    // return this.getLocalStorageItem('email') as string;
  }

  //get the role from local storage for the verify otp action
  getRoleFromLocalStorage(): string {
    return localStorage.getItem('role') as string;
    // return this.getLocalStorageItem('role') as string;
  }

  //get userToken from the local storage
  getTokenFromLocalStorage(): string {
    return localStorage.getItem('userToken') as string;
    // return this.getLocalStorageItem('userToken') as string;
  }

  //get expert Token from the local storage
  getExpertTokenFromLocalStorage(): string {
    return localStorage.getItem('expertToken') as string;
    // return this.getLocalStorageItem('expertToken') as string;
  }

  //get expert Id from local storage
  getExpertIdFromLocalStorage(): string {
    return localStorage.getItem('expertId') as string;
    // return this.getLocalStorageItem('expertId') as string;
  }

  //get to know is user is there or not
  user_verify(): boolean {
    const userLoggedIn = this.getTokenFromLocalStorage();
    // const userLoggedIn = this.getTokenFromLocalStorage();
    return !!userLoggedIn;
  }

  //get auth from local storage to do the verifications
  getAuthFromLocalStorage(): string {
    return localStorage.getItem('auth') as string;
    // return this.getLocalStorageItem('auth') as string;
  }

  getUserRefreshToken(): string | null {
    return localStorage.getItem('userRefreshToken');
  }

  getExpertRefreshToken(): string | null {
    return localStorage.getItem('expertRefreshToken');
  }

  storeUserTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('userToken', accessToken);
    localStorage.setItem('userRefreshToken', refreshToken);
  }

  storeExpertTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('expertToken', accessToken);
    localStorage.setItem('expertRefreshToken', refreshToken);
  }

  refreshToken(
    refreshToken: string
  ): Observable<{ accessToken: string; refreshToken: string }> {
    // Call your backend's refresh token endpoint here
    return this.http.post<{ accessToken: string; refreshToken: string }>(
      '/auth/refresh',
      {
        refreshToken,
      }
    );
  }

  //get admin Token from the local storage
  getAdminTokenFromLocalStorage(): string {
    return localStorage.getItem('adminToken') as string;
    // return this.getLocalStorageItem('expertToken') as string;
  }

  private user: any = null;

  setGoogleUser(user: any) {
    this.user = user;
    localStorage.setItem('user', JSON.stringify(user));
  }

  getGoogleUser() {
    return this.user || JSON.parse(localStorage.getItem('user') || '{}');
  }

  logoutGoogleUser() {
    this.user = null;
    localStorage.removeItem('user');
  }
  
}
