import { createAction, props } from '@ngrx/store';

import { ExpertInfo, LoginModel } from '../../models/expertModel';

export const login_expert = '[Expert Page] Load Expert';
export const login_expert_success = '[Expert Page] Load Expert Success';
export const login_expert_failure = '[Expert Page] Login Failure';
export const expert_blocked = '[Expert Page] Expert Blocked';
export const logout_expert = '[Expert Page] Logout expert';

export const loginExpert = createAction(
  login_expert,
  props<{ data: LoginModel }>()
);

export const loginExpertSuccess = createAction(
  login_expert_success,
  props<{ data: ExpertInfo }>()
);

export const loginExpertFailure = createAction(
  login_expert_failure,
  props<{ error: string }>()
);

export const expertBlocked = createAction(
  expert_blocked,
  props<{ message: string }>()
);

export const refreshExpertToken = createAction('[Expert] Refresh Token');

export const refreshExpertTokenSuccess = createAction(
  '[Expert] Refresh Token Success',
  props<{ accessToken: string }>()
);

export const refreshExpertTokenFailure = createAction(
  '[Expert] Refresh Token Failure',
  props<{ error: string }>()
);

export const logoutExpert = createAction(logout_expert);
