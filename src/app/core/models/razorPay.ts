export interface RazorpayPrefill {
  name?: string;
  email?: string;
  contact?: string; 
}

export interface RazorpayTheme {
  color?: string;
}

export interface RazorpayModal {
  ondismiss?: () => void;
}

export interface RazorpayOptions {
  key?: string;
  amount?: number;
  currency: string;
  name: string;
  description?: string;
  image?: string;
  order_id?: string;
  prefill?: RazorpayPrefill;
  theme?: RazorpayTheme;
  modal?: RazorpayModal;
  handler: (response: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) => void;
}

export interface RazorpayInstance {
  open: () => void;
  close: () => void;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}
