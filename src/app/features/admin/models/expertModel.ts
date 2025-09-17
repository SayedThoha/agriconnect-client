export interface expertData {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  contactno: number;
  profile_picture?: string;
  specialisation: string;
  current_working_address: string;
  experience: string;
  consultation_fee: number;
  qualification_certificate?: [string];
  experience_certificate?: [string];
  liscence?: string;
  identity_proof_type?: string;
  identity_proof?: string;
  kyc_verification?: boolean;
  blocked?: boolean;
}

export interface kyc_verification {
  _id: string;
  expertId: expertData;
  exp_certificate: string;
  qualification_certificate: string;
  liscence: string;
  id_proof_type: string;
  id_proof: string;
  specialisation: string;
  current_working_address: string;
}

export interface Specialisation {
  _id: string;
  specialisation: string;
}

export interface ExpertKyc {
  _id: string;
  expertId: Expert;
  exp_certificate: boolean;
  qualification_certificate: boolean;
  expert_licence: boolean;
  id_proof_type: boolean;
  id_proof: boolean;
  specialisation: boolean;
  current_working_address: boolean;
  created_time: Date;
  createdAt?: Date;
  updatedAt?: Date;
  address: string;
  identity_proof_name: string;
  specialisation_name: string;
}

export interface Expert {
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

export interface IKycVerificationPayload {
  _id: string;
  expert_id: string;
  id_proof_type: string;
  id_proof: string;
  expert_licence: string;
  qualification_certificate: string;
  exp_certificate: string;
  specialisation: string;
  current_working_address: string;
}
