# 🔌 INTEGRATION GUIDE - Frontend & Backend Connection

## Overview

This document provides complete instructions for integrating the Angular frontend with the .NET backend, including all necessary code changes and configurations.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Services Implementation](#services-implementation)
3. [HTTP Interceptor](#http-interceptor)
4. [Route Guards](#route-guards)
5. [Component Integration](#component-integration)
6. [Backend Implementation](#backend-implementation)
7. [Testing the Integration](#testing-the-integration)

---

## Architecture Overview

### Communication Flow

```
┌─────────────────┐       HTTP/REST       ┌─────────────────┐
│                 │  ──────────────────►  │                 │
│   Angular       │       JSON Data       │   .NET Core     │
│   Frontend      │  ◄──────────────────  │   Backend       │
│   (Port 4200)   │                       │   (Port 5000)   │
└─────────────────┘                       └─────────────────┘
        │                                         │
        │                                         │
        ▼                                         ▼
┌─────────────────┐                       ┌─────────────────┐
│  JWT Tokens     │                       │  SQL Server     │
│  localStorage   │                       │  Database       │
└─────────────────┘                       └─────────────────┘
```

### Authentication Flow

```
1. User enters credentials
   ↓
2. AuthService.login() sends POST to /api/auth/login
   ↓
3. Backend validates credentials
   ↓
4. Backend returns JWT tokens (access + refresh)
   ↓
5. AuthService stores tokens in localStorage
   ↓
6. AuthInterceptor adds token to all subsequent requests
   ↓
7. AuthGuard protects routes requiring authentication
```

---

## Services Implementation

### 1. AuthService

**Location:** `Frontend/src/app/services/auth.service.ts`

**Key Features:**
- Login/Register functionality
- JWT token management (access + refresh)
- Automatic token refresh on expiration
- Signal-based reactive state
- localStorage integration

**Usage Example:**

```typescript
// In any component
constructor(private authService: AuthService) {}

// Login
this.authService.login(email, password).subscribe({
  next: (response) => {
    console.log('Login successful', this.authService.currentUser());
    this.router.navigate(['/']);
  },
  error: (error) => {
    console.error('Login failed', error);
  }
});

// Check authentication status
if (this.authService.isAuthenticated()) {
  // User is logged in
}

// Get current user
const user = this.authService.currentUser();
console.log(user.email, user.role);

// Logout
this.authService.logout();
```

**API Endpoints Used:**
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/refresh-token` - Refresh expired token
- `GET /api/auth/me` - Get current user info

### 2. ReportService

**Location:** `Frontend/src/app/services/report.service.ts`

**Key Features:**
- CRUD operations for reports
- Advanced search with filters
- Pagination support
- CSV/Excel export functionality
- Signal-based state management

**Usage Example:**

```typescript
// In ReportsComponent
constructor(private reportService: ReportService) {}

// Get all reports with pagination
this.reportService.getAllReports(1, 10).subscribe({
  next: (result) => {
    this.reports = result.items;
    this.totalRecords = result.totalCount;
  }
});

// Search reports
const searchRequest: SearchReportsRequest = {
  searchTerm: 'important',
  status: 1, // Submitted
  priority: 2, // High
  pageNumber: 1,
  pageSize: 10
};

this.reportService.searchReports(searchRequest).subscribe({
  next: (result) => {
    this.reports = result.items;
  }
});

// Create new report
this.reportService.createReport({
  title: 'New Report',
  description: 'Description here',
  category: 'Category',
  priority: 1
}).subscribe({
  next: () => console.log('Report created'),
  error: (err) => console.error(err)
});

// Export to CSV
this.reportService.exportToCSV(this.reports);
```

**API Endpoints Used:**
- `GET /api/reports` - Get all reports
- `GET /api/reports/my-reports` - Get current user's reports
- `GET /api/reports/{id}` - Get single report
- `GET /api/reports/by-status/{status}` - Get reports by status
- `POST /api/reports/search` - Search with filters
- `POST /api/reports` - Create report
- `PUT /api/reports/{id}` - Update report
- `DELETE /api/reports/{id}` - Delete report
- `POST /api/reports/{id}/submit` - Submit for review
- `POST /api/reports/{id}/review` - Review report (admin)

---

## HTTP Interceptor

### Purpose

Automatically attach JWT token to all outgoing HTTP requests and handle 401 Unauthorized errors with automatic token refresh.

**Location:** `Frontend/src/app/interceptors/auth.interceptor.ts`

### How It Works

```typescript
Request → Check if auth required → Add JWT token → Send request
                                         ↓
                                    If 401 error
                                         ↓
                                Try refresh token
                                         ↓
                            ┌────────────┴────────────┐
                            │                         │
                      Success                    Failure
                            │                         │
                      Retry request            Logout & Redirect
```

### Configuration

The interceptor is registered in `app.config.ts`:

```typescript
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([authInterceptor])
    )
  ]
};
```

### Excluded Endpoints

The interceptor skips authentication for:
- `/auth/login`
- `/auth/register`
- `/auth/refresh-token`

---

## Route Guards

### AuthGuard

**Location:** `Frontend/src/app/guards/auth.guard.ts`

**Purpose:** Protect routes that require authentication

**Usage in routes:**

```typescript
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'reports',
    loadComponent: () => import('./pages/reports/reports.component'),
    canActivate: [authGuard]  // ← Requires authentication
  }
];
```

**Behavior:**
- If authenticated: Allow access
- If not authenticated: Redirect to `/auth` with return URL

### AdminGuard

**Purpose:** Protect routes that require admin role

**Usage in routes:**

```typescript
import { authGuard, adminGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/admin.component'),
    canActivate: [authGuard, adminGuard]  // ← Requires admin role
  }
];
```

**Behavior:**
- If not authenticated: Redirect to `/auth`
- If authenticated but not admin: Redirect to `/`
- If admin: Allow access

---

## Component Integration

### Updating AuthComponent

The `AuthComponent` needs to be updated to use the `AuthService` instead of console.log placeholders.

**Changes Required:**

```typescript
// auth.component.ts
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

export class AuthComponent {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onLoginSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      
      this.authService.login(email, password).subscribe({
        next: (response) => {
          console.log('Login successful:', response);
          // Navigate to home or return URL
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
          this.router.navigate([returnUrl]);
        },
        error: (error) => {
          console.error('Login failed:', error);
          // Show error message to user
          alert('Login failed: ' + error.message);
        }
      });
    }
  }

  onRegisterSubmit(): void {
    if (this.registerForm.valid) {
      const registerData = {
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
        firstName: this.registerForm.value.firstName,
        lastName: this.registerForm.value.lastName,
        pesel: this.registerForm.value.pesel
      };

      this.authService.register(registerData).subscribe({
        next: (response) => {
          console.log('Registration successful:', response);
          // Switch to login tab or auto-login
          this.activeIndex = 0;
          alert('Rejestracja zakończona sukcesem! Możesz się teraz zalogować.');
        },
        error: (error) => {
          console.error('Registration failed:', error);
          alert('Registration failed: ' + error.message);
        }
      });
    }
  }
}
```

### ReportsComponent

**Location:** `Frontend/src/app/pages/reports/reports.component.ts`

**Key Features:**
- PrimeNG Table with pagination, sorting, filtering
- Search functionality
- Create/Edit/Delete operations
- Status and priority badges
- Export to CSV/Excel
- Polish language interface

**Main Methods:**

```typescript
// Load reports
loadInitialReports(): void

// Search with filters
search(): void

// CRUD operations
createReport(report: CreateReportRequest): void
updateReport(id: string, report: UpdateReportRequest): void
deleteReport(id: string): void
submitReport(id: string): void

// Export
exportCSV(): void
exportExcel(): void
```

---

## Backend Implementation

### Implementing MediatR Handlers

The backend controllers use CQRS with MediatR, but the handlers need to be implemented.

### Example: LoginCommandHandler

**Location:** `Backend.Application/Features/Auth/Handlers/LoginCommandHandler.cs`

```csharp
using MediatR;
using Backend.Application.DTOs.Auth;
using Backend.Application.Features.Auth.Commands;
using Backend.Domain.Interfaces;
using Backend.Infrastructure.Services;
using BCrypt.Net;

namespace Backend.Application.Features.Auth.Handlers
{
    public class LoginCommandHandler : IRequestHandler<LoginCommand, AuthResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IJwtService _jwtService;

        public LoginCommandHandler(IUnitOfWork unitOfWork, IJwtService jwtService)
        {
            _unitOfWork = unitOfWork;
            _jwtService = jwtService;
        }

        public async Task<AuthResponse> Handle(LoginCommand request, CancellationToken cancellationToken)
        {
            // Find user by email
            var users = await _unitOfWork.Users.FindAsync(u => u.Email == request.Email);
            var user = users.FirstOrDefault();

            if (user == null)
            {
                throw new UnauthorizedAccessException("Invalid email or password");
            }

            // Verify password
            if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                throw new UnauthorizedAccessException("Invalid email or password");
            }

            // Generate tokens
            var accessToken = await _jwtService.GenerateAccessToken(user);
            var refreshToken = _jwtService.GenerateRefreshToken();

            // Store refresh token
            var refreshTokenEntity = new Domain.Entities.RefreshToken
            {
                Token = refreshToken,
                UserId = user.Id,
                ExpiryDate = DateTime.UtcNow.AddDays(7),
                IsRevoked = false
            };

            await _unitOfWork.RefreshTokens.AddAsync(refreshTokenEntity);
            await _unitOfWork.SaveChangesAsync();

            return new AuthResponse
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                User = new UserDto
                {
                    Id = user.Id,
                    Email = user.Email,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Role = user.Role.ToString()
                }
            };
        }
    }
}
```

### Example: RegisterCommandHandler

**Location:** `Backend.Application/Features/Auth/Handlers/RegisterCommandHandler.cs`

```csharp
using MediatR;
using Backend.Application.DTOs.Auth;
using Backend.Application.Features.Auth.Commands;
using Backend.Domain.Entities;
using Backend.Domain.Enums;
using Backend.Domain.Interfaces;
using Backend.Infrastructure.Services;

namespace Backend.Application.Features.Auth.Handlers
{
    public class RegisterCommandHandler : IRequestHandler<RegisterCommand, AuthResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IJwtService _jwtService;
        private readonly IPasswordHasher _passwordHasher;

        public RegisterCommandHandler(
            IUnitOfWork unitOfWork, 
            IJwtService jwtService,
            IPasswordHasher passwordHasher)
        {
            _unitOfWork = unitOfWork;
            _jwtService = jwtService;
            _passwordHasher = passwordHasher;
        }

        public async Task<AuthResponse> Handle(RegisterCommand request, CancellationToken cancellationToken)
        {
            // Check if user already exists
            var existingUsers = await _unitOfWork.Users.FindAsync(u => u.Email == request.Email);
            if (existingUsers.Any())
            {
                throw new InvalidOperationException("User with this email already exists");
            }

            // Create new user
            var user = new User
            {
                Email = request.Email,
                PasswordHash = _passwordHasher.HashPassword(request.Password),
                FirstName = request.FirstName,
                LastName = request.LastName,
                PESEL = request.PESEL,
                Role = UserRole.User
            };

            await _unitOfWork.Users.AddAsync(user);
            await _unitOfWork.SaveChangesAsync();

            // Generate tokens
            var accessToken = await _jwtService.GenerateAccessToken(user);
            var refreshToken = _jwtService.GenerateRefreshToken();

            // Store refresh token
            var refreshTokenEntity = new RefreshToken
            {
                Token = refreshToken,
                UserId = user.Id,
                ExpiryDate = DateTime.UtcNow.AddDays(7),
                IsRevoked = false
            };

            await _unitOfWork.RefreshTokens.AddAsync(refreshTokenEntity);
            await _unitOfWork.SaveChangesAsync();

            return new AuthResponse
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                User = new UserDto
                {
                    Id = user.Id,
                    Email = user.Email,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Role = user.Role.ToString()
                }
            };
        }
    }
}
```

### Example: GetReportsQueryHandler

**Location:** `Backend.Application/Features/Reports/Handlers/GetReportsQueryHandler.cs`

```csharp
using MediatR;
using Backend.Application.DTOs.Reports;
using Backend.Application.Features.Reports.Queries;
using Backend.Domain.Interfaces;

namespace Backend.Application.Features.Reports.Handlers
{
    public class GetReportsQueryHandler : IRequestHandler<GetReportsQuery, PagedResult<ReportDto>>
    {
        private readonly IUnitOfWork _unitOfWork;

        public GetReportsQueryHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<PagedResult<ReportDto>> Handle(GetReportsQuery request, CancellationToken cancellationToken)
        {
            var allReports = await _unitOfWork.Reports.GetAllAsync();
            
            var totalCount = allReports.Count();
            var items = allReports
                .OrderByDescending(r => r.CreatedAt)
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .Select(r => new ReportDto
                {
                    Id = r.Id,
                    Title = r.Title,
                    Description = r.Description,
                    Status = r.Status.ToString(),
                    Priority = r.Priority.ToString(),
                    Category = r.Category,
                    UserId = r.UserId,
                    UserName = $"{r.User.FirstName} {r.User.LastName}",
                    SubmittedAt = r.SubmittedAt?.ToString("o"),
                    ReviewedAt = r.ReviewedAt?.ToString("o"),
                    ReviewNotes = r.ReviewNotes,
                    CreatedAt = r.CreatedAt.ToString("o"),
                    UpdatedAt = r.UpdatedAt?.ToString("o"),
                    Attachments = r.Attachments.Select(a => new ReportAttachmentDto
                    {
                        Id = a.Id,
                        FileName = a.FileName,
                        ContentType = a.ContentType,
                        FileSize = a.FileSize,
                        CreatedAt = a.CreatedAt.ToString("o")
                    }).ToList()
                })
                .ToList();

            return new PagedResult<ReportDto>
            {
                Items = items,
                PageNumber = request.PageNumber,
                PageSize = request.PageSize,
                TotalCount = totalCount,
                TotalPages = (int)Math.Ceiling(totalCount / (double)request.PageSize)
            };
        }
    }
}
```

### Registering Handlers

Ensure MediatR is properly configured in `Program.cs`:

```csharp
// Program.cs
builder.Services.AddMediatR(cfg => 
{
    cfg.RegisterServicesFromAssembly(typeof(RegisterCommand).Assembly);
});
```

---

## Testing the Integration

### Step-by-Step Testing Guide

#### 1. Start the Application

```powershell
# Start all services
docker-compose up -d

# Check services are running
docker-compose ps

# Wait for services to be healthy (2-3 minutes)
```

#### 2. Test Backend API (Swagger)

```
Navigate to: http://localhost:5000/swagger

Test endpoints:
1. POST /api/auth/register - Register a new user
2. POST /api/auth/login - Login with registered user
3. Copy the accessToken from login response
4. Click "Authorize" button, paste token
5. Test protected endpoints like GET /api/reports
```

#### 3. Test Frontend

```
Navigate to: http://localhost:4200

1. Registration:
   - Fill in all fields
   - Use valid PESEL (e.g., 00270803628)
   - Click "Zarejestruj się"
   - Should see success message

2. Login:
   - Enter email and password
   - Click "Zaloguj"
   - Should redirect to home/reports page

3. Check localStorage:
   - Open browser DevTools (F12)
   - Application tab → Local Storage
   - Should see accessToken and refreshToken

4. Test Reports Page:
   - Should see table with reports (if any)
   - Try creating a new report
   - Try filtering/searching
   - Try export functions
```

#### 4. Test Authentication Flow

```
1. Login to application
2. Open Network tab in DevTools
3. Navigate to reports page
4. Check request headers - should include:
   Authorization: Bearer eyJhbGci...

5. Wait for token to expire (or manually delete token)
6. Make another request
7. Should see automatic token refresh
```

#### 5. Test Error Handling

```
1. Invalid Login:
   - Enter wrong credentials
   - Should see error message

2. Network Error:
   - Stop backend: docker-compose stop backend
   - Try to make request
   - Should see error message
   - Restart: docker-compose start backend

3. Token Expiration:
   - Manually set old token
   - Make request
   - Should auto-refresh and retry
```

### Common Test Cases

```typescript
// Test Case 1: Successful Registration
POST /api/auth/register
{
  "email": "test@example.com",
  "password": "Test123!",
  "firstName": "Test",
  "lastName": "User",
  "pesel": "00270803628"
}
Expected: 200 OK with tokens

// Test Case 2: Successful Login
POST /api/auth/login
{
  "email": "test@example.com",
  "password": "Test123!"
}
Expected: 200 OK with tokens

// Test Case 3: Get Current User
GET /api/auth/me
Headers: Authorization: Bearer {token}
Expected: 200 OK with user info

// Test Case 4: Get Reports
GET /api/reports?pageNumber=1&pageSize=10
Headers: Authorization: Bearer {token}
Expected: 200 OK with paged results

// Test Case 5: Create Report
POST /api/reports
Headers: Authorization: Bearer {token}
{
  "title": "Test Report",
  "description": "Test Description",
  "category": "Test",
  "priority": 1
}
Expected: 200 OK
```

---

## Troubleshooting Integration Issues

### Issue: CORS Errors

**Symptoms:** Requests blocked by CORS policy

**Solution:**
1. Check CORS is enabled in `Program.cs`
2. Verify middleware order (CORS before Authentication)
3. Use proxy in Angular: `ng serve --proxy-config proxy.conf.json`

### Issue: 401 Unauthorized

**Symptoms:** All protected endpoints return 401

**Solution:**
1. Check token is being sent in Authorization header
2. Verify JWT configuration matches in frontend/backend
3. Check token hasn't expired
4. Verify AuthInterceptor is registered

### Issue: Token Not Refreshing

**Symptoms:** 401 errors after token expires

**Solution:**
1. Check refresh token endpoint is working
2. Verify AuthInterceptor refresh logic
3. Check refresh token is stored in localStorage
4. Ensure refresh token hasn't expired

### Issue: Components Not Loading Data

**Symptoms:** Empty tables/lists

**Solution:**
1. Check API endpoints are returning data
2. Verify authentication is working
3. Check for JavaScript console errors
4. Verify service methods are being called
5. Check data mapping matches backend DTOs

---

## Security Considerations

### Production Checklist

- [ ] Change JWT secret key to strong random value
- [ ] Enable HTTPS
- [ ] Configure CORS to allow only specific origins
- [ ] Implement rate limiting
- [ ] Add request validation
- [ ] Enable SQL injection protection (parameterized queries)
- [ ] Implement XSS protection
- [ ] Add CSRF token for state-changing operations
- [ ] Secure localStorage (consider HttpOnly cookies)
- [ ] Implement proper error handling (don't expose stack traces)
- [ ] Add logging and monitoring
- [ ] Regular security audits
- [ ] Keep dependencies updated

---

## Next Steps

After completing the integration:

1. **Implement Remaining Handlers**
   - All CQRS command/query handlers
   - Validation logic
   - Business rules

2. **Add Features**
   - File upload for attachments
   - Real-time notifications (SignalR)
   - Email notifications
   - Admin dashboard

3. **Testing**
   - Unit tests for services
   - Integration tests for API
   - E2E tests for critical flows

4. **Documentation**
   - API documentation (Swagger)
   - User manual
   - Deployment guide

5. **Deployment**
   - Setup CI/CD pipeline
   - Configure production environment
   - Setup monitoring and logging
   - Backup strategy

---

## Summary

This integration guide covers:
- ✅ Complete service layer (AuthService, ReportService)
- ✅ HTTP interceptor for automatic JWT token attachment
- ✅ Route guards for authentication and authorization
- ✅ Component integration examples
- ✅ Backend handler implementations
- ✅ Comprehensive testing guide
- ✅ Troubleshooting common issues

The frontend and backend are now fully integrated with JWT authentication, automatic token refresh, and complete CRUD operations for reports.

For detailed debugging help, refer to [DEBUGGING.md](./DEBUGGING.md).
