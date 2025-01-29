export interface User {
  message?: Msg;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  otp?: number;
  isverified?: boolean;
  blocked?: boolean;
}

//message model
export interface Msg {
  message: string;
}

//model for registration
export interface UserRegister {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  otp: number;
}

//model for state
export interface UserModel {
  list: User[];
  userobj: User;
  errormessage: string;
}

//login model
export interface LoginModel {
  email: string;
  password: string;
}

// store setting
export interface UserInfo {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
  wallet?: number;
  blocked:boolean;
}

//getting data when login success
export interface LoginResponseModel {
  accessToken?: string;
  refreshToken?:string;
  accessedUser?: UserInfo;
  message: string;
  email?: string;
}

export interface ChatAccessData {
  userId: string;
}

// admin side
export interface UserData {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  is_verified: boolean;
  blocked: boolean;
}
