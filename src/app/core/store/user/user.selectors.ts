import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserInfo } from '../../models/userModel';

export interface UserState {
  userInfo: UserInfo;
}

export const getUserFeatureState = createFeatureSelector<UserState>('user');

export const getuserstate = createSelector(
  getUserFeatureState,
  (state) => state.userInfo
);
