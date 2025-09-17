
export interface AppointMent {
  farmer_details: FarmerDetails;
  _id: string;
  userId: UserId;
  slotId: SlotId;
  expertId: ExpertId;
  payment_method: string;
  payment_status: boolean;
  consultation_status: string;
  created_time: string;
  __v: number;
  roomId: string;
  prescription_id: string;
}

interface FarmerDetails {
  name: string;
  email: string;
  age: number;
  gender: string;
  address: string;
  reason_for_visit: string;
}

interface UserId {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  is_verified: boolean;
  role: string;
  blocked: boolean;
  wallet: number;
  profile_picture: string | null;
  authProvider: string;
  created_time: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface SlotId {
  _id: string;
  expertId: ExpertId;
  time?: Date;
  booked: boolean;
  bookingAmount: number;
  adminPaymentAmount: number;
  cancelled: boolean;
  created_time: string;
  __v: number;
}

interface ExpertId {
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
  password: string;
  kyc_verification: boolean;
  blocked: boolean;
  otp: string;
  otp_update_time: string;
  is_verified: boolean;
  role: string;
  created_time: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
