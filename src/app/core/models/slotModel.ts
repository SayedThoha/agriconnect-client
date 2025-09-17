import { IExpert } from './expertModel';
import { IUser } from './userModel';

export interface Slot {
  _id: string;
  expertId: IExpert;
  time: Date;
  booked: boolean;
  bookingAmount: number;
  adminPaymentAmount: number;
  cancelled: boolean;
  created_time: Date;
}

export interface BookedSlot {
  _id: string;
  userId: IUser;
  slotId: Slot;
  expertId: IExpert;
  payment_method: string;
  payment_status: boolean;
  consultation_status: string;
  farmer_details: IFarmerDetails;
  created_time: Date;
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

export interface IPrescription {
  _id: string;
  bookedSlot: BookedSlot;
  issue: string;
  prescription: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GroupedPrescription {
  name: string;
  prescriptions: IPrescription[];
}

export interface PaymentOrder {
  success: boolean;
  fee?: number ;
  key_id?: string;
  order_id?: string;
  message?: string;
}
