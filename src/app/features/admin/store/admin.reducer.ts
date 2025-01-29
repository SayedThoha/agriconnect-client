//admin.reducer.ts

import { createReducer, on } from '@ngrx/store';
import { loginadminSuccess, logoutadmin } from './admin.action';
import { admin_state, adminState } from './admin.state';

export function adminReducer(state: adminState | undefined, action: any) {
  return _adminReducer(state, action);
}

export const _adminReducer = createReducer(
  admin_state,
  on(loginadminSuccess, (state, action) => {
    return {
      ...state,
      adminInfo: {
        _id: action.data._id,
        email: action.data.email,
        role: action.data.role,
        payOut: action.data.payOut,
      },
    };
  }),
  on(logoutadmin, () => {
    return {
      ...admin_state,
    };
  })
);
