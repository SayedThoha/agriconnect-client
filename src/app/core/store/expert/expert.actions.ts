import { createAction, props } from '@ngrx/store';

import { ExpertInfo, LoginModel } from '../../models/expertModel';

export const login_expert = '[expert_page]load expert';
export const login_expert_success = '[expert page]load expert success';
export const logout_expert = '[expert_page]load expert';

export const loginExpert = createAction(
  login_expert,
  props<{ data: LoginModel }>()
);

export const loginExpertSuccess = createAction(
  login_expert_success,
  props<{ data: ExpertInfo }>()
);

export const logoutExpert = createAction(logout_expert);
