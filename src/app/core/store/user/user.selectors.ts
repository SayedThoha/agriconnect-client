//user.selectors.ts

import { createFeatureSelector } from "@ngrx/store";
import { UserInfo } from "../../models/userModel";

export const getuserstate=createFeatureSelector<UserInfo>('user')