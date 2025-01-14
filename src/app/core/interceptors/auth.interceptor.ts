import { HttpErrorResponse, HttpHandler, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { CommonService } from '../../shared/services/common.service';
import { Router } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // return next(req);

  const commonService = inject(CommonService);
  const router = inject(Router);

  // Skip interceptor for Cloudinary requests
  if (req.url.includes('cloudinary.com')|| req.url.includes('googleapis.com')) {
    return next(req);
  }

  const userToken = commonService.getTokenFromLocalStorage();
  const expertToken = commonService.getExpertTokenFromLocalStorage();
   // Assuming you have a method for admin token
   const adminToken = localStorage.getItem('adminToken'); 

   let authRequest = req;

   
  // Add appropriate headers based on the current route
  if (window.location.pathname.includes('/user') && userToken) {
    authRequest = req.clone({
      setHeaders: {
        'Content-Type': 'application/json',
        Authorization: `user-Bearer ${userToken}`
      }
    });
  } else if (window.location.pathname.includes('/expert') && expertToken) {
    authRequest = req.clone({
      setHeaders: {
        'Content-Type': 'application/json',
        Authorization: `expert-Bearer ${expertToken}`
      }
    });
  } else if (window.location.pathname.includes('/admin') && adminToken) {
    authRequest = req.clone({
      setHeaders: {
        'Content-Type': 'application/json',
        Authorization: `admin-Bearer ${adminToken}`
      }
    });

    
  }

  return next(authRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 403) {
        // Handle 403 Forbidden error
        if (window.location.pathname.includes('/user')) {
          localStorage.removeItem('userToken');
        } else if (window.location.pathname.includes('/expert')) {
          localStorage.removeItem('expertToken');
        } else if (window.location.pathname.includes('/admin')) {
          localStorage.removeItem('adminToken');
        }

        console.log('403 Forbidden - Redirecting to home page');
        router.navigate(['/home']);
      }
      return throwError(() => error);
    })
  );
};
