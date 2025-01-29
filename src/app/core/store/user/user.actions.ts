// user.actions.ts

import { createAction, props } from '@ngrx/store';
import { LoginModel, UserInfo, User, UserModel } from '../../models/userModel';

export const login_user = '[user page]load user';
export const login_user_success = '[user page]load user success';
export const login_user_failure = '[User page] Login Failure';
export const user_blocked='[User page] User Blocked';
export const logout_user = '[user page]logout user';

export const loginUser = createAction(
  login_user,
  props<{ data: LoginModel }>()
);

export const loginUserSuccess = createAction(
  login_user_success,
  props<{ data: UserInfo }>()
);

export const loginUserFailure = createAction(
  login_user_failure,
  props<{ error: string }>()
);


export const userBlocked = createAction(
  user_blocked,
  props<{ message: string }>()
);

export const logoutUser = createAction(logout_user);


export const refreshToken = createAction('[Auth] Refresh Token');

export const refreshTokenSuccess = createAction(
  '[Auth] Refresh Token Success',
  props<{ accessToken: string }>()
);

export const refreshTokenFailure = createAction(
  '[Auth] Refresh Token Failure',
  props<{ error: string }>()
);





export const googleLogin = createAction(
  '[Auth] Google Login',
  props<{ token: string }>()
);

export const googleLoginSuccess = createAction(
  '[Auth] Google Login Success',
  props<{ user: any }>()
);

export const googleLoginFailure = createAction(
  '[Auth] Google Login Failure',
  props<{ error: any }>()
);
