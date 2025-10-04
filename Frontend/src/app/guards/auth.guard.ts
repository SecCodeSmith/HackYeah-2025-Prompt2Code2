import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Route guard that protects routes requiring authentication
 * Redirects to login page if user is not authenticated
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  } else {
    // Store the attempted URL for redirecting after login
    const returnUrl = state.url;
    router.navigate(['/auth'], { queryParams: { returnUrl } });
    return false;
  }
};

/**
 * Route guard that protects admin-only routes
 * Redirects to home if user is not an admin or supervisor
 * Allowed roles: Admin, Administrator, Supervisor
 */
export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/auth']);
    return false;
  }

  const user = authService.currentUser();
  const allowedRoles = ['Admin', 'Administrator', 'Supervisor'];
  
  if (user && allowedRoles.includes(user.role)) {
    return true;
  } else {
    router.navigate(['/']);
    return false;
  }
};
