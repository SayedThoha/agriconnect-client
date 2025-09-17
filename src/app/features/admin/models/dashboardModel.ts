export interface AdminDashboardResponse {
  user_count: number;
  expert_count: number;
  slotDetails: IBookedSlot[];
}

export interface ISlot {
  _id: string;             
  expertId: string;           
  time: string;               
  booked: boolean;
  bookingAmount: number;
  adminPaymentAmount: number;
  cancelled: boolean;
  created_time: string;       
}


export interface IBookedSlot {
  _id: string;
  userId: string;
  slotId: string | ISlot;
  expertId: string;
  payment_method: string;
  payment_status: boolean;
  consultation_status: string;
  farmer_details: IFarmerDetails;
  created_time: string;
  roomId: string;
  prescription_id: string;
}

interface IFarmerDetails {
  name: string;
  email: string;
  age: number;
  gender: string;
  address: string;
  reason_for_visit: string;
}
