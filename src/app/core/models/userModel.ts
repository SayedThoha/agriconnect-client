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

export interface Msg {
  message: string;
}

export interface UserRegister {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  otp: number;
}

export interface UserModel {
  list: User[];
  userobj: User;
  errormessage: string;
}

export interface LoginModel {
  email: string;
  password: string;
}

export interface UserInfo {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
  wallet?: number;
  blocked: boolean;
}

export interface LoginResponseModel {
  accessToken?: string;
  refreshToken?: string;
  accessedUser?: UserInfo;
  message: string;
  email?: string;
}

export interface ChatAccessData {
  userId: string;
}

export interface UserData {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  is_verified: boolean;
  blocked: boolean;
}

export interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  is_verified?: boolean;
  role?: string;
  blocked?: boolean;
  created_time?: Date;
  wallet?: number;
  profile_picture?: string;
  googleId: string;
  authProvider: string;
}
