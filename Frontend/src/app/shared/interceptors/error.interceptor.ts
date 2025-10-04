// File: Frontend/src/app/shared/interceptors/error.interceptor.ts
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const messageService = inject(MessageService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unexpected error occurred';
      let severity: 'success' | 'info' | 'warn' | 'error' = 'error';

      switch (error.status) {
        case 400:
          errorMessage = error.error?.message || 'Bad request. Please check your input.';
          break;
        case 401:
          errorMessage = 'Your session has expired. Please log in again.';
          // Clear tokens and redirect to login
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('userEmail');
          localStorage.removeItem('userRole');
          router.navigate(['/login']);
          break;
        case 403:
          errorMessage = 'You do not have permission to perform this action.';
          break;
        case 404:
          errorMessage = error.error?.message || 'The requested resource was not found.';
          break;
        case 409:
          errorMessage = error.error?.message || 'A conflict occurred. The resource may already exist.';
          break;
        case 422:
          errorMessage = error.error?.message || 'Validation failed. Please check your input.';
          break;
        case 500:
          errorMessage = 'A server error occurred. Please try again later.';
          break;
        case 503:
          errorMessage = 'The service is temporarily unavailable. Please try again later.';
          break;
        default:
          if (error.error?.message) {
            errorMessage = error.error.message;
          } else if (error.message) {
            errorMessage = error.message;
          }
      }

      // Show toast notification
      messageService.add({
        severity: severity,
        summary: 'Error',
        detail: errorMessage,
        life: 5000
      });

      console.error('HTTP Error:', {
        status: error.status,
        message: errorMessage,
        url: req.url,
        error: error.error
      });

      return throwError(() => error);
    })
  );
};
