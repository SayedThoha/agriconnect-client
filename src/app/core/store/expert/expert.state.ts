import { ExpertModel } from '../../models/expertModel';

export const expertstate: ExpertModel = {
  list: [],
  errormessage: '',
  userobj: {
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    otp: 0,
    isverified: false,
    blocked: false,
  },
};

export const expert_State = {
  userInfo: {
    _id: '',
    firstName: '',
    lastName: '',
    email: '',
    role: '',
  },
};
