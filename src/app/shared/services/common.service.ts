import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  private http = inject(HttpClient);
  getEmailFromLocalStrorage(): string {
    return localStorage.getItem('email') as string;
  }

  getRoleFromLocalStorage(): string {
    return localStorage.getItem('role') as string;
  }

  getTokenFromLocalStorage(): string {
    return localStorage.getItem('userToken') as string;
  }

  getExpertTokenFromLocalStorage(): string {
    return localStorage.getItem('expertToken') as string;
  }

  getExpertIdFromLocalStorage(): string {
    return localStorage.getItem('expertId') as string;
  }

  user_verify(): boolean {
    const userLoggedIn = this.getTokenFromLocalStorage();
    return !!userLoggedIn;
  }

  getAuthFromLocalStorage(): string {
    return localStorage.getItem('auth') as string;
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
    return this.http.post<{ accessToken: string; refreshToken: string }>(
      '/auth/refresh',
      {
        refreshToken,
      }
    );
  }

  getAdminTokenFromLocalStorage(): string {
    return localStorage.getItem('adminToken') as string;
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
