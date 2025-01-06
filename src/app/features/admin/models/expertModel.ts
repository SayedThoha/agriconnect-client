export interface expertData{
    _id?:string,
    firstName:string,
    lastName:string,
    email:string,
    contactno:Number,
    profile_picture?:string,
    specialisation:string,
    current_working_address:string,
    experience:string,
    consultation_fee:Number,
    qualification_certificate?:[string],
    experience_certificate?:[string],
    liscence?:string,
    identity_proof_type?:string,
    identity_proof?:string,
    kyc_verification?:string,
    blocked?:string
}

export interface kyc_verification{
    _id:string,
    expertId:expertData,
    exp_certificate:string,
    qualification_certificate:string,
    liscence:string,
    id_proof_type:string
    id_proof:string,
    specialisation:string,
    curr_work:string,
}

export interface specialisation{
    _id:string,
    specialisation:string
}