import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs';
import { selectAdmin } from '../store/admin.selector';

export const adminLoggedInGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const router = inject(Router);

  console.warn(route, state);
  return store.select(selectAdmin).pipe(
    take(1),
    map((adminInfo) => {
      const isLoggedIn = adminInfo?._id && localStorage.getItem('adminToken');

      if (isLoggedIn) {
        router.navigate(['/admin/adminHome']);
        return false;
      } else {
        return true;
      }
    })
  );
};

export const adminLoggedOutGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const router = inject(Router);
  console.warn(route, state);

  return store.select(selectAdmin).pipe(
    take(1),
    map((adminInfo) => {
      const isLoggedIn = adminInfo?._id && localStorage.getItem('adminToken');

      if (isLoggedIn) {
        router.navigate(['/admin/adminHome']);
        return false;
      } else {
        return true;
      }
    })
  );
};
