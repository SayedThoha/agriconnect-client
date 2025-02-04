import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, catchError, Observable, switchMap, tap } from 'rxjs';
import { MessageToasterService } from './message-toaster.service';
import { Router } from '@angular/router';
import { UserService } from './user.service';
import { ExpertService } from './expert.service';
import {
  refreshUserTokenFailure,
  refreshUserTokenSuccess,
} from '../../core/store/user/user.actions';
import {
  refreshExpertTokenFailure,
  refreshExpertTokenSuccess,
} from '../../core/store/expert/expert.actions';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private refreshingUserToken = false;
  private refreshingExpertToken = false;

  private userTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );
  private expertTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );

  constructor(
    private store: Store,
    private showMessage: MessageToasterService,
    private router: Router,
    private userService: UserService,
    private expertService: ExpertService
  ) {}

  // Method to refresh user token
  refreshUserAccessToken(): Observable<any> {
    if (this.refreshingUserToken) {
      return this.userTokenSubject.asObservable();
    }

    this.refreshingUserToken = true;

    const refreshToken = localStorage.getItem('userRefreshToken');
    if (!refreshToken) {
      this.showMessage.showErrorToastr('Session expired. Please log in again.');
      this.router.navigate(['/home']);
      this.store.dispatch(
        refreshUserTokenFailure({ error: 'No refresh token found' })
      );
      return this.userTokenSubject.asObservable();
    }

    return this.userService.refreshUserToken(refreshToken).pipe(
      tap((response) => {
        localStorage.setItem('userToken', response.accessToken);
        localStorage.setItem('userRefreshToken', response.refreshToken);
        this.userTokenSubject.next(response);
        this.store.dispatch(
          refreshUserTokenSuccess({ accessToken: response.accessToken })
        );
      }),
      catchError((error) => {
        this.refreshingUserToken = false;
        this.showMessage.showErrorToastr(
          'Session expired. Please log in again.'
        );
        localStorage.clear();
        this.router.navigate(['/home']);
        this.store.dispatch(refreshUserTokenFailure({ error: error.message }));
        return this.userTokenSubject.asObservable();
      }),
      switchMap(() => this.userTokenSubject.asObservable())
    );
  }

  // Method to refresh expert token
  refreshExpertAccessToken(): Observable<any> {
    if (this.refreshingExpertToken) {
      return this.expertTokenSubject.asObservable();
    }

    this.refreshingExpertToken = true;

    const refreshToken = localStorage.getItem('expertRefreshToken');
    if (!refreshToken) {
      this.showMessage.showErrorToastr('Session expired. Please log in again.');
      this.router.navigate(['/home']);
      this.store.dispatch(
        refreshExpertTokenFailure({ error: 'No refresh token found' })
      );
      return this.expertTokenSubject.asObservable();
    }

    return this.expertService.refreshExpertToken(refreshToken).pipe(
      tap((response) => {
        localStorage.setItem('expertToken', response.accessToken);
        localStorage.setItem('expertRefreshToken', response.refreshToken);
        this.expertTokenSubject.next(response);
        this.store.dispatch(
          refreshExpertTokenSuccess({ accessToken: response.accessToken })
        );
      }),
      catchError((error) => {
        this.refreshingExpertToken = false;
        this.showMessage.showErrorToastr(
          'Session expired. Please log in again.'
        );
        localStorage.clear();
        this.router.navigate(['/home']);
        this.store.dispatch(
          refreshExpertTokenFailure({ error: error.message })
        );
        return this.expertTokenSubject.asObservable();
      }),
      switchMap(() => this.expertTokenSubject.asObservable())
    );
  }
  
}

