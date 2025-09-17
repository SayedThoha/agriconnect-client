import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { CommonService } from '../../shared/services/common.service';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { TokenService } from '../../shared/services/token.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const commonService = inject(CommonService);
  const router = inject(Router);

  const tokenService = inject(TokenService);
  const s3BucketUrl = 'https://agriconnect.s3.ap-south-1.amazonaws.com';

  if (
    req.url.includes('cloudinary.com') ||
    req.url.includes('googleapis.com') ||
    req.url.includes(s3BucketUrl)
  ) {
    return next(req);
  }

  const userToken = commonService.getTokenFromLocalStorage();
  const expertToken = commonService.getExpertTokenFromLocalStorage();

  const adminToken = commonService.getAdminTokenFromLocalStorage();
  let authRequest = req;

  if (window.location.pathname.includes('/user') && userToken) {
    authRequest = req.clone({
      setHeaders: {
        'Content-Type': 'application/json',
        Authorization: `user-Bearer ${userToken}`,
      },
    });
  } else if (window.location.pathname.includes('/expert') && expertToken) {
    authRequest = req.clone({
      setHeaders: {
        'Content-Type': 'application/json',
        Authorization: `expert-Bearer ${expertToken}`,
      },
    });
  } else if (window.location.pathname.includes('/admin') && adminToken) {
    authRequest = req.clone({
      setHeaders: {
        'Content-Type': 'application/json',
        Authorization: `admin-Bearer ${adminToken}`,
      },
    });
  }

  return next(authRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        if (window.location.pathname.includes('/user')) {
          return tokenService.refreshUserAccessToken().pipe(
            switchMap(() => {
              const updatedToken = localStorage.getItem('userToken');
              const clonedReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${updatedToken}`,
                },
              });
              return next(clonedReq);
            }),
            catchError(() => {
              localStorage.clear();
              router.navigate(['/home']);
              return throwError(() => error);
            })
          );
        } else if (window.location.pathname.includes('/expert')) {
          return tokenService.refreshExpertAccessToken().pipe(
            switchMap(() => {
              const updatedToken = localStorage.getItem('expertToken');
              const clonedReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${updatedToken}`,
                },
              });
              return next(clonedReq);
            }),
            catchError(() => {
              localStorage.clear();
              router.navigate(['/home']);
              return throwError(() => error);
            })
          );
        }
      }
      if (error.status === 403) {
        if (window.location.pathname.includes('/user')) {
          localStorage.removeItem('userToken');
          localStorage.removeItem('userRefreshToken');
        } else if (window.location.pathname.includes('/expert')) {
          localStorage.removeItem('expertToken');
          localStorage.removeItem('expertRefreshToken');
        } else if (window.location.pathname.includes('/admin')) {
          localStorage.removeItem('adminToken');
        }

        console.error('403 Forbidden - Redirecting to home page');
        router.navigate(['/home']);
      }

      return throwError(() => error);
    })
  );
};
