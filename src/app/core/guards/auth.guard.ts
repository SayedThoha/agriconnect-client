//auth.guard.ts

import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  // const router = new Router();
  const router = inject(Router);
  // console.log(route, state);

  const userToken = localStorage.getItem('userToken');
  const expertToken = localStorage.getItem('expertToken');

  if (userToken) {
    router.navigate(['/user/userHome']);
    return false;
  }

  if (expertToken) {
    router.navigate(['/expert/expertHome']);
    return false;
  }
  //allow access if there is no token
  return true;
};
