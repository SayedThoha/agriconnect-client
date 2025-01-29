//expert-auth.guard.ts

import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';


export const expertLoggedInGuard: CanActivateFn = (route, state) => {
  console.log(route, state);
  const expertAuth = inject(AuthService);
  const router = inject(Router);

  if (expertAuth.checkExpertLoggedIn()) {
    return true;
  } else {
    router.navigate(['/home']);
    return false;
  }
};


//check user LoggedOut or not
export const expertLoggedOutGuard: CanActivateFn = (route, state) => {
  console.log(route, state);
  const expertAuth = inject(AuthService);
  const router = inject(Router);

  if (expertAuth.checkExpertLoggedIn()) {
    router.navigate(['/expert/expertHome']);
    return false;
  } else {
    return true;
  }
};
