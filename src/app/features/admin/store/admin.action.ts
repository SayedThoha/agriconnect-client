//admin.action.ts
import { createAction, props } from '@ngrx/store';
import { Adminlogin, adminInfo } from './admin.state';

export const login_admin = '[Admin] Login Request';
export const login_admin_success = '[Admin] Login Success';
export const login_admin_failure = '[Admin] Login Failure';
export const logout_admin = '[Admin] Logout';

export const adminlogin = createAction(
  login_admin,
  props<{ data: Adminlogin }>()
);

export const loginadminSuccess = createAction(
  login_admin_success,
  props<{ data: adminInfo }>()
);

export const loginadminFailure = createAction(
  login_admin_failure,
  props<{ error: string }>()
);

export const logoutadmin = createAction(logout_admin);
