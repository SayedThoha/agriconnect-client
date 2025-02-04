//user.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { user_State } from './user.state';
import {googleLogin, loginUserSuccess, logoutUser, refreshUserTokenFailure, refreshUserTokenSuccess, userBlocked } from './user.actions';

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

  // Handling refresh token success
  on(refreshUserTokenSuccess, (state, action) => {
    // When a new token is received, update the user state accordingly
    return {
      ...state,
      userInfo: {
        ...state.userInfo,
        accessToken: action.accessToken // Update the access token in the state
      }
    };
  }),

  // Handle failure to refresh token (you can clear user state if needed)
  on(refreshUserTokenFailure, (state) => {
    // You can log out the user or handle this case in a different way
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
  

  on(googleLogin, (state, { data }) => ({
    ...state,
    email: data.email,
    displayName: data.displayName,
    photoURL: data.photoURL,
    uid: data.uid,
    token: data.token,
  }))
);
