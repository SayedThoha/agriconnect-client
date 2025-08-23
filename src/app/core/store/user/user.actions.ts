import { createAction, props } from '@ngrx/store';
import { LoginModel, UserInfo, User, UserModel } from '../../models/userModel';

export const login_user = '[User page] Load User';
export const login_user_success = '[User page] Load User Success';
export const login_user_failure = '[User page] Login Failure';
export const user_blocked='[User page] User Blocked';
export const logout_user = '[User page] Logout User';

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


export const refreshUserToken = createAction('[User] Refresh Token');

export const refreshUserTokenSuccess = createAction(
  '[User] Refresh Token Success',
  props<{ accessToken: string }>()
);

export const refreshUserTokenFailure = createAction(
  '[User] Refresh Token Failure',
  props<{ error: string }>()
);





export const googleLogin = createAction(
  '[Auth] Google Login',
  props<{  data: { email: string; displayName: string; photoURL: string; uid: string; token: string } }>()
);

export const googleLoginSuccess = createAction(
  '[Auth] Google Login Success',
  props<{ user: any }>()
);

export const googleLoginFailure = createAction(
  '[Auth] Google Login Failure',
  props<{ error: any }>()
);
