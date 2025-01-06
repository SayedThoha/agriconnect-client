//user.effects.ts

import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { UserService } from "../../../shared/services/user.service";
import { loginUser, loginUserSuccess } from "./user.actions";
import { catchError, exhaustMap, map, of } from "rxjs";
import { MessageToasterService } from "../../../shared/services/message-toaster.service";

import { Router } from "@angular/router";



@Injectable()
export class UserEffects {
    private actions$=inject(Actions)
    //  private actions$: Actions,
    constructor(
       
        private userService: UserService,
        private showMessage: MessageToasterService,
        private router: Router
    ) { }

    _loginUser = createEffect(() =>
        this.actions$.pipe(
            ofType(loginUser),
            exhaustMap((action) => {
                // console.log('login effects')
                console.log('Effect triggered with action:', action);
                return this.userService.userLogin(action.data).pipe(
                    map((data) => {
                        const userdata = data
                        if (userdata.email) {
                            console.log('userdata:', userdata);
                            localStorage.setItem('email', userdata.email);
                            localStorage.setItem('role', 'userVerification')
                            this.router.navigate(['/user/verifyOtp'])
                            // return{ type: '[Login] Verification Required' };
                            return;
                        } else if (userdata && userdata.accessToken && userdata.accessedUser) {

                            console.log('response from backend: userdata while login:', userdata)
                            localStorage.setItem('userToken', userdata.accessToken)
                            localStorage.setItem('userId', userdata.accessedUser._id)
                            console.log('userId:', localStorage.getItem('userId'))
                            this.showMessage.showSuccessToastr(userdata.message)
                            this.router.navigate(['/user/userHome'])  //page after login--->correct it
                            return loginUserSuccess({ data: userdata.accessedUser })
                        } else {
                            // return { type: '[Login] No Action' };
                            return;
                        }
                    }),
                    catchError((error) => {
                        console.log('error', error)
                        console.log('error.error:', error.error)
                        console.log('error.error.message:', error.error.message)
                        this.showMessage.showErrorToastr(error.error.message)
                        return of(error.message)
                        // return of({ type: '[Login] Error', payload: error.message });
                    })
                )
            })
        )
    )
    
}



