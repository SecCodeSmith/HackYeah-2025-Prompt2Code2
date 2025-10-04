,# UKNF Communication Platform - Architecture Documentation

## Project Overview

This is a secure communication platform for UKNF built with:
- **Frontend**: Angular SPA
- **Backend**: .NET 8 with ASP.NET Core Web API
- **Database**: Microsoft SQL Server
- **Architecture Pattern**: CQRS (Command Query Responsibility Segregation)
- **Security**: JWT + OAuth 2.0
- **Containerization**: Docker & Docker Compose

## Project Structure

```
HackYeah 2025/
├── docker-compose.yml          # Orchestrates all services
├── .env.example                # Environment variables template
│
├── Backend/
│   ├── Dockerfile              # Backend container definition
│   │
│   ├── Backend.API/            # Presentation Layer
│   │   ├── Controllers/        # REST API endpoints
│   │   │   ├── AuthController.cs
│   │   │   └── ReportsController.cs
│   │   ├── Program.cs          # Application entry point
│   │   ├── appsettings.json    # Configuration
│   │   └── Backend.API.csproj
│   │
│   ├── Backend.Application/    # Application Layer (CQRS)
│   │   ├── DTOs/               # Data Transfer Objects
│   │   │   ├── Auth/
│   │   │   │   └── AuthDTOs.cs
│   │   │   └── Reports/
│   │   │       └── ReportDTOs.cs
│   │   ├── Features/           # CQRS Commands & Queries
│   │   │   ├── Auth/
│   │   │   │   ├── Commands/
│   │   │   │   │   └── AuthCommands.cs
│   │   │   │   └── Queries/
│   │   │   │       └── AuthQueries.cs
│   │   │   └── Reports/
│   │   │       ├── Commands/
│   │   │       │   └── ReportCommands.cs
│   │   │       └── Queries/
│   │   │           └── ReportQueries.cs
│   │   ├── Interfaces/         # Service interfaces
│   │   │   ├── IJwtService.cs
│   │   │   └── IPasswordHasher.cs
│   │   └── Backend.Application.csproj
│   │
│   ├── Backend.Domain/         # Domain Layer
│   │   ├── Entities/           # Domain models
│   │   │   ├── User.cs
│   │   │   ├── Report.cs
│   │   │   ├── ReportAttachment.cs
│   │   │   └── RefreshToken.cs
│   │   ├── Common/             # Base classes
│   │   │   └── BaseEntity.cs
│   │   ├── Interfaces/         # Repository interfaces
│   │   │   ├── IRepository.cs
│   │   │   ├── IUserRepository.cs
│   │   │   ├── IReportRepository.cs
│   │   │   └── IUnitOfWork.cs
│   │   └── Backend.Domain.csproj
│   │
│   └── Backend.Infrastructure/  # Infrastructure Layer
│       ├── Persistence/         # Database context
│       │   └── ApplicationDbContext.cs
│       ├── Repositories/        # Repository implementations
│       │   ├── Repository.cs
│       │   ├── UserRepository.cs
│       │   ├── ReportRepository.cs
│       │   └── UnitOfWork.cs
│       ├── Services/            # Infrastructure services
│       │   ├── JwtService.cs
│       │   └── PasswordHasher.cs
│       └── Backend.Infrastructure.csproj
│
└── Frontend/
    ├── Dockerfile              # Frontend container definition
    ├── nginx.conf              # Nginx configuration
    └── src/                    # Angular application
```

## Architecture Layers

### 1. API Layer (Backend.API)
**Responsibility**: HTTP request handling and response formatting

- **Controllers**: Define REST API endpoints
  - `AuthController`: Authentication & authorization endpoints
  - `ReportsController`: Report management endpoints
- **Middleware**: JWT authentication, exception handling
- **Dependency Injection**: Service registration

### 2. Application Layer (Backend.Application)
**Responsibility**: Business logic orchestration using CQRS pattern

#### CQRS Pattern Implementation:
- **Commands**: Write operations (Create, Update, Delete)
  - `RegisterCommand`, `LoginCommand`
  - `CreateReportCommand`, `UpdateReportCommand`
- **Queries**: Read operations (Get, List, Search)
  - `GetUserByIdQuery`, `GetReportByIdQuery`
  - `GetAllReportsQuery`, `SearchReportsQuery`
- **Handlers**: Process commands and queries using MediatR
- **DTOs**: Data transfer between layers
- **Validators**: FluentValidation for input validation

### 3. Domain Layer (Backend.Domain)
**Responsibility**: Core business entities and rules

- **Entities**: Domain models
  - `User`: User accounts with roles
  - `Report`: Communication reports
  - `ReportAttachment`: File attachments
  - `RefreshToken`: Token management
- **Enums**: `UserRole`, `ReportStatus`, `ReportPriority`
- **Interfaces**: Repository contracts (no implementation)

### 4. Infrastructure Layer (Backend.Infrastructure)
**Responsibility**: External concerns and data access

- **DbContext**: Entity Framework Core configuration
- **Repositories**: Data access implementations
- **Services**: 
  - `JwtService`: JWT token generation/validation
  - `PasswordHasher`: BCrypt password hashing
- **Migrations**: Database schema management

## CQRS Benefits

1. **Separation of Concerns**: Reads and writes are separate
2. **Scalability**: Can scale read and write operations independently
3. **Maintainability**: Clear structure for business logic
4. **Testability**: Easy to test commands and queries in isolation

## Domain Models

### User Entity
```csharp
- Id: Guid
- Email: string (unique)
- PasswordHash: string
- FirstName, LastName: string
- PhoneNumber: string?
- Role: UserRole (User, Administrator, Supervisor)
- IsActive, EmailConfirmed: bool
- CreatedAt, UpdatedAt, LastLoginAt: DateTime
```

### Report Entity
```csharp
- Id: Guid
- Title, Description: string
- Status: ReportStatus (Draft, Submitted, UnderReview, Approved, Rejected, Archived)
- Priority: ReportPriority (Low, Normal, High, Critical)
- Category: string?
- UserId: Guid (FK to User)
- SubmittedAt, ReviewedAt: DateTime?
- ReviewNotes: string?
- Attachments: Collection<ReportAttachment>
```

## REST API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - Login with credentials
- `POST /refresh-token` - Refresh access token
- `POST /change-password` - Change password (authenticated)
- `POST /revoke-token` - Revoke refresh token
- `GET /me` - Get current user profile

### Reports (`/api/reports`)
- `GET /` - Get all reports (paginated)
- `GET /{id}` - Get report by ID
- `GET /my-reports` - Get current user's reports
- `GET /by-status/{status}` - Get reports by status
- `POST /search` - Search reports with filters
- `POST /` - Create new report
- `PUT /{id}` - Update report
- `DELETE /{id}` - Delete report
- `POST /{id}/submit` - Submit report for review
- `POST /{id}/review` - Review report (admin only)

## Security Implementation

### JWT Authentication
- **Access Token**: Short-lived (60 min default)
- **Refresh Token**: Long-lived, stored in database
- **Claims**: UserId, Email, Name, Role

### Authorization
- Role-based access control (RBAC)
- `[Authorize]` attribute on controllers
- `[Authorize(Roles = "Administrator,Supervisor")]` for admin endpoints

### Password Security
- BCrypt hashing with work factor of 12
- No plain text password storage

## Database Configuration

### Connection String Format:
```
Server=<host>;Database=<db_name>;User Id=<user>;Password=<password>;TrustServerCertificate=True;
```

### Migrations:
```bash
# Create migration
dotnet ef migrations add <MigrationName> --project Backend.Infrastructure --startup-project Backend.API

# Apply migration
dotnet ef database update --project Backend.Infrastructure --startup-project Backend.API
```

## Docker Deployment

### Services:
1. **database**: SQL Server 2022
   - Port: 1433
   - Volume: Persistent data storage
   
2. **backend**: .NET 8 API
   - Port: 5000
   - Depends on: database
   - Health check: `/health` endpoint
   
3. **frontend**: Angular + Nginx
   - Port: 4200 (dev) / 80 (prod)
   - Depends on: backend
   - Reverse proxy to backend

### Environment Variables:
See `.env.example` for required configuration.

### Running the Application:
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild and start
docker-compose up -d --build
```

## Key NuGet Packages

### Backend.API:
- Microsoft.AspNetCore.Authentication.JwtBearer
- Swashbuckle.AspNetCore (Swagger/OpenAPI)
- MediatR
- Serilog.AspNetCore

### Backend.Application:
- MediatR
- FluentValidation
- AutoMapper

### Backend.Infrastructure:
- Microsoft.EntityFrameworkCore.SqlServer
- BCrypt.Net-Next
- System.IdentityModel.Tokens.Jwt

## Development Workflow

1. **Define Domain Model** (Backend.Domain)
2. **Create DTOs** (Backend.Application)
3. **Implement Commands/Queries** (Backend.Application)
4. **Create Handlers** (Backend.Application)
5. **Add Repository Methods** (Backend.Infrastructure)
6. **Create Controller Endpoints** (Backend.API)
7. **Test with Swagger** (http://localhost:5000/swagger)

## Testing

### Swagger UI:
Available at `http://localhost:5000/swagger` in development

### Authentication Flow:
1. Register user via `/api/auth/register`
2. Login via `/api/auth/login` to get JWT token
3. Use token in Authorization header: `Bearer <token>`
4. Access protected endpoints

## Production Considerations

1. **Environment Variables**: Use secure secret management
2. **HTTPS**: Enable SSL/TLS certificates
3. **Database**: Use connection pooling and proper indexing
4. **Logging**: Configure structured logging (Serilog)
5. **Monitoring**: Add health checks and metrics
6. **CORS**: Configure allowed origins properly
7. **Rate Limiting**: Implement API rate limiting
8. **Data Protection**: Enable data encryption at rest

## Next Steps

1. Implement command/query handlers
2. Add FluentValidation validators
3. Set up AutoMapper profiles
4. Create database migrations
5. Add unit and integration tests
6. Configure CI/CD pipeline
7. Add API documentation
8. Implement OAuth 2.0 integration
