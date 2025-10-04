# UKNF Communication Platform

A secure, enterprise-grade communication platform built with .NET 8, Angular, and Docker, following CQRS architecture pattern.

## 🚀 Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd "HackYeah 2025"

# Configure environment
cp .env.example .env

# Start all services with Docker
docker-compose up -d --build

# Access the application
# Frontend: http://localhost:4200
# Backend API: http://localhost:5000
# Swagger UI: http://localhost:5000/swagger
```

## 📋 Overview

This platform provides secure communication and report management for UKNF (Polish Financial Supervision Authority) with the following features:

### Key Features
- ✅ **User Authentication** - JWT-based authentication with refresh tokens
- ✅ **Role-Based Access Control** - User, Administrator, and Supervisor roles
- ✅ **Report Management** - Create, update, submit, and review reports
- ✅ **CQRS Pattern** - Separation of commands and queries for scalability
- ✅ **RESTful API** - Well-documented API with Swagger/OpenAPI
- ✅ **Containerized** - Docker & Docker Compose for easy deployment
- ✅ **Database Migrations** - Entity Framework Core for schema management
- ✅ **Security** - BCrypt password hashing, JWT tokens, CORS protection

## 🏗️ Architecture

### Technology Stack
- **Backend**: .NET 8, ASP.NET Core Web API, Entity Framework Core
- **Frontend**: Angular with TypeScript
- **Database**: Microsoft SQL Server 2022
- **Authentication**: JWT + OAuth 2.0
- **Containerization**: Docker & Docker Compose
- **Pattern**: CQRS (Command Query Responsibility Segregation)

### Project Structure
```
HackYeah 2025/
├── Backend/
│   ├── Backend.API/            # Presentation Layer (Controllers, Startup)
│   ├── Backend.Application/    # Application Layer (CQRS, DTOs, Handlers)
│   ├── Backend.Domain/         # Domain Layer (Entities, Interfaces)
│   └── Backend.Infrastructure/ # Infrastructure (EF Core, Repositories)
├── Frontend/
│   └── src/                    # Angular application
├── docker-compose.yml          # Container orchestration
└── Documentation files (.md)
```

## 📚 Documentation

- **[QUICKSTART.md](QUICKSTART.md)** - Get started quickly
- **[SETUP.md](SETUP.md)** - Detailed setup instructions
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Architecture deep dive
- **[IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md)** - Complete implementation reference

## 🛠️ Prerequisites

- Docker Desktop (recommended for quick start)
- .NET 8 SDK (for local development)
- Node.js 20+ (for frontend development)
- SQL Server (if not using Docker)
- Visual Studio 2022 or VS Code

## 🔧 Development Setup

### Local Development (without Docker)

#### Backend
```bash
cd Backend
dotnet restore Backend.sln
cd Backend.API
dotnet ef database update --project ../Backend.Infrastructure
dotnet run
```

#### Frontend
```bash
cd Frontend
npm install
npm start
```

### Docker Development
```bash
docker-compose up -d
docker-compose logs -f backend
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh-token` - Refresh JWT token
- `GET /api/auth/me` - Get current user profile

### Reports
- `GET /api/reports` - Get all reports (paginated)
- `POST /api/reports` - Create new report
- `PUT /api/reports/{id}` - Update report
- `DELETE /api/reports/{id}` - Delete report
- `POST /api/reports/{id}/submit` - Submit for review
- `POST /api/reports/{id}/review` - Review report (admin only)

**Full API documentation**: http://localhost:5000/swagger

## 🔐 Security Features

- **Password Security**: BCrypt hashing with work factor 12
- **JWT Authentication**: Short-lived access tokens (60 min default)
- **Refresh Tokens**: Long-lived tokens stored in database
- **Role-Based Authorization**: Granular access control
- **CORS Protection**: Configurable origin whitelist
- **HTTPS Support**: Production-ready SSL/TLS configuration

## 🗄️ Database Schema

### Core Entities
- **User** - User accounts with authentication and roles
- **Report** - Communication reports with status tracking
- **ReportAttachment** - File attachments for reports
- **RefreshToken** - Token management for authentication

### Entity Relationships
```
User 1---* Report
Report 1---* ReportAttachment
User 1---* RefreshToken
```

## 🧪 Testing

### Swagger UI
1. Navigate to http://localhost:5000/swagger
2. Register a user via `/api/auth/register`
3. Login via `/api/auth/login` to get JWT token
4. Click "Authorize" and enter: `Bearer <your-token>`
5. Test protected endpoints

### cURL Example
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"Pass123!","confirmPassword":"Pass123!","firstName":"John","lastName":"Doe"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"Pass123!"}'
```

## 📦 NuGet Packages

### Key Dependencies
- **MediatR** - CQRS mediator pattern
- **Entity Framework Core** - ORM and database access
- **FluentValidation** - Input validation
- **Swashbuckle** - Swagger/OpenAPI documentation
- **BCrypt.Net** - Password hashing
- **JWT Bearer** - Token authentication
- **AutoMapper** - Object-to-object mapping
- **Serilog** - Structured logging

## 🐳 Docker Services

### Containers
1. **database** - SQL Server 2022 (Port 1433)
2. **backend** - .NET 8 API (Port 5000)
3. **frontend** - Angular + Nginx (Port 4200/80)

### Health Checks
- Database: SQL Server connectivity test
- Backend: `/health` endpoint
- Frontend: HTTP 200 response

## 🔄 CQRS Pattern

### Commands (Write Operations)
- `RegisterCommand`, `LoginCommand`
- `CreateReportCommand`, `UpdateReportCommand`, `DeleteReportCommand`

### Queries (Read Operations)
- `GetUserByIdQuery`, `GetUserByEmailQuery`
- `GetReportByIdQuery`, `GetAllReportsQuery`, `SearchReportsQuery`

### Benefits
- Clear separation of concerns
- Independent scaling of reads/writes
- Improved testability and maintainability

## 🚀 Deployment

### Production Checklist
- [ ] Update JWT secret (min 32 characters)
- [ ] Configure strong database passwords
- [ ] Enable HTTPS/SSL certificates
- [ ] Set up OAuth 2.0 provider
- [ ] Configure CORS for production domains
- [ ] Enable rate limiting
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy
- [ ] Review security headers
- [ ] Enable data encryption at rest

### Docker Production
```bash
# Build production images
docker-compose -f docker-compose.yml -f docker-compose.prod.yml build

# Start production services
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## 📈 Performance Considerations

- Database indexing on frequently queried columns
- Connection pooling for EF Core
- Response caching for read-heavy endpoints
- Pagination for large result sets
- Asynchronous operations throughout

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Team

HackYeah 2025 Team

## 🔗 Resources

- [.NET Documentation](https://docs.microsoft.com/dotnet)
- [Angular Documentation](https://angular.io/docs)
- [Entity Framework Core](https://docs.microsoft.com/ef/core)
- [Docker Documentation](https://docs.docker.com)
- [CQRS Pattern](https://martinfowler.com/bliki/CQRS.html)

## 📞 Support

For questions and support:
- Check documentation in the `/docs` folder
- Review API documentation at `/swagger`
- Check Docker logs: `docker-compose logs -f`

---

**Built with ❤️ for HackYeah 2025**
