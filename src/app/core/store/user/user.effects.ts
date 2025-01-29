//user.effects.ts

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
  refreshTokenSuccess,
  refreshTokenFailure,
  refreshToken,
} from './user.actions';
import {
  catchError,
  EMPTY,
  exhaustMap,
  filter,
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

// Define the AppState interface
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
    private authService: AuthService
  ) {}

  _loginUser = createEffect(() =>
    this.actions$.pipe(
      ofType(loginUser),
      exhaustMap((action) => {
        // console.log('login effects')
        console.log('Effect triggered with action:', action);
        return this.userService.userLogin(action.data).pipe(
          map((data) => {
            const userdata = data;
            if (userdata.email) {
              console.log('userdata:', userdata);
              localStorage.setItem('email', userdata.email);
              localStorage.setItem('role', 'userVerification');
              this.router.navigate(['/user/verifyOtp']);
              
              return;
              
            } else if (userdata.accessedUser?.blocked) {
              localStorage.clear(); // Clear any stored data
              this.showMessage.showErrorToastr(
                'Your account has been blocked. Please contact support.'
              );
              this.router.navigate(['/home']);
              return of(userBlocked({ message: 'User account is blocked' }));
            } else if (
              userdata &&
              userdata.accessToken &&
              userdata.refreshToken&&
              userdata.accessedUser
            ) {
              console.log(
                'response from backend: userdata while login:',
                userdata
              );
              localStorage.setItem('userToken', userdata.accessToken);
              localStorage.setItem('userRefreshToken',userdata.refreshToken)
              localStorage.setItem('userId', userdata.accessedUser._id);
              console.log('userId:', localStorage.getItem('userId'));
              this.showMessage.showSuccessToastr(userdata.message);
              this.router.navigate(['/user/userHome']); //page after login-
              return loginUserSuccess({ data: userdata.accessedUser });
            } else {
              // return { type: '[Login] No Action' };
              return;
            }
          }),
          catchError((error) => {
            
            console.log('error.error.message:', error.error.message);

            // Handle blocked user error from backend
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
            // return of(loginUserFailure({ error: error.message }));
            // return of({ type: '[Login] Error', payload: error.message });
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

        return this.userService.refreshToken(refreshToken).pipe(
          map((data) => {
            if (data.accessToken && data.refreshToken) {
              // Update tokens in localStorage
              localStorage.setItem('userToken', data.accessToken);

              localStorage.setItem('userRefreshToken', data.refreshToken);

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
              // Return multiple actions
              // return [
              //   userBlocked({ message: 'User account is blocked' }),
              //   logoutUser()
              // ];
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


  
  googleLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(googleLogin),
      exhaustMap(({ token }) =>
        this.userService.googleLogin(token).pipe(
          map((response) => {
            if (response.success) {
              // localStorage.setItem('auth', 'user');
              localStorage.setItem('userToken', response.token);
              localStorage.setItem('userId', response.user._id);
              this.showMessage.showSuccessToastr('Google login successful');

              // Notify AuthService about login state change
              this.authService.setLoginState(true);

              this.router.navigate(['/user/userHome']);

              return googleLoginSuccess({ user: response.user });
            }
            throw new Error('Login failed');
          }),
          catchError((error) => {
            console.error('Google login error:', error);
            this.showMessage.showErrorToastr(
              error.message || 'Google login failed'
            );
            return of(googleLoginFailure({ error }));
          })
        )
      )
    )
  );

}
