import { createFeatureSelector, createSelector } from "@ngrx/store";

import { ExpertInfo } from "../../models/expertModel";


// Define the shape of the user feature state
export interface ExpertState {
    expertInfo: ExpertInfo;
  }
  
  // Selector to get the user feature state
  export const getExpertFeatureState = createFeatureSelector<ExpertState>('expert');
  
  // Selector to get the userInfo from the user feature state
  export const getexpertstate = createSelector(
    getExpertFeatureState,
    (state) => state.expertInfo
  );