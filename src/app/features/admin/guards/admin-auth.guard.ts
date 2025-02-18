import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { adminState } from '../store/admin.state';
import { map, take } from 'rxjs';
import { selectAdmin } from '../store/admin.selector';


// Guard for checking if the user is logged in
export const adminLoggedInGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const router = inject(Router);

  // Check if the admin is logged in using the store or localStorage
  return store.select(selectAdmin).pipe(
    take(1), // Take only the first emitted value
    map((adminInfo) => {
      const isLoggedIn = adminInfo?._id && localStorage.getItem('adminToken');

      if (isLoggedIn) {
        // If logged in, navigate to the admin home page
        router.navigate(['/admin/adminHome']);
        return false;
      } else {
        // If not logged in, allow access to the login page
        return true;
      }
    })
  );
};


// Guard for checking if the user is logged out
export const adminLoggedOutGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const router = inject(Router);

  // Check if the admin is logged in using the store or localStorage
  return store.select(selectAdmin).pipe(
    take(1), // Take only the first emitted value
    map((adminInfo) => {
      const isLoggedIn = adminInfo?._id && localStorage.getItem('adminToken');

      if (isLoggedIn) {
        // If logged in, redirect to the admin home page
        router.navigate(['/admin/adminHome']);
        return false;
      } else {
        // If not logged in, allow access to the requested page
        return true;
      }
    })
  );
};
