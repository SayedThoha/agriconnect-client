import { createAction, props } from '@ngrx/store';

import { ExpertInfo, LoginModel } from '../../models/expertModel';

export const login_expert = '[expert page]load expert';
export const login_expert_success = '[expert page]load expert success';
export const login_expert_failure = '[expert page] Login Failure';
export const expert_blocked='[Expert page] Expert Blocked';
export const logout_expert = '[expert page]logout expert';

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

export const refreshToken = createAction('[Auth] Refresh Token');

export const refreshTokenSuccess = createAction(
  '[Auth] Refresh Token Success',
  props<{ accessToken: string }>()
);

export const refreshTokenFailure = createAction(
  '[Auth] Refresh Token Failure',
  props<{ error: string }>()
);

export const logoutExpert = createAction(logout_expert);
