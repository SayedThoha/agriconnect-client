// user-auth.guard.ts

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';

export const userLoggedInGuard: CanActivateFn = (route, state) => {
  // console.log(route, state);

  const userAuth = inject(AuthService);
  const router = inject(Router);

  if (userAuth.checkUserLoggedIn()) {
    return true;
  } else {
    router.navigate(['/home']);
    return false;
  }

  
};

//check user LoggedOut or not
export const userLoggedOutGuard: CanActivateFn = (route, state) => {
  // console.log(route, state);
  const userAuth = inject(AuthService);
  const router = inject(Router);

  if (userAuth.checkUserLoggedIn()) {
    router.navigate(['/user/userHome']);
    return false;
  } else {
    return true;
  }
};
