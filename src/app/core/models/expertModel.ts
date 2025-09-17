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

export interface IExpert {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  contactno: number;
  profile_picture: string;
  specialisation: string;
  current_working_address: string;
  experience: string;
  consultation_fee: number;
  qualification_certificate: string[];
  experience_certificate: string[];
  expert_licence: string;
  identity_proof_type: string;
  identity_proof: string;
  kyc_verification: boolean;
  blocked: boolean;
  created_time?: Date;
  otp: string;
  otp_update_time?: Date;
  is_verified?: boolean;
  role?: string;
}

export interface FarmerDetails {
  slotId: string;
  userId: string | null;
  expertId: string;
  farmer_details: {
    name: string;
    email: string;
    age: number;
    gender: string;
    address: string;
    reason_for_visit: string;
  };
  payment_method?: string;
  payment_status?: boolean;
}
