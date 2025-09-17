import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AdminServiceService } from '../services/admin-service.service';
import { Router } from '@angular/router';
import { adminlogin, loginadminSuccess, logoutadmin } from './admin.action';
import { catchError, exhaustMap, map, of, tap } from 'rxjs';
import { MessageToasterService } from '../../../shared/services/message-toaster.service';

@Injectable()
export class adminEffects {
  private actions$ = inject(Actions);
  constructor(
    private adminService: AdminServiceService,
    private messageToaster: MessageToasterService,
    private router: Router
  ) {}

  _adminLogin = createEffect(() =>
    this.actions$.pipe(
      ofType(adminlogin),
      exhaustMap((action) => {
        return this.adminService.adminLogin(action.data).pipe(
          map((data) => {
            if (data.accessedUser) {
              localStorage.setItem('adminToken', data.accessToken);
              localStorage.setItem(
                'admindetails',
                JSON.stringify(data.accessedUser)
              );

              this.messageToaster.showSuccessToastr(data.message);

              this.router.navigate(['/admin/adminHome']);

              return loginadminSuccess({ data: data.accessedUser });
            } else {
              return;
            }
          }),
          catchError((error) => {
            console.error(error.error.message);
            this.messageToaster.showErrorToastr(error.error.message);
            return of(error.message);
          })
        );
      })
    )
  );

  _adminLogout = createEffect(
    () =>
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
