import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

/**
 * HTTP Interceptor that automatically adds JWT token to all requests
 * and handles 401 unauthorized errors with token refresh
 */
export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Skip token attachment for login/register endpoints
  const skipAuth = req.url.includes('/auth/login') || 
                   req.url.includes('/auth/register') ||
                   req.url.includes('/auth/refresh-token');

  if (skipAuth) {
    return next(req);
  }

  // Get the auth token from AuthService
  let token: string | null = null;
  try {
    token = authService?.getToken?.() ?? null;
  } catch (error) {
    console.error('Error getting token from AuthService:', error);
  }

  // Clone the request and add authorization header if token exists
  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // Handle the request and catch 401 errors
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // If 401 Unauthorized, try to refresh the token
      if (error.status === 401 && !req.url.includes('/auth/refresh-token')) {
        return handleUnauthorized(authReq, next, authService, router);
      }

      // For other errors, just pass them through
      return throwError(() => error);
    })
  );
};

/**
 * Handle 401 unauthorized errors by attempting to refresh the token
 */
function handleUnauthorized(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
  authService: AuthService,
  router: Router
): Observable<HttpEvent<unknown>> {
  // Check if we have a refresh token
  const refreshToken = localStorage.getItem('refreshToken');
  
  if (!refreshToken) {
    // No refresh token, redirect to login
    authService.logout();
    router.navigate(['/auth']);
    return throwError(() => new Error('No refresh token available'));
  }

  // Try to refresh the token
  return authService.refreshToken().pipe(
    switchMap((response) => {
      // Token refreshed successfully, retry the original request with new token
      const newAuthReq = request.clone({
        setHeaders: {
          Authorization: `Bearer ${response.accessToken}`
        }
      });
      return next(newAuthReq);
    }),
    catchError((error) => {
      // Refresh failed, logout and redirect
      authService.logout();
      router.navigate(['/auth']);
      return throwError(() => error);
    })
  );
}
