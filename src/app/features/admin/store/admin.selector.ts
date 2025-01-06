import { createFeatureSelector, createSelector } from '@ngrx/store';
// import { UserModel } from "../../models/userModel";
import { adminState } from './admin.state';
// import { ExpertInfo } from "../../models/expertModel";

const getAdminState = createFeatureSelector<adminState>('user');

export const selectAdmin = createSelector(
  getAdminState,
  (state: adminState) => state.adminInfo
);
