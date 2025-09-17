/* eslint-disable @typescript-eslint/no-explicit-any */
import { createReducer, on } from '@ngrx/store';
import { user_State } from './user.state';
import {
  googleLogin,
  loginUserSuccess,
  logoutUser,
  refreshUserTokenFailure,
  refreshUserTokenSuccess,
  userBlocked,
} from './user.actions';

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
        blocked: user.blocked,
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
        blocked: '',
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
        blocked: '',
      },
    };
  }),

  on(refreshUserTokenSuccess, (state, action) => {
    return {
      ...state,
      userInfo: {
        ...state.userInfo,
        accessToken: action.accessToken,
      },
    };
  }),

  on(refreshUserTokenFailure, (state) => {
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
  }),

  on(googleLogin, (state, { data }) => ({
    ...state,
    email: data.email,
    displayName: data.displayName,
    photoURL: data.photoURL,
    uid: data.uid,
    token: data.token,
  }))
);
