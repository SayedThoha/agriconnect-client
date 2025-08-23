import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UserService } from '../../../shared/services/user.service';
import {
  googleLogin,
  googleLoginSuccess,
  googleLoginFailure,
  loginUser,
  loginUserSuccess,
  loginUserFailure,
  userBlocked,
  logoutUser,
  refreshUserToken,
  refreshUserTokenFailure,
  refreshUserTokenSuccess,
} from './user.actions';
import {
  catchError,
  EMPTY,
  exhaustMap,
  filter,
  from,
  interval,
  map,
  mergeMap,
  of,
  switchMap,
  withLatestFrom,
} from 'rxjs';
import { MessageToasterService } from '../../../shared/services/message-toaster.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';
import { getuserstate } from './user.selectors';
import { UserInfo } from '../../models/userModel';
import { Store } from '@ngrx/store';
import { AuthGoogleService } from '../../../shared/services/googleauth.service';
import { Socket } from 'ngx-socket-io';

interface AppState {
  user: UserInfo;
}

@Injectable()
export class UserEffects {
  private actions$ = inject(Actions);
  private store = inject(Store<AppState>);
  constructor(
    private userService: UserService,
    private showMessage: MessageToasterService,
    private router: Router,
    private authService: AuthService,
    private gauthService: AuthGoogleService,
    private socket: Socket
  ) {}

  _loginUser = createEffect(() =>
    this.actions$.pipe(
      ofType(loginUser),
      exhaustMap((action) => {
        return this.userService.userLogin(action.data).pipe(
          map((data) => {
            const userdata = data;
            if (userdata.email) {
              localStorage.setItem('email', userdata.email);
              localStorage.setItem('role', 'userVerification');
              this.router.navigate(['/user/verifyOtp']);

              return;
            } else if (userdata.accessedUser?.blocked) {
              localStorage.clear();
              this.showMessage.showErrorToastr(
                'Your account has been blocked. Please contact support.'
              );
              this.router.navigate(['/home']);
              return of(userBlocked({ message: 'User account is blocked' }));
            } else if (
              userdata &&
              userdata.accessToken &&
              userdata.refreshToken &&
              userdata.accessedUser
            ) {
              localStorage.setItem('userToken', userdata.accessToken);
              localStorage.setItem('userRefreshToken', userdata.refreshToken);
              localStorage.setItem('userId', userdata.accessedUser._id);
              this.showMessage.showSuccessToastr(userdata.message);
              this.router.navigate(['/user/userHome']);

              return loginUserSuccess({ data: userdata.accessedUser });
            } else {
              return;
            }
          }),
          catchError((error) => {
            console.log('error.error.message:', error.error.message);

            if (
              error.status === 403 &&
              error.error.message === 'User is blocked'
            ) {
              localStorage.clear();
              this.showMessage.showErrorToastr(
                'Your account has been blocked. Please contact support.'
              );
              this.router.navigate(['/home']);
              return of(userBlocked({ message: error.error.message }));
            }
            this.showMessage.showErrorToastr(error.error.message);
            return of(error.message);
          })
        );
      })
    )
  );

  _refreshUserToken = createEffect(() =>
    this.actions$.pipe(
      ofType(refreshUserToken),
      switchMap(() => {
        const refreshToken = localStorage.getItem('userRefreshToken');

        if (!refreshToken) {
          this.showMessage.showErrorToastr(
            'Session expired. Please log in again.'
          );
          this.router.navigate(['/home']);
          return of(
            refreshUserTokenFailure({
              error: 'No refresh token found for user',
            })
          );
        }

        return this.userService.refreshUserToken(refreshToken).pipe(
          map((data) => {
            if (data.accessToken && data.refreshToken) {
              localStorage.setItem('userToken', data.accessToken);
              localStorage.setItem('userRefreshToken', data.refreshToken);
              return refreshUserTokenSuccess({ accessToken: data.accessToken });
            } else {
              this.showMessage.showErrorToastr('Failed to refresh user token.');
              return refreshUserTokenFailure({
                error: 'Invalid user refresh token response',
              });
            }
          }),
          catchError((error) => {
            this.showMessage.showErrorToastr(
              'Session expired. Please log in again.'
            );
            localStorage.clear();
            this.router.navigate(['/home']);
            return of(refreshUserTokenFailure({ error: error.message }));
          })
        );
      })
    )
  );

  refreshTokenPeriodically = createEffect(() =>
    interval(4 * 60 * 1000).pipe(
      filter(() => !!localStorage.getItem('userRefreshToken')),
      switchMap(() => of(refreshUserToken()))
    )
  );

  checkUserBlock = createEffect(() =>
    interval(60000).pipe(
      withLatestFrom(this.store.select(getuserstate)),
      filter(([_, userState]: [number, UserInfo]) => Boolean(userState?._id)),
      switchMap(([_, userState]: [number, UserInfo]) =>
        this.userService.checkUserStatus(userState._id).pipe(
          mergeMap((response) => {
            if (response.blocked) {
              localStorage.clear();
              this.showMessage.showErrorToastr(
                'Your account has been blocked. Please contact support.'
              );
              this.router.navigate(['/home']);
            }
            return [{ type: '[User] Status Check Success' }];
          }),
          catchError((error) => {
            console.error('Error checking user status:', error);
            return EMPTY;
          })
        )
      )
    )
  );
}
