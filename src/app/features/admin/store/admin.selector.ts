//admin.selector.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';

import { adminState } from './admin.state';

const getAdminState = createFeatureSelector<adminState>('Admin');

export const selectAdmin = createSelector(
  getAdminState,
  (state: adminState) => state.adminInfo
);
