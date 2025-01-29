
//admin.effects.ts
import { inject, Injectable, OnInit } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { AdminServiceService } from "../services/admin-service.service";
import { Router } from "@angular/router";
import { adminlogin, login_admin_success, loginadminFailure, loginadminSuccess, logoutadmin } from "./admin.action";
import { catchError, exhaustMap, map, of, tap } from "rxjs";
import { MessageToasterService } from "../../../shared/services/message-toaster.service";

@Injectable()

export class adminEffects{
    private actions$=inject(Actions)
    constructor(
        
        private adminService:AdminServiceService,
        private messageToaster:MessageToasterService ,
        private router:Router
    ){}

   

    _adminLogin=createEffect(()=>
        this.actions$.pipe(
            ofType(adminlogin),
            exhaustMap((action)=>{
                console.log('admin login effects')
                return this.adminService.adminLogin(action.data).pipe(
                    map((data)=>{
                        console.log('data from admin efects:',data)
                        if(data.accessedUser){
                            console.log('admin accesed user:',data.accessedUser._id);
                            console.log('admin accesed user:',data.accessedUser.payOut);
                            
                            localStorage.setItem('adminToken',data.accessToken)
                            localStorage.setItem('admindetails',JSON.stringify(data.accessedUser))

                            
                            this.messageToaster.showSuccessToastr(data.message)
                            console.log('message toster up');
                            this.router.navigate(['/admin/adminHome'])
                            console.log('navigation up');
                            return loginadminSuccess({data:data.accessedUser})
                        }else{
                            console.log('If no data',data)
                            return;
                        }
                    }),
                    catchError((error)=>{
                        console.log(error.error.message)
                        this.messageToaster.showErrorToastr(error.error.message)
                        return of(error.message)
                        // return of(loginadminFailure({ error: error.error.message }));
                    })
                )
            })
        )

    );

     _adminLogout = createEffect(() =>
        this.actions$.pipe(
          ofType(logoutadmin),
          tap(() => {
            localStorage.removeItem('adminToken');
            localStorage.removeItem('admindetails');
            this.router.navigate(['/admin/login']);
          })
        ),
        { dispatch: false }
      );

}