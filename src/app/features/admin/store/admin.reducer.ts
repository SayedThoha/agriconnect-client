import { state } from "@angular/animations"
import { createReducer, on } from "@ngrx/store"
import { loginadminSuccess } from "./admin.action"
import { expert_state } from "../../../core/store/expert/expert.state"


const _adminReducer=createReducer(expert_state,
    on(loginadminSuccess,(state,action)=>{
        const admin={...action.data}
        console.log('admin reducer')
        return {
            ...state,
            adminInfo:{
            _id:admin._id,
            email:admin.email,
            role:admin.role,
            payOut:admin.payOut
            }
        }
    })
)

export function adminReducer(state:any,action:any){
    return _adminReducer(state,action)
}