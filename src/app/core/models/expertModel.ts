export interface Expert{
    firstName:string,
    lastName:string,
    email:string,
    contactno:string,
    specialisation:string,
    current_working_address:string,
    experience:string,
    consultation_fee:string,
    identity_proof_type:string,
    identity_proof:File,
    expert_liscence:File,
    qualification_certificate:File,
    experience_certificate:File,
    password:string,
    blocked:boolean
}

//getting data when login success
export interface ExpertLoginResponseModel{
    accessToken?:string,
    refreshToken?: string;
    accessedUser?:ExpertInfo,
    message:string,
    email?:string
}

// store setting
export interface ExpertInfo{
    _id:string,
    firstName:string,
    lastName:string,
    email:string,
    role:string,
    isverified:boolean,
    blocked:boolean
}


//login model
export interface LoginModel{
    email:string,
    password:string
}

//message model
export interface Msg {
    message: string;
  }


export interface ExpertState{
  message?: Msg;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  otp?: number;
  isverified?: boolean;
  blocked?: boolean;
}

//model for state
export interface ExpertModel {
  list: ExpertState[];
  userobj: ExpertState;
  errormessage: string;
}




export interface upcomingAppointment{
    expertId:string
}

export interface Email{
    email:string
}



