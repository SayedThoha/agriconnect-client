export interface Expert {
  firstName: string;
  lastName: string;
  email: string;
  contactno: string;
  specialisation: string;
  current_working_address: string;
  experience: string;
  consultation_fee: string;
  identity_proof_type: string;
  identity_proof: File;
  expert_liscence: File;
  qualification_certificate: File;
  experience_certificate: File;
  password: string;
  blocked: boolean;
}

export interface ExpertLoginResponseModel {
  accessToken?: string;
  refreshToken?: string;
  accessedUser?: ExpertInfo;
  message: string;
  email?: string;
}

export interface ExpertInfo {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isverified: boolean;
  blocked: boolean;
}

export interface LoginModel {
  email: string;
  password: string;
}

export interface Msg {
  message: string;
}

export interface ExpertState {
  message?: Msg;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  otp?: number;
  isverified?: boolean;
  blocked?: boolean;
}

export interface ExpertModel {
  list: ExpertState[];
  userobj: ExpertState;
  errormessage: string;
}

export interface upcomingAppointment {
  expertId: string;
}

export interface Email {
  email: string;
}
