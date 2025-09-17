import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { inject } from '@angular/core';

export const expertLoggedInGuard: CanActivateFn = () => {
  const expertAuth = inject(AuthService);
  const router = inject(Router);

  if (expertAuth.checkExpertLoggedIn()) {
    return true;
  } else {
    router.navigate(['/home']);
    return false;
  }
};

export const expertLoggedOutGuard: CanActivateFn = () => {
  const expertAuth = inject(AuthService);
  const router = inject(Router);

  if (expertAuth.checkExpertLoggedIn()) {
    router.navigate(['/expert/expertHome']);
    return false;
  } else {
    return true;
  }
};
