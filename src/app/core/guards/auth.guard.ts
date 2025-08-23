import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

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

  return true;
};
