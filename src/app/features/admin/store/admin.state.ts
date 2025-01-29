// //admin.state.ts

// export const adminState = {
//   adminInfo: {
//     _id: '',
//     email: '',
//     role: '',
//     payOut:''
//   },
// };

// export interface adminState  {
//   adminInfo: {
//     _id: string,
//     email: string,
//     role: string,
//     payOut:number
//   };
// };


// export interface Adminlogin {
//   email: string;
//   password: string;
// }

// export interface adminInfo {
//   _id: '';
//   email: '';
//   role: '';
//   payOut:''
// }

// admin.state.ts
export interface adminState {
  adminInfo: adminInfo;
}

export interface Adminlogin {
  email: string;
  password: string;
}

export interface adminInfo {
  _id: string;
  email: string;
  role: string;
  payOut: number;
}

export const admin_state: adminState = {
  adminInfo: {
    _id: '',
    email: '',
    role: '',
    payOut: 0
  }
};