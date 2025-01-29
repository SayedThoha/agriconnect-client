//user.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { user_State } from './user.state';
import {loginUserSuccess, logoutUser, userBlocked } from './user.actions';

export function userReducer(state: any | undefined, action: any) {
  return _userReducer(state, action);
}

const _userReducer = createReducer(
  user_State,

  on(loginUserSuccess, (state, action) => {
    const user = { ...action.data };
    return {
      ...state,
      userInfo: {
        _id: user._id,
        firstName: user.firstname,
        lastName: user.lastname,
        email: user.email,
        role: user.role,
        blocked: user.blocked
      },
        
    };
  }),
  on(userBlocked, (state) => {
    return {
      ...state,
      userInfo: {
        _id: '',
        firstName: '',
        lastName: '',
        email: '',
        role: '',
        blocked: ''
      },
    };
  }),
  on(logoutUser, (state) => {
    return {
      ...state,
      userInfo: {
        _id: '',
        firstName: '',
        lastName: '',
        email: '',
        role: '',
        blocked: ''
      },

    };
  }),
  
);
