// user.actions.ts

import { createAction, props } from '@ngrx/store';
import { LoginModel, UserInfo,User,UserModel } from '../../models/userModel';

export const login_user = '[user page]load user';
export const login_user_success = '[user page]load user success';
export const logout_user = '[user page]logout user';

export const loginUser = createAction(
  login_user,
  props<{ data: LoginModel }>()
);
export const loginUserSuccess = createAction(
  login_user_success,
  props<{ data: UserInfo }>()
);
export const logoutUser = createAction(logout_user);


