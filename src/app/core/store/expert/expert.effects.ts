import { ExpertService } from '../../../shared/services/expert.service';
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { exhaustMap, map, catchError, of } from 'rxjs';
import { loginExpert, loginExpertSuccess } from './expert.actions';
import { Router } from '@angular/router';
import { MessageToasterService } from '../../../shared/services/message-toaster.service';

@Injectable()
export class expertEffects {
  private action$ = inject(Actions);
  
  constructor(
    // private action$: Actions,
    private expertService: ExpertService,
    private showMessage: MessageToasterService,
    private router: Router
  ) {}

  // ngOnInit(){
  //     console.log('expert effects')
  // }

  _loginExpert = createEffect(() =>
    this.action$.pipe(
      ofType(loginExpert),
      exhaustMap((action) => {
        console.log('expert login effects');
        return this.expertService.expertLogin(action.data).pipe(
          map((data) => {
            const expertData = data;
            if (expertData.email) {
              console.log('userdata:', expertData);
              localStorage.setItem('email', expertData.email);
              localStorage.setItem('role', 'expertVerification');
              this.router.navigate(['/expert/verifyOtp']);
              return;
            } else if (
              expertData &&
              expertData.accessToken &&
              expertData.accessedUser
            ) {
              localStorage.setItem('expertToken', expertData.accessToken);
              localStorage.setItem('expertId', expertData.accessedUser._id);
              console.log('expertId in effects:', expertData.accessedUser._id);
              console.log(
                'expertId in effects:',
                localStorage.getItem('expertId') as string
              );

              this.showMessage.showSuccessToastr(expertData.message);
              this.router.navigate(['/expert/expertHome']); //page after login
              return loginExpertSuccess({ data: expertData.accessedUser });
            } else {
              return;
            }
          }),
          catchError((error) => {
            console.log('error.error.message:', error.error.message);
            this.showMessage.showErrorToastr(error.error.message);
            return of(error.message);
          })
        );
      })
    )
  );
}
