# UKNF Communication Platform - Setup Guide

## Prerequisites

- **Docker Desktop** (for containerized deployment)
- **.NET 8 SDK** (for local development)
- **Node.js 20+** (for frontend development)
- **SQL Server** (if running without Docker)
- **Visual Studio 2022** or **Visual Studio Code** (recommended IDEs)

## Quick Start with Docker

### 1. Clone the Repository
```bash
git clone <repository-url>
cd "HackYeah 2025"
```

### 2. Configure Environment Variables
```bash
# Copy the environment template
cp .env.example .env

# Edit .env with your configuration
# Update passwords, secrets, and OAuth settings
```

### 3. Start All Services
```bash
# Build and start all containers
docker-compose up -d --build

# View logs
docker-compose logs -f

# Check service status
docker-compose ps
```

### 4. Access the Application
- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:5000
- **Swagger UI**: http://localhost:5000/swagger
- **Health Check**: http://localhost:5000/health

### 5. Stop Services
```bash
docker-compose down

# To remove volumes (WARNING: deletes database data)
docker-compose down -v
```

## Local Development Setup

### Backend Setup

#### 1. Restore NuGet Packages
```bash
cd Backend
dotnet restore Backend.sln
```

#### 2. Update Database Connection String
Edit `Backend.API/appsettings.Development.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost,1433;Database=UknfCommunicationDb;User Id=sa;Password=YourPassword;TrustServerCertificate=True;"
  }
}
```

#### 3. Create Database
```bash
# Navigate to Backend.API project
cd Backend.API

# Create initial migration
dotnet ef migrations add InitialCreate --project ../Backend.Infrastructure --startup-project .

# Apply migration to database
dotnet ef database update --project ../Backend.Infrastructure --startup-project .
```

#### 4. Run the Backend
```bash
# From Backend.API directory
dotnet run

# Or with hot reload
dotnet watch run
```

The API will be available at:
- HTTP: http://localhost:5000
- Swagger: http://localhost:5000/swagger

### Frontend Setup

#### 1. Install Dependencies
```bash
cd Frontend
npm install
```

#### 2. Configure API URL
Edit `Frontend/src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api'
};
```

#### 3. Run the Frontend
```bash
npm start

# Or for production build
npm run build
```

The Angular app will be available at http://localhost:4200

## Project Structure Overview

```
Backend/
├── Backend.API/              # API Controllers & Startup
├── Backend.Application/      # CQRS Commands, Queries, DTOs
├── Backend.Domain/           # Entities, Interfaces
└── Backend.Infrastructure/   # EF Core, Repositories, Services

Frontend/
└── src/
    └── app/                  # Angular components
```

## Database Migrations

### Create New Migration
```bash
cd Backend/Backend.API
dotnet ef migrations add <MigrationName> \
  --project ../Backend.Infrastructure \
  --startup-project .
```

### Apply Migrations
```bash
dotnet ef database update \
  --project ../Backend.Infrastructure \
  --startup-project .
```

### Remove Last Migration
```bash
dotnet ef migrations remove \
  --project ../Backend.Infrastructure \
  --startup-project .
```

### Generate SQL Script
```bash
dotnet ef migrations script \
  --project ../Backend.Infrastructure \
  --startup-project . \
  --output migration.sql
```

## Testing the API

### Using Swagger UI
1. Navigate to http://localhost:5000/swagger
2. Register a new user via `/api/auth/register`
3. Login via `/api/auth/login` to get JWT token
4. Click "Authorize" button and enter: `Bearer <your-token>`
5. Test protected endpoints

### Using cURL
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePassword123!",
    "confirmPassword": "SecurePassword123!",
    "firstName": "John",
    "lastName": "Doe"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePassword123!"
  }'

# Get user profile (authenticated)
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer <your-token>"
```

## Environment Variables

### Required Variables (.env file)

```bash
# Database
DB_SA_PASSWORD=YourStrong@Password123
DB_NAME=UknfCommunicationDb

# ASP.NET Core
ASPNETCORE_ENVIRONMENT=Development

# JWT Configuration
JWT_SECRET=YourSuperSecretKeyForJWTTokenGeneration1234567890
JWT_ISSUER=UknfCommunicationPlatform
JWT_AUDIENCE=UknfCommunicationPlatformUsers
JWT_EXPIRATION=60

# OAuth 2.0
OAUTH_CLIENT_ID=your-oauth-client-id
OAUTH_CLIENT_SECRET=your-oauth-client-secret
OAUTH_AUTHORITY=https://your-oauth-provider.com

# Frontend
NODE_ENV=production
API_BASE_URL=http://localhost:5000
```

## Common Issues & Solutions

### Issue: Database Connection Failed
**Solution**: 
- Ensure SQL Server is running
- Check connection string in appsettings.json
- Verify firewall allows port 1433

### Issue: JWT Authentication Failed
**Solution**:
- Verify JWT_SECRET matches in appsettings.json
- Check token expiration
- Ensure Authorization header format: `Bearer <token>`

### Issue: Docker Container Won't Start
**Solution**:
```bash
# View container logs
docker-compose logs backend

# Rebuild containers
docker-compose up -d --build --force-recreate

# Check Docker daemon
docker ps
```

### Issue: EF Core Migration Failed
**Solution**:
```bash
# Reset database
dotnet ef database drop --project ../Backend.Infrastructure --startup-project .

# Recreate database
dotnet ef database update --project ../Backend.Infrastructure --startup-project .
```

## Development Workflow

### Adding a New Feature

1. **Define Domain Model** (Backend.Domain/Entities)
   ```csharp
   public class NewEntity : BaseEntity
   {
       // Properties
   }
   ```

2. **Create Repository Interface** (Backend.Domain/Interfaces)
   ```csharp
   public interface INewRepository : IRepository<NewEntity>
   {
       // Custom methods
   }
   ```

3. **Implement Repository** (Backend.Infrastructure/Repositories)
   ```csharp
   public class NewRepository : Repository<NewEntity>, INewRepository
   {
       // Implementation
   }
   ```

4. **Create DTOs** (Backend.Application/DTOs)
   ```csharp
   public record NewEntityDto(...);
   ```

5. **Define Commands/Queries** (Backend.Application/Features)
   ```csharp
   public record CreateNewEntityCommand(...) : IRequest<NewEntityDto>;
   ```

6. **Create Handlers** (Backend.Application/Features)
   ```csharp
   public class CreateNewEntityHandler : IRequestHandler<CreateNewEntityCommand, NewEntityDto>
   {
       // Implementation
   }
   ```

7. **Add Controller** (Backend.API/Controllers)
   ```csharp
   [ApiController]
   [Route("api/[controller]")]
   public class NewController : ControllerBase
   {
       // Endpoints
   }
   ```

8. **Create Migration**
   ```bash
   dotnet ef migrations add Add_NewEntity
   dotnet ef database update
   ```

## Building for Production

### Backend
```bash
cd Backend/Backend.API
dotnet publish -c Release -o ./publish
```

### Frontend
```bash
cd Frontend
npm run build --configuration=production
```

### Docker Production Build
```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

## Security Checklist

- [ ] Change default passwords in .env
- [ ] Use strong JWT secret (min 32 characters)
- [ ] Enable HTTPS in production
- [ ] Configure CORS properly
- [ ] Set up OAuth 2.0 provider
- [ ] Enable rate limiting
- [ ] Add input validation
- [ ] Implement logging and monitoring
- [ ] Regular security updates

## Additional Resources

- [.NET Documentation](https://docs.microsoft.com/dotnet)
- [Entity Framework Core](https://docs.microsoft.com/ef/core)
- [MediatR Documentation](https://github.com/jbogard/MediatR)
- [Angular Documentation](https://angular.io/docs)
- [Docker Documentation](https://docs.docker.com)

## Support

For issues and questions:
1. Check the ARCHITECTURE.md file
2. Review API documentation at /swagger
3. Check Docker logs: `docker-compose logs`
4. Verify environment configuration

## License

[Your License Here]
