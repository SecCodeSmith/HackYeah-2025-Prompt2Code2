# UKNF Communication Platform - Complete Implementation Guide

## Overview

This document provides the complete configuration files and project structure for the UKNF Communication Platform, a secure enterprise application built with .NET 8, Angular, and Docker.

---

## 1. Docker Compose Configuration

### docker-compose.yml

```yaml
version: '3.8'

services:
  # MSSQL Database Service
  database:
    image: mcr.microsoft.com/mssql/server:2022-latest
    container_name: uknf-database
    environment:
      - ACCEPT_EULA=Y
      - SA_PASSWORD=${DB_SA_PASSWORD:-YourStrong@Password123}
      - MSSQL_PID=Developer
    ports:
      - "1433:1433"
    volumes:
      - mssql-data:/var/opt/mssql
    networks:
      - uknf-network
    healthcheck:
      test: /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "$${SA_PASSWORD}" -Q "SELECT 1" || exit 1
      interval: 10s
      timeout: 3s
      retries: 10
      start_period: 10s

  # .NET Backend API Service
  backend:
    build:
      context: ./Backend
      dockerfile: Dockerfile
    container_name: uknf-backend
    environment:
      - ASPNETCORE_ENVIRONMENT=${ASPNETCORE_ENVIRONMENT:-Development}
      - ASPNETCORE_URLS=http://+:5000
      - ConnectionStrings__DefaultConnection=Server=database;Database=${DB_NAME:-UknfCommunicationDb};User Id=sa;Password=${DB_SA_PASSWORD:-YourStrong@Password123};TrustServerCertificate=True;
      - JwtSettings__Secret=${JWT_SECRET:-YourSuperSecretKeyForJWTTokenGeneration1234567890}
      - JwtSettings__Issuer=${JWT_ISSUER:-UknfCommunicationPlatform}
      - JwtSettings__Audience=${JWT_AUDIENCE:-UknfCommunicationPlatformUsers}
      - JwtSettings__ExpirationInMinutes=${JWT_EXPIRATION:-60}
      - OAuth__ClientId=${OAUTH_CLIENT_ID}
      - OAuth__ClientSecret=${OAUTH_CLIENT_SECRET}
      - OAuth__Authority=${OAUTH_AUTHORITY}
    ports:
      - "5000:5000"
    depends_on:
      database:
        condition: service_healthy
    networks:
      - uknf-network
    healthcheck:
      test: curl --fail http://localhost:5000/health || exit 1
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  # Angular Frontend Service
  frontend:
    build:
      context: ./Frontend
      dockerfile: Dockerfile
    container_name: uknf-frontend
    environment:
      - NODE_ENV=${NODE_ENV:-production}
      - API_BASE_URL=${API_BASE_URL:-http://backend:5000}
    ports:
      - "4200:80"
    depends_on:
      - backend
    networks:
      - uknf-network
    healthcheck:
      test: curl --fail http://localhost:80 || exit 1
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

networks:
  uknf-network:
    driver: bridge

volumes:
  mssql-data:
    driver: local
```

---

## 2. Backend Project Structure

### CQRS Architecture with Clean Architecture Layers

```
Backend/
│
├── Backend.API/                          # Presentation Layer
│   ├── Controllers/
│   │   ├── AuthController.cs            # Authentication endpoints
│   │   └── ReportsController.cs         # Report management endpoints
│   ├── Program.cs                        # Application entry point & DI configuration
│   ├── appsettings.json                  # Configuration
│   ├── appsettings.Development.json      # Development configuration
│   ├── Backend.API.csproj                # Project file
│   └── Dockerfile                        # Container definition
│
├── Backend.Application/                  # Application Layer (CQRS)
│   ├── DTOs/
│   │   ├── Auth/
│   │   │   └── AuthDTOs.cs              # Authentication DTOs
│   │   └── Reports/
│   │       └── ReportDTOs.cs            # Report DTOs
│   ├── Features/
│   │   ├── Auth/
│   │   │   ├── Commands/
│   │   │   │   └── AuthCommands.cs      # Auth commands (Register, Login, etc.)
│   │   │   └── Queries/
│   │   │       └── AuthQueries.cs       # Auth queries (GetUser, ValidateToken, etc.)
│   │   └── Reports/
│   │       ├── Commands/
│   │       │   └── ReportCommands.cs    # Report commands (Create, Update, Delete, etc.)
│   │       └── Queries/
│   │           └── ReportQueries.cs     # Report queries (GetById, GetAll, Search, etc.)
│   ├── Interfaces/
│   │   ├── IJwtService.cs               # JWT service interface
│   │   └── IPasswordHasher.cs           # Password hashing interface
│   └── Backend.Application.csproj        # Project file
│
├── Backend.Domain/                       # Domain Layer
│   ├── Entities/
│   │   ├── User.cs                      # User entity with roles
│   │   ├── Report.cs                    # Report entity with status/priority
│   │   ├── ReportAttachment.cs          # File attachment entity
│   │   └── RefreshToken.cs              # Refresh token entity
│   ├── Common/
│   │   └── BaseEntity.cs                # Base entity with audit fields
│   ├── Interfaces/
│   │   ├── IRepository.cs               # Generic repository interface
│   │   ├── IUserRepository.cs           # User-specific repository
│   │   ├── IReportRepository.cs         # Report-specific repository
│   │   └── IUnitOfWork.cs               # Unit of Work pattern
│   └── Backend.Domain.csproj             # Project file
│
└── Backend.Infrastructure/               # Infrastructure Layer
    ├── Persistence/
    │   └── ApplicationDbContext.cs       # EF Core DbContext
    ├── Repositories/
    │   ├── Repository.cs                 # Generic repository implementation
    │   ├── UserRepository.cs             # User repository
    │   ├── ReportRepository.cs           # Report repository
    │   └── UnitOfWork.cs                 # Unit of Work implementation
    ├── Services/
    │   ├── JwtService.cs                 # JWT token generation/validation
    │   └── PasswordHasher.cs             # BCrypt password hashing
    └── Backend.Infrastructure.csproj      # Project file
```

### Layer Responsibilities

1. **API Layer**: HTTP request handling, routing, authentication middleware
2. **Application Layer**: Business logic, CQRS commands/queries, DTOs, validation
3. **Domain Layer**: Core entities, business rules, repository interfaces
4. **Infrastructure Layer**: Database access, external services, infrastructure concerns

---

## 3. Project Files (.csproj)

### Backend.API.csproj

```xml
<Project Sdk="Microsoft.NET.Sdk.Web">

  <PropertyGroup>
    <TargetFramework>net8.0</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Microsoft.AspNetCore.Authentication.JwtBearer" Version="8.0.0" />
    <PackageReference Include="Microsoft.AspNetCore.OpenApi" Version="8.0.0" />
    <PackageReference Include="Microsoft.EntityFrameworkCore.Design" Version="8.0.0">
      <PrivateAssets>all</PrivateAssets>
      <IncludeAssets>runtime; build; native; contentfiles; analyzers; buildtransitive</IncludeAssets>
    </PackageReference>
    <PackageReference Include="Swashbuckle.AspNetCore" Version="6.5.0" />
    <PackageReference Include="Serilog.AspNetCore" Version="8.0.0" />
    <PackageReference Include="Serilog.Sinks.Console" Version="5.0.0" />
    <PackageReference Include="Serilog.Sinks.File" Version="5.0.0" />
    <PackageReference Include="MediatR" Version="12.2.0" />
    <PackageReference Include="Microsoft.Extensions.Diagnostics.HealthChecks.EntityFrameworkCore" Version="8.0.0" />
  </ItemGroup>

  <ItemGroup>
    <ProjectReference Include="..\Backend.Application\Backend.Application.csproj" />
    <ProjectReference Include="..\Backend.Infrastructure\Backend.Infrastructure.csproj" />
  </ItemGroup>

</Project>
```

### Backend.Application.csproj

```xml
<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <TargetFramework>net8.0</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="FluentValidation" Version="11.9.0" />
    <PackageReference Include="FluentValidation.DependencyInjectionExtensions" Version="11.9.0" />
    <PackageReference Include="MediatR" Version="12.2.0" />
    <PackageReference Include="AutoMapper" Version="12.0.1" />
    <PackageReference Include="AutoMapper.Extensions.Microsoft.DependencyInjection" Version="12.0.1" />
    <PackageReference Include="Microsoft.Extensions.Logging.Abstractions" Version="8.0.0" />
  </ItemGroup>

  <ItemGroup>
    <ProjectReference Include="..\Backend.Domain\Backend.Domain.csproj" />
  </ItemGroup>

</Project>
```

### Backend.Domain.csproj

```xml
<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <TargetFramework>net8.0</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
  </PropertyGroup>

</Project>
```

### Backend.Infrastructure.csproj

```xml
<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <TargetFramework>net8.0</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Microsoft.EntityFrameworkCore" Version="8.0.0" />
    <PackageReference Include="Microsoft.EntityFrameworkCore.SqlServer" Version="8.0.0" />
    <PackageReference Include="Microsoft.EntityFrameworkCore.Tools" Version="8.0.0">
      <PrivateAssets>all</PrivateAssets>
      <IncludeAssets>runtime; build; native; contentfiles; analyzers; buildtransitive</IncludeAssets>
    </PackageReference>
    <PackageReference Include="Microsoft.Extensions.Configuration.Abstractions" Version="8.0.0" />
    <PackageReference Include="Microsoft.AspNetCore.Identity.EntityFrameworkCore" Version="8.0.0" />
    <PackageReference Include="BCrypt.Net-Next" Version="4.0.3" />
    <PackageReference Include="System.IdentityModel.Tokens.Jwt" Version="7.0.0" />
  </ItemGroup>

  <ItemGroup>
    <ProjectReference Include="..\Backend.Application\Backend.Application.csproj" />
    <ProjectReference Include="..\Backend.Domain\Backend.Domain.csproj" />
  </ItemGroup>

</Project>
```

---

## 4. Data Transfer Objects (DTOs)

### Authentication DTOs (Backend.Application/DTOs/Auth/AuthDTOs.cs)

```csharp
namespace Backend.Application.DTOs.Auth;

// Request DTOs
public record RegisterRequest(
    string Email,
    string Password,
    string ConfirmPassword,
    string FirstName,
    string LastName,
    string? PhoneNumber
);

public record LoginRequest(
    string Email,
    string Password
);

public record RefreshTokenRequest(
    string AccessToken,
    string RefreshToken
);

public record ChangePasswordRequest(
    string CurrentPassword,
    string NewPassword,
    string ConfirmNewPassword
);

public record ForgotPasswordRequest(
    string Email
);

public record ResetPasswordRequest(
    string Email,
    string Token,
    string NewPassword,
    string ConfirmNewPassword
);

// Response DTOs
public record AuthResponse(
    string AccessToken,
    string RefreshToken,
    DateTime ExpiresAt,
    UserDto User
);

public record UserDto(
    Guid Id,
    string Email,
    string FirstName,
    string LastName,
    string? PhoneNumber,
    string Role,
    bool IsActive,
    bool EmailConfirmed,
    DateTime CreatedAt
);

public record TokenValidationResponse(
    bool IsValid,
    string? UserId,
    string? Email,
    string? ErrorMessage
);
```

### Report DTOs (Backend.Application/DTOs/Reports/ReportDTOs.cs)

```csharp
namespace Backend.Application.DTOs.Reports;

// Request DTOs
public record CreateReportRequest(
    string Title,
    string Description,
    string? Category,
    int Priority
);

public record UpdateReportRequest(
    string Title,
    string Description,
    string? Category,
    int Priority,
    int Status
);

public record SubmitReportRequest(
    Guid ReportId
);

public record ReviewReportRequest(
    Guid ReportId,
    int Status,
    string? ReviewNotes
);

public record GetReportsQuery(
    int? Status,
    int? Priority,
    string? Category,
    DateTime? CreatedFrom,
    DateTime? CreatedTo,
    int PageNumber = 1,
    int PageSize = 10
);

// Response DTOs
public record ReportDto(
    Guid Id,
    string Title,
    string Description,
    string Status,
    string Priority,
    string? Category,
    Guid UserId,
    string UserName,
    DateTime? SubmittedAt,
    DateTime? ReviewedAt,
    string? ReviewNotes,
    DateTime CreatedAt,
    DateTime? UpdatedAt,
    List<ReportAttachmentDto> Attachments
);

public record ReportAttachmentDto(
    Guid Id,
    string FileName,
    string ContentType,
    long FileSize,
    DateTime CreatedAt
);

public record ReportSummaryDto(
    Guid Id,
    string Title,
    string Status,
    string Priority,
    DateTime CreatedAt
);

public record PagedResult<T>(
    List<T> Items,
    int PageNumber,
    int PageSize,
    int TotalCount,
    int TotalPages
);

public record CreateReportResponse(
    Guid Id,
    string Message
);

public record UpdateReportResponse(
    bool Success,
    string Message
);
```

---

## 5. REST API Controller Signatures

### AuthController (Backend.API/Controllers/AuthController.cs)

```csharp
using Backend.Application.DTOs.Auth;
using Backend.Application.Features.Auth.Commands;
using Backend.Application.Features.Auth.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<AuthController> _logger;

    public AuthController(IMediator mediator, ILogger<AuthController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    /// <summary>
    /// POST /api/auth/register - Register a new user
    /// </summary>
    [HttpPost("register")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(AuthResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        // Implementation with RegisterCommand
    }

    /// <summary>
    /// POST /api/auth/login - Login with email and password
    /// </summary>
    [HttpPost("login")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(AuthResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        // Implementation with LoginCommand
    }

    /// <summary>
    /// POST /api/auth/refresh-token - Refresh access token
    /// </summary>
    [HttpPost("refresh-token")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(AuthResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequest request)
    {
        // Implementation with RefreshTokenCommand
    }

    /// <summary>
    /// POST /api/auth/change-password - Change user password
    /// </summary>
    [HttpPost("change-password")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
    {
        // Implementation with ChangePasswordCommand
    }

    /// <summary>
    /// POST /api/auth/revoke-token - Revoke refresh token
    /// </summary>
    [HttpPost("revoke-token")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> RevokeToken([FromBody] string refreshToken)
    {
        // Implementation with RevokeTokenCommand
    }

    /// <summary>
    /// GET /api/auth/me - Get current user profile
    /// </summary>
    [HttpGet("me")]
    [Authorize]
    [ProducesResponseType(typeof(UserDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetCurrentUser()
    {
        // Implementation with GetUserByIdQuery
    }
}
```

### ReportsController (Backend.API/Controllers/ReportsController.cs)

```csharp
using Backend.Application.DTOs.Reports;
using Backend.Application.Features.Reports.Commands;
using Backend.Application.Features.Reports.Queries;
using Backend.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ReportsController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<ReportsController> _logger;

    public ReportsController(IMediator mediator, ILogger<ReportsController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    /// <summary>
    /// GET /api/reports - Get all reports (paginated)
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(PagedResult<ReportDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
    {
        // Implementation with GetAllReportsQuery
    }

    /// <summary>
    /// GET /api/reports/{id} - Get report by ID
    /// </summary>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(ReportDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(Guid id)
    {
        // Implementation with GetReportByIdQuery
    }

    /// <summary>
    /// GET /api/reports/my-reports - Get current user's reports
    /// </summary>
    [HttpGet("my-reports")]
    [ProducesResponseType(typeof(PagedResult<ReportDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetMyReports([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
    {
        // Implementation with GetUserReportsQuery
    }

    /// <summary>
    /// GET /api/reports/by-status/{status} - Get reports by status
    /// </summary>
    [HttpGet("by-status/{status}")]
    [ProducesResponseType(typeof(PagedResult<ReportDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetByStatus(ReportStatus status, [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
    {
        // Implementation with GetReportsByStatusQuery
    }

    /// <summary>
    /// POST /api/reports/search - Search reports with filters
    /// </summary>
    [HttpPost("search")]
    [ProducesResponseType(typeof(PagedResult<ReportDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> Search([FromBody] GetReportsQuery request)
    {
        // Implementation with SearchReportsQuery
    }

    /// <summary>
    /// POST /api/reports - Create a new report
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(CreateReportResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create([FromBody] CreateReportRequest request)
    {
        // Implementation with CreateReportCommand
    }

    /// <summary>
    /// PUT /api/reports/{id} - Update an existing report
    /// </summary>
    [HttpPut("{id}")]
    [ProducesResponseType(typeof(UpdateReportResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateReportRequest request)
    {
        // Implementation with UpdateReportCommand
    }

    /// <summary>
    /// DELETE /api/reports/{id} - Delete a report
    /// </summary>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid id)
    {
        // Implementation with DeleteReportCommand
    }

    /// <summary>
    /// POST /api/reports/{id}/submit - Submit a report for review
    /// </summary>
    [HttpPost("{id}/submit")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Submit(Guid id)
    {
        // Implementation with SubmitReportCommand
    }

    /// <summary>
    /// POST /api/reports/{id}/review - Review a report (Administrator/Supervisor only)
    /// </summary>
    [HttpPost("{id}/review")]
    [Authorize(Roles = "Administrator,Supervisor")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Review(Guid id, [FromBody] ReviewReportRequest request)
    {
        // Implementation with ReviewReportCommand
    }
}
```

---

## API Endpoint Summary

### Authentication Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | /api/auth/register | Register new user | No |
| POST | /api/auth/login | Login user | No |
| POST | /api/auth/refresh-token | Refresh JWT token | No |
| POST | /api/auth/change-password | Change password | Yes |
| POST | /api/auth/revoke-token | Revoke refresh token | Yes |
| GET | /api/auth/me | Get current user | Yes |

### Report Management Endpoints
| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| GET | /api/reports | Get all reports | Yes | All |
| GET | /api/reports/{id} | Get report by ID | Yes | All |
| GET | /api/reports/my-reports | Get user's reports | Yes | All |
| GET | /api/reports/by-status/{status} | Get reports by status | Yes | All |
| POST | /api/reports/search | Search reports | Yes | All |
| POST | /api/reports | Create report | Yes | All |
| PUT | /api/reports/{id} | Update report | Yes | All |
| DELETE | /api/reports/{id} | Delete report | Yes | All |
| POST | /api/reports/{id}/submit | Submit for review | Yes | All |
| POST | /api/reports/{id}/review | Review report | Yes | Admin/Supervisor |

---

## Technology Stack

### Backend
- **.NET 8.0**: Modern cross-platform framework
- **ASP.NET Core Web API**: REST API framework
- **Entity Framework Core 8.0**: ORM for database access
- **SQL Server 2022**: Relational database
- **MediatR**: CQRS mediator pattern implementation
- **FluentValidation**: Input validation
- **BCrypt.Net**: Password hashing
- **JWT**: Token-based authentication
- **Swagger/OpenAPI**: API documentation

### Frontend
- **Angular**: SPA framework
- **TypeScript**: Type-safe JavaScript
- **RxJS**: Reactive programming
- **Nginx**: Web server for production

### DevOps
- **Docker**: Containerization
- **Docker Compose**: Multi-container orchestration

---

## Next Implementation Steps

1. **Create Command/Query Handlers** for MediatR
2. **Implement FluentValidation validators** for DTOs
3. **Create AutoMapper profiles** for entity-DTO mapping
4. **Generate and apply EF Core migrations**
5. **Add comprehensive unit tests**
6. **Implement integration tests**
7. **Set up CI/CD pipeline**
8. **Configure OAuth 2.0 provider**
9. **Add API rate limiting**
10. **Implement logging and monitoring**

---

## Getting Started

1. **Clone repository**
2. **Copy `.env.example` to `.env`** and configure
3. **Run `docker-compose up -d --build`**
4. **Access Swagger at** `http://localhost:5000/swagger`
5. **Test API endpoints**

For detailed setup instructions, see `SETUP.md`.
For architecture details, see `ARCHITECTURE.md`.
