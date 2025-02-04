import { Action, createReducer, on } from '@ngrx/store';

import {
  expert_blocked,
  expertBlocked,
  loginExpertSuccess,
  logoutExpert,
  refreshExpertTokenFailure,
  refreshExpertTokenSuccess,
} from './expert.actions';
import { expert_State } from './expert.state';

export function expertReducer(state: any | undefined, action: any) {
  return _expertReducer(state, action);
}

const _expertReducer = createReducer(
  expert_State,

  on(loginExpertSuccess, (state, action) => {
    const expert = { ...action.data };

    return {
      ...state,
      expertInfo: {
        _id: expert._id,
        firstName: expert.firstName,
        lastName: expert.lastName,
        email: expert.email,
        role: expert.role,
        blocked: expert.blocked,
      },
    };
  }),

  on(expertBlocked, (state) => {
    return {
      ...state,
      expertInfo: {
        _id: '',
        firstName: '',
        lastName: '',
        email: '',
        role: '',
        blocked: '',
      },
    };
  }),

  on(logoutExpert, (state) => {
    return {
      ...state,
      expertInfo: {
        _id: '',
        firstName: '',
        lastName: '',
        email: '',
        role: '',
        blocked: '',
      },
    };
  }),

  // Handling refresh token success
  on(refreshExpertTokenSuccess, (state, action) => {
    // When a new token is received, update the user state accordingly
    return {
      ...state,
      expertInfo: {
        ...state.userInfo,
        accessToken: action.accessToken, // Update the access token in the state
      },
    };
  }),

  // Handle failure to refresh token (you can clear user state if needed)
  on(refreshExpertTokenFailure, (state) => {
    // You can log out the user or handle this case in a different way
    return {
      ...state,
      userInfo: {
        _id: '',
        firstName: '',
        lastName: '',
        email: '',
        role: '',
        blocked: '',
      },
    };
  })
);
