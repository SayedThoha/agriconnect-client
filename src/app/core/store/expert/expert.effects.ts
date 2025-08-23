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
  refreshExpertToken,
  refreshExpertTokenFailure,
  refreshExpertTokenSuccess,
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
        return this.expertService.expertLogin(action.data).pipe(
          map((data) => {
            const expertData = data;
            if (expertData.email) {
              localStorage.setItem('email', expertData.email);
              localStorage.setItem('role', 'expertVerification');
              this.router.navigate(['/expert/verifyOtp']);

              return;
            } else if (expertData.accessedUser?.blocked) {
              localStorage.clear();
              this.showMessage.showErrorToastr(
                'Your account has been blocked. Please contact support.'
              );
              this.router.navigate(['/home']);
              return of(expertBlocked({ message: 'account is blocked' }));
            } else if (
              expertData &&
              expertData.accessToken &&
              expertData.refreshToken &&
              expertData.accessedUser
            ) {
              localStorage.setItem('expertToken', expertData.accessToken);
              localStorage.setItem(
                'expertRefreshToken',
                expertData.refreshToken
              );
              localStorage.setItem('expertId', expertData.accessedUser._id);

              this.showMessage.showSuccessToastr(expertData.message);
              this.router.navigate(['/expert/expertHome']);
              return loginExpertSuccess({ data: expertData.accessedUser });
            } else {
              return;
            }
          }),

          catchError((error) => {
            console.log('error.error.message:', error.error.message);

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
          })
        );
      })
    )
  );

  _refreshExpertToken = createEffect(() =>
    this.actions$.pipe(
      ofType(refreshExpertToken),
      switchMap(() => {
        const refreshToken = localStorage.getItem('expertRefreshToken');

        if (!refreshToken) {
          this.showMessage.showErrorToastr(
            'Session expired. Please log in again.'
          );

          this.router.navigate(['/home']);
          return of(
            refreshExpertTokenFailure({
              error: 'No refresh token found for expert',
            })
          );
        }

        return this.expertService.refreshExpertToken(refreshToken).pipe(
          map((data) => {
            if (data.accessToken && data.refreshToken) {
              localStorage.setItem('expertToken', data.accessToken);
              localStorage.setItem('expertRefreshToken', data.refreshToken);
              return refreshExpertTokenSuccess({
                accessToken: data.accessToken,
              });
            } else {
              this.showMessage.showErrorToastr(
                'Failed to refresh expert token.'
              );
              return refreshExpertTokenFailure({
                error: 'Invalid expert refresh token response',
              });
            }
          }),
          catchError((error) => {
            this.showMessage.showErrorToastr(
              'Session expired. Please log in again.'
            );

            localStorage.clear();
            this.router.navigate(['/home']);
            return of(refreshExpertTokenFailure({ error: error.message }));
          })
        );
      })
    )
  );

  refreshTokenPeriodically = createEffect(() =>
    interval(4 * 60 * 1000).pipe(
      filter(() => !!localStorage.getItem('expertRefreshToken')),
      switchMap(() => of(refreshExpertToken()))
    )
  );

  checkExpertBlock = createEffect(() =>
    interval(60000).pipe(
      withLatestFrom(this.store.select(getexpertstate)),
      filter(([_, expertState]: [number, ExpertInfo]) =>
        Boolean(expertState?._id)
      ),
      switchMap(([_, expertState]: [number, ExpertInfo]) =>
        this.expertService.checkExpertStatus(expertState._id).pipe(
          mergeMap((response) => {
            if (response.blocked) {
              localStorage.clear();
              this.showMessage.showErrorToastr(
                'Your account has been blocked. Please contact support.'
              );
              this.router.navigate(['/home']);
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
