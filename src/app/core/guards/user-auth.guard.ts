import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';

export const userLoggedInGuard: CanActivateFn = () => {
  const userAuth = inject(AuthService);
  const router = inject(Router);

  if (userAuth.checkUserLoggedIn()) {
    return true;
  } else {
    router.navigate(['/home']);
    return false;
  }
};

export const userLoggedOutGuard: CanActivateFn = () => {
  const userAuth = inject(AuthService);
  const router = inject(Router);

  if (userAuth.checkUserLoggedIn()) {
    router.navigate(['/user/userHome']);
    return false;
  } else {
    return true;
  }
};
