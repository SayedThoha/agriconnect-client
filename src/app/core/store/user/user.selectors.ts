//user.selectors.ts

import { createFeatureSelector, createSelector } from "@ngrx/store";
import { UserInfo } from "../../models/userModel";



// Define the shape of the user feature state
export interface UserState {
    userInfo: UserInfo;
  }
  
  // Selector to get the user feature state
  export const getUserFeatureState = createFeatureSelector<UserState>('user');
  
  // Selector to get the userInfo from the user feature state
  export const getuserstate = createSelector(
    getUserFeatureState,
    (state) => state.userInfo
  );