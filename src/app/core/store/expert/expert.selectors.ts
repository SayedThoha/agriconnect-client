import { createFeatureSelector, createSelector } from "@ngrx/store";
// import { UserModel } from "../../models/userModel";
import { expert_state } from "./expert.state";
// import { ExpertInfo } from "../../models/expertModel";

const getuserstate=createFeatureSelector<expert_state>('user')

export const selectExpert = createSelector(
    getuserstate,
    (state:expert_state) => state.expertInfo
  );