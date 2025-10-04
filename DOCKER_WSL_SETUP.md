# Docker on WSL Setup & Deployment Guide

## Prerequisites

1. **Install WSL 2** (if not already installed)
```powershell
# Run in PowerShell as Administrator
wsl --install
# OR update to WSL 2
wsl --set-default-version 2
```

2. **Install Docker Desktop for Windows**
- Download from: https://www.docker.com/products/docker-desktop/
- During installation, ensure "Use WSL 2 based engine" is checked
- Enable WSL 2 integration in Docker Desktop settings

3. **Verify Installation**
```bash
# In WSL terminal
docker --version
docker-compose --version
```

---

## Project Setup in WSL

### Step 1: Access Your Project in WSL

```bash
# Navigate to your Windows directory from WSL
cd /mnt/c/Users/Kuba/Desktop/HackYeah\ 2025/

# OR copy project to WSL filesystem for better performance
cp -r /mnt/c/Users/Kuba/Desktop/HackYeah\ 2025/ ~/HackYeah-2025/
cd ~/HackYeah-2025/
```

**Note:** Files in WSL filesystem (`~/`) perform better than `/mnt/c/` mount.

### Step 2: Create Missing Dockerfiles

#### Backend Dockerfile

Create `Backend/Dockerfile`:

```dockerfile
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy csproj files and restore
COPY Backend.Domain/*.csproj ./Backend.Domain/
COPY Backend.Application/*.csproj ./Backend.Application/
COPY Backend.Infrastructure/*.csproj ./Backend.Infrastructure/
COPY Backend/*.csproj ./Backend/
RUN dotnet restore ./Backend/Backend.csproj

# Copy all files and build
COPY Backend.Domain/. ./Backend.Domain/
COPY Backend.Application/. ./Backend.Application/
COPY Backend.Infrastructure/. ./Backend.Infrastructure/
COPY Backend/. ./Backend/
WORKDIR /src/Backend
RUN dotnet build Backend.csproj -c Release -o /app/build
RUN dotnet publish Backend.csproj -c Release -o /app/publish

# Runtime image
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build /app/publish .

# Create https directory for certificates
RUN mkdir -p /https

EXPOSE 5000 5001
ENTRYPOINT ["dotnet", "Backend.dll"]
```

#### Frontend Dockerfile

Create `Frontend/Dockerfile`:

```dockerfile
# Build stage
FROM node:20-alpine AS build
WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build -- --configuration production

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Frontend nginx.conf

Create `Frontend/nginx.conf`:

```nginx
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        # Enable gzip compression
        gzip on;
        gzip_vary on;
        gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

        # API proxy
        location /api/ {
            proxy_pass http://backend:5000/api/;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }

        # Angular routing
        location / {
            try_files $uri $uri/ /index.html;
        }
    }
}
```

### Step 3: Create .env File

Create `.env` in project root:

```env
# Database Configuration
DB_SA_PASSWORD=YourStrong@Password123
DB_NAME=UknfCommunicationDb

# JWT Configuration
JWT_SECRET=YourSuperSecretKeyForJWTTokenGeneration1234567890123456
JWT_ISSUER=UknfCommunicationPlatform
JWT_AUDIENCE=UknfCommunicationPlatformUsers
JWT_EXPIRATION=60

# HTTPS Certificate
CERT_PASSWORD=devcert

# Environment
ASPNETCORE_ENVIRONMENT=Development
NODE_ENV=production
API_BASE_URL=http://backend:5000
```

### Step 4: Generate HTTPS Certificate

```bash
cd Backend
mkdir -p https

# Generate development certificate
dotnet dev-certs https -ep https/aspnetapp.pfx -p devcert --trust

# Set permissions (WSL)
chmod 644 https/aspnetapp.pfx
```

---

## Build and Run with Docker Compose

### Build Images

```bash
# From project root
docker-compose build
```

### Run Containers

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f database
```

### Stop Containers

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (clean database)
docker-compose down -v
```

---

## Database Migration

### Option 1: Run Migration from Host

```bash
cd Backend
dotnet ef database update --connection "Server=localhost,1433;Database=UknfCommunicationDb;User Id=sa;Password=YourStrong@Password123;TrustServerCertificate=True;"
```

### Option 2: Run Migration in Container

```bash
# Access backend container
docker-compose exec backend bash

# Run migration
dotnet ef database update

# Exit container
exit
```

### Option 3: Auto-Migration on Startup

Add to `Backend/Program.cs` before `app.Run()`:

```csharp
// Auto-migrate database on startup (Development only)
if (app.Environment.IsDevelopment())
{
    using (var scope = app.Services.CreateScope())
    {
        var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        dbContext.Database.Migrate();
    }
}
```

---

## Access the Application

Once running:

- **Frontend:** http://localhost:4200
- **Backend API:** http://localhost:5000
- **Backend HTTPS:** https://localhost:5001
- **Database:** localhost:1433 (SQL Server)

---

## Troubleshooting

### Issue: Docker Compose fails to start

```bash
# Check logs
docker-compose logs

# Rebuild images
docker-compose build --no-cache

# Remove old containers/volumes
docker-compose down -v
docker system prune -a
```

### Issue: Backend can't connect to database

```bash
# Check if database is healthy
docker-compose ps

# Check database logs
docker-compose logs database

# Wait for database to be ready (it takes ~30 seconds on first run)
```

### Issue: Permission denied on certificate

```bash
# Fix permissions
chmod 644 Backend/https/aspnetapp.pfx
```

### Issue: Port already in use

```bash
# Find what's using the port
netstat -ano | findstr :5000
netstat -ano | findstr :4200
netstat -ano | findstr :1433

# Kill the process or change ports in docker-compose.yml
```

### Issue: WSL performance is slow

```bash
# Move project to WSL filesystem
cp -r /mnt/c/Users/Kuba/Desktop/HackYeah\ 2025/ ~/HackYeah-2025/
cd ~/HackYeah-2025/

# This provides much better I/O performance
```

---

## Development Workflow

### Hot Reload (Development Mode)

For development with hot reload, use this alternative docker-compose.dev.yml:

```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./Backend
      dockerfile: Dockerfile.dev
    volumes:
      - ./Backend:/app
      - /app/bin
      - /app/obj
    environment:
      - ASPNETCORE_ENVIRONMENT=Development
      - ASPNETCORE_URLS=http://+:5000
    ports:
      - "5000:5000"
    depends_on:
      - database

  frontend:
    build:
      context: ./Frontend
      dockerfile: Dockerfile.dev
    volumes:
      - ./Frontend:/app
      - /app/node_modules
    ports:
      - "4200:4200"
    command: npm start

  database:
    image: mcr.microsoft.com/mssql/server:2022-latest
    environment:
      - ACCEPT_EULA=Y
      - SA_PASSWORD=YourStrong@Password123
    ports:
      - "1433:1433"
```

Run with:
```bash
docker-compose -f docker-compose.dev.yml up
```

---

## Production Deployment

### Build for Production

```bash
# Tag images for registry
docker tag hackyeah-2025_backend:latest myregistry.azurecr.io/uknf-backend:latest
docker tag hackyeah-2025_frontend:latest myregistry.azurecr.io/uknf-frontend:latest

# Push to registry
docker push myregistry.azurecr.io/uknf-backend:latest
docker push myregistry.azurecr.io/uknf-frontend:latest
```

### Deploy to Azure/AWS/GCP

See separate deployment guides for:
- Azure Container Apps
- AWS ECS
- Google Cloud Run
- Kubernetes (AKS/EKS/GKE)

---

## Quick Commands Reference

```bash
# Build and start
docker-compose up --build -d

# View logs
docker-compose logs -f

# Restart service
docker-compose restart backend

# Execute command in container
docker-compose exec backend bash
docker-compose exec database /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P YourStrong@Password123

# Clean everything
docker-compose down -v
docker system prune -a

# Check container health
docker-compose ps
docker inspect <container_id>

# Monitor resource usage
docker stats
```

---

## Next Steps

1. ✅ Fix compilation errors in Backend
2. ✅ Generate EF Core migration
3. ✅ Build Docker images
4. ✅ Run docker-compose up
5. ✅ Test application
6. ✅ Deploy to production

---

## Additional Resources

- Docker Documentation: https://docs.docker.com/
- Docker Compose: https://docs.docker.com/compose/
- WSL 2: https://docs.microsoft.com/en-us/windows/wsl/
- ASP.NET Core in Docker: https://docs.microsoft.com/en-us/aspnet/core/host-and-deploy/docker/
- Angular in Docker: https://angular.io/guide/deployment
