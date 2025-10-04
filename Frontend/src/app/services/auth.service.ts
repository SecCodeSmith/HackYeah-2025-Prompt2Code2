import { Injectable, signal, computed } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';

// DTOs matching backend models
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  user: UserDto;
}

export interface UserDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: string;
  isActive: boolean;
  emailConfirmed: boolean;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:5000/api/auth';
  private readonly TOKEN_KEY = 'accessToken';
  private readonly REFRESH_TOKEN_KEY = 'refreshToken';
  private readonly USER_KEY = 'currentUser';

  // Signals for reactive state management
  private currentUserSubject = new BehaviorSubject<UserDto | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();
  
  // Signal-based state
  isAuthenticated = signal<boolean>(this.hasValidToken());
  currentUser = signal<UserDto | null>(this.getUserFromStorage());
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Check token validity on service initialization
    this.checkAuthStatus();
  }

  /**
   * User login
   */
  login(email: string, password: string): Observable<AuthResponse> {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    const loginRequest: LoginRequest = { email, password };

    return this.http.post<AuthResponse>(`${this.API_URL}/login`, loginRequest).pipe(
      tap(response => {
        this.handleAuthSuccess(response);
      }),
      catchError(error => {
        this.handleAuthError(error);
        return throwError(() => error);
      }),
      tap(() => this.isLoading.set(false))
    );
  }

  /**
   * User registration
   */
  register(registerData: RegisterRequest): Observable<AuthResponse> {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    return this.http.post<AuthResponse>(`${this.API_URL}/register`, registerData).pipe(
      tap(response => {
        this.handleAuthSuccess(response);
      }),
      catchError(error => {
        this.handleAuthError(error);
        return throwError(() => error);
      }),
      tap(() => this.isLoading.set(false))
    );
  }

  /**
   * User logout
   */
  logout(): void {
    const refreshToken = this.getRefreshToken();
    
    if (refreshToken) {
      // Attempt to revoke token on server
      this.http.post(`${this.API_URL}/revoke-token`, refreshToken).subscribe({
        error: (error) => console.error('Token revocation failed:', error)
      });
    }

    this.clearAuthData();
    this.router.navigate(['/auth']);
  }

  /**
   * Refresh access token
   */
  refreshToken(): Observable<AuthResponse> {
    const accessToken = this.getToken();
    const refreshToken = this.getRefreshToken();

    if (!accessToken || !refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post<AuthResponse>(`${this.API_URL}/refresh-token`, {
      accessToken,
      refreshToken
    }).pipe(
      tap(response => {
        this.handleAuthSuccess(response);
      }),
      catchError(error => {
        this.clearAuthData();
        this.router.navigate(['/auth']);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get current user profile from server
   */
  getCurrentUser(): Observable<UserDto> {
    return this.http.get<UserDto>(`${this.API_URL}/me`).pipe(
      tap(user => {
        this.currentUser.set(user);
        this.currentUserSubject.next(user);
        this.saveUserToStorage(user);
      }),
      catchError(error => {
        console.error('Failed to fetch current user:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get current user synchronously from signal
   */
  getCurrentUserSync(): UserDto | null {
    return this.currentUser();
  }

  /**
   * Check if user has specific role
   */
  hasRole(role: string): boolean {
    const user = this.currentUser();
    return user ? user.role === role : false;
  }

  /**
   * Check if user has any of the specified roles
   */
  hasAnyRole(roles: string[]): boolean {
    const user = this.currentUser();
    return user ? roles.includes(user.role) : false;
  }

  /**
   * Get user's full name
   */
  getUserFullName(): string {
    const user = this.currentUser();
    return user ? `${user.firstName} ${user.lastName}` : '';
  }

  /**
   * Get user's initials
   */
  getUserInitials(): string {
    const user = this.currentUser();
    if (user && user.firstName && user.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
    }
    return 'U';
  }

  /**
   * Change password
   */
  changePassword(currentPassword: string, newPassword: string, confirmNewPassword: string): Observable<any> {
    return this.http.post(`${this.API_URL}/change-password`, {
      currentPassword,
      newPassword,
      confirmNewPassword
    });
  }

  /**
   * Get stored JWT token
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Get stored refresh token
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  /**
   * Check if user has valid token
   */
  private hasValidToken(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }

    try {
      const payload = this.decodeToken(token);
      const expirationDate = new Date(payload.exp * 1000);
      return expirationDate > new Date();
    } catch {
      return false;
    }
  }

  /**
   * Decode JWT token
   */
  private decodeToken(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  /**
   * Check authentication status on init
   */
  private checkAuthStatus(): void {
    if (this.hasValidToken()) {
      this.isAuthenticated.set(true);
      // Optionally fetch fresh user data
      this.getCurrentUser().subscribe({
        error: () => {
          this.clearAuthData();
        }
      });
    } else {
      this.clearAuthData();
    }
  }

  /**
   * Handle successful authentication
   */
  private handleAuthSuccess(response: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, response.accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, response.refreshToken);
    this.saveUserToStorage(response.user);
    
    this.currentUser.set(response.user);
    this.currentUserSubject.next(response.user);
    this.isAuthenticated.set(true);
    this.errorMessage.set(null);

    console.log('Authentication successful for:', response.user.email);
    
    // Navigate to the dashboard or return URL after successful authentication
    const returnUrl = this.getReturnUrl();
    this.router.navigate([returnUrl]);
  }

  /**
   * Get the return URL from query params or default to home
   */
  private getReturnUrl(): string {
    // Check if there's a stored return URL from the auth guard
    const urlParams = new URLSearchParams(window.location.search);
    const returnUrl = urlParams.get('returnUrl');
    return returnUrl || '/';
  }

  /**
   * Handle authentication error
   */
  private handleAuthError(error: HttpErrorResponse): void {
    let errorMessage = 'An error occurred during authentication';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage = error.error?.message || `Server returned code ${error.status}`;
    }

    this.errorMessage.set(errorMessage);
    this.isLoading.set(false);
    console.error('Authentication error:', errorMessage);
  }

  /**
   * Clear all authentication data
   */
  private clearAuthData(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    
    this.currentUser.set(null);
    this.currentUserSubject.next(null);
    this.isAuthenticated.set(false);
  }

  /**
   * Save user to localStorage
   */
  private saveUserToStorage(user: UserDto): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  /**
   * Get user from localStorage
   */
  private getUserFromStorage(): UserDto | null {
    const userJson = localStorage.getItem(this.USER_KEY);
    if (userJson) {
      try {
        return JSON.parse(userJson);
      } catch {
        return null;
      }
    }
    return null;
  }

  /**
   * Check if token is expired or about to expire (within 5 minutes)
   */
  isTokenExpiringSoon(): boolean {
    const token = this.getToken();
    if (!token) {
      return true;
    }

    try {
      const payload = this.decodeToken(token);
      const expirationDate = new Date(payload.exp * 1000);
      const fiveMinutesFromNow = new Date(Date.now() + 5 * 60 * 1000);
      return expirationDate < fiveMinutesFromNow;
    } catch {
      return true;
    }
  }
}
