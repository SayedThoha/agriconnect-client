import { Action, createReducer, on } from '@ngrx/store';
import { expert_state, initialExpertState } from './expert.state';
import { loginExpertSuccess, logoutExpert } from './expert.actions';


export function expertReducer(state: any|undefined, action: any) {
  return _expertReducer(state, action);
}

const _expertReducer = createReducer(
  initialExpertState,
  on(loginExpertSuccess, (state, action) => {

    const expert = { ...action.data };

    return {
      ...state,
      expertInfo: {
        _id: expert._id,
        firstName: expert.firstName,
        lastName: expert.lastName,
        email: expert.email,
        role: expert.role,
      },
    };
  }),

  on(logoutExpert, (state) => {
    return {
      ...state,
      expertInfo: {
        _id: '',
        firstName: '',
        lastName: '',
        email: '',
        role: '',
      },
    };
  })
);


