// user.state.ts

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
// export interface UserState {
//     userInfo: {
//         _id: string;
//         firstName: string;
//         lastName: string;
//         email: string;
//         role: string;
//     };
// }

// export const user_State:UserState = {
//     userInfo:{
//        _id:'',
//        firstName:'',
//        lastName:'',
//        email:'',
//        role:''
//     }
//  }

export const user_State = {
        userInfo:{
           _id:'',
           firstName:'',
           lastName:'',
           email:'',
           role:''
        }
     }