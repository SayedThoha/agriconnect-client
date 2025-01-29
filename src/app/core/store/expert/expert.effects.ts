import { ExpertService } from '../../../shared/services/expert.service';
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  exhaustMap,
  map,
  catchError,
  of,
  mergeMap,
  switchMap,
  filter,
  withLatestFrom,
  interval,
  EMPTY,
} from 'rxjs';
import {
  expertBlocked,
  loginExpert,
  loginExpertSuccess,
  logoutExpert,
  refreshToken,
  refreshTokenFailure,
  refreshTokenSuccess,
} from './expert.actions';
import { Router } from '@angular/router';
import { MessageToasterService } from '../../../shared/services/message-toaster.service';
import { getexpertstate } from './expert.selectors';
import { ExpertInfo } from '../../models/expertModel';
import { Store } from '@ngrx/store';
// Define the AppState interface

interface AppState {
  expert: ExpertInfo;
}

@Injectable()
export class expertEffects {
  private actions$ = inject(Actions);
  private store = inject(Store<AppState>);

  constructor(
  
    private expertService: ExpertService,
    private showMessage: MessageToasterService,
    private router: Router
  ) {}

  _loginExpert = createEffect(() =>
    this.actions$.pipe(
      ofType(loginExpert),
      exhaustMap((action) => {
        console.log('expert login effects');
        return this.expertService.expertLogin(action.data).pipe(
          map((data) => {
            const expertData = data;
            if (expertData.email) {
              console.log('expertdata:', expertData);
              localStorage.setItem('email', expertData.email);
              localStorage.setItem('role', 'expertVerification');
              this.router.navigate(['/expert/verifyOtp']);

              return;
              // return { type: '[Expert] Email Login Handled' };
            } else if (expertData.accessedUser?.blocked) {
              localStorage.clear(); // Clear any stored data
              this.showMessage.showErrorToastr(
                'Your account has been blocked. Please contact support.'
              );
              this.router.navigate(['/home']);
              return of(expertBlocked({ message: 'account is blocked' }));
            } else if (
              expertData &&
              expertData.accessToken &&
              expertData.refreshToken&&
              expertData.accessedUser
            ) {
              localStorage.setItem('expertToken', expertData.accessToken);
              localStorage.setItem('expertRefreshToken',expertData.refreshToken)
              localStorage.setItem('expertId', expertData.accessedUser._id);
              console.log('expertId in effects:', expertData.accessedUser._id);
              console.log(
                'expertId in effects:',
                localStorage.getItem('expertId')
              );

              this.showMessage.showSuccessToastr(expertData.message);
              this.router.navigate(['/expert/expertHome']); //page after login
              return loginExpertSuccess({ data: expertData.accessedUser });
            } else {
              return;
              // return { type: '[Expert] Unknown Login Outcome' };
            }
          }),

          catchError((error) => {
            console.log('error.error.message:', error.error.message);

            // Handle blocked user error from backend
            if (
              error.status === 403 &&
              error.error.message === 'Expert is blocked'
            ) {
              localStorage.clear();
              this.showMessage.showErrorToastr(
                'Your account has been blocked. Please contact support.'
              );
              this.router.navigate(['/home']);
              return of(expertBlocked({ message: error.error.message }));
            }
            this.showMessage.showErrorToastr(error.error.message);

            return of(error.message);
            // return of({ type: '[Expert] Login Failed', error: error.error.message });
          })
        );
      })
    )
  );

  // Refresh token effect
    _refreshToken = createEffect(() =>
      this.actions$.pipe(
        ofType(refreshToken),
        switchMap(() => {
          const refreshToken = localStorage.getItem('userRefreshToken');
  
          if (!refreshToken) {
            this.showMessage.showErrorToastr('Session expired. Please log in again.');
            this.router.navigate(['/home']);
            return of(refreshTokenFailure({ error: 'No refresh token found' }));
          }
  
          return this.expertService.refreshToken(refreshToken).pipe(
            map((data) => {
              if (data.accessToken && data.refreshToken) {
                // Update tokens in localStorage
                localStorage.setItem('expertToken', data.accessToken);
  
                localStorage.setItem('expertRefreshToken', data.refreshToken);
  
                return refreshTokenSuccess({ accessToken: data.accessToken });
              } else {
                this.showMessage.showErrorToastr('Failed to refresh token.');
                return refreshTokenFailure({ error: 'Invalid refresh token response' });
              }
            }),
            catchError((error) => {
              this.showMessage.showErrorToastr('Session expired. Please log in again.');
              localStorage.clear();
              this.router.navigate(['/home']);
              return of(refreshTokenFailure({ error: error.error.message }));
            })
          );
        })
      )
    );
  
  
    refreshTokenPeriodically = createEffect(() =>
      interval(15 * 60 * 1000).pipe( // Every 15 minutes
        filter(() => !!localStorage.getItem('userRefreshToken')), // Only proceed if refreshToken exists
        switchMap(() => of(refreshToken())) // Trigger the refreshToken action
      )
    );
    



  checkExpertBlock = createEffect(() =>
    interval(60000).pipe(
      withLatestFrom(this.store.select(getexpertstate)),
      filter(([_, expertState]: [number, ExpertInfo]) => Boolean(expertState?._id)),
      switchMap(([_, expertState]: [number, ExpertInfo]) =>
        this.expertService.checkExpertStatus(expertState._id).pipe(
          mergeMap((response) => {
            if (response.blocked) {
              localStorage.clear();
              this.showMessage.showErrorToastr(
                'Your account has been blocked. Please contact support.'
              );
              this.router.navigate(['/home']);
              
              // Return multiple actions
              // return  [
              //   expertBlocked({ message: ' account is blocked' }),
              //   logoutExpert(),
              // ];
              
            }
            return [{ type: '[expert] Status Check Success' }];
          }),
          catchError((error) => {
            console.error('Error checking  status:', error);
            return EMPTY;
          })
        )
      )
    )
  );
}
