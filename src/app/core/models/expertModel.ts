export interface Expert{
    firstNmae:string,
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
    password:string
}

//getting data when login success
export interface ExpertLoginResponseModel{
    accessToken:string,
    accessedUser:ExpertInfo,
    message:string,
    email?:string
}

// store setting
export interface ExpertInfo{
    _id:string,
    firstName:string,
    lastName:string,
    email:string,
    role:string
}

//login model
export interface LoginModel{
    email:string,
    password:string
}





// export type upcomingAppointment={
//     doctorId:string
// }

export interface upcomingAppointment{
    expertId:string
}

export interface Email{
    email:string
}



// // admin side verification
// interface ExpertData{
//     _id?:string,
//     firstName:string,
//     lastName:string,
//     email:string,
//     contactno:number,
//     profile_picture?:string,
//     specialization:string,
//     current_working_address:string,
//     experience:string,
//     consultation_fee:number,
//     qualification_certificate?:[string],
//     experience_certificate?:[string],
//     liscence?:string,
//     identity_proof_type?:string,
//     identity_proof?:string,
//     kyc_verification?:string,
//     blocked?:string
// }

// interface kyc_verification{
//     _id:string,
//     docId:ExpertData,
//     exp_certificate:string,
//     qualification_certificate:string,
//     liscence:string,
//     id_proof_type:string
//     id_proof:string,
//     specialisation:string,
//     curr_work:string,
// }

// interface Specialisation{
//     _id:string,
//     specialisation:string
// }