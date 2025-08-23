import { UserModel } from "../../models/userModel";

export const userstate:UserModel={
    list:[],
    errormessage:'',
    userobj:{
        firstname:'',
        lastname:'',
        email:'',
        password:'',
        otp:0,
        isverified:false,
        blocked:false
    }
}


export const user_State = {
        userInfo:{
           _id:'',
           firstName:'',
           lastName:'',
           email:'',
           role:''
        }
     }


     