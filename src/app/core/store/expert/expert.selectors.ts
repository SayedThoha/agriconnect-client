import { createFeatureSelector, createSelector } from '@ngrx/store';

import { ExpertInfo } from '../../models/expertModel';

export interface ExpertState {
  expertInfo: ExpertInfo;
}

export const getExpertFeatureState =
  createFeatureSelector<ExpertState>('expert');

export const getexpertstate = createSelector(
  getExpertFeatureState,
  (state) => state.expertInfo
);
