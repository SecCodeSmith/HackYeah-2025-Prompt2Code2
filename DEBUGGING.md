# 🔧 DEBUGGING GUIDE - UKNF Communication Platform

## Table of Contents
1. [Quick Start Checklist](#quick-start-checklist)
2. [Common Issues & Solutions](#common-issues--solutions)
3. [Frontend Issues](#frontend-issues)
4. [Backend Issues](#backend-issues)
5. [Database Issues](#database-issues)
6. [Docker Issues](#docker-issues)
7. [Authentication Issues](#authentication-issues)
8. [Network & CORS Issues](#network--cors-issues)
9. [Debugging Tools](#debugging-tools)

---

## Quick Start Checklist

Before debugging, verify these basics:

### Environment Check
```powershell
# 1. Check Docker is running
docker --version
docker ps

# 2. Check Node.js and npm
node --version
npm --version

# 3. Check .NET SDK
dotnet --version
```

### Services Status
```powershell
# Check all containers are running
docker-compose ps

# Expected output:
# database   running   0.0.0.0:1433->1433/tcp
# backend    running   0.0.0.0:5000->8080/tcp
# frontend   running   0.0.0.0:4200->80/tcp
```

### Quick Health Check
```powershell
# Test database connection
docker exec -it uknf-database /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "YourStrong@Passw0rd" -Q "SELECT 1"

# Test backend API
curl http://localhost:5000/health

# Test frontend
curl http://localhost:4200
```

---

## Common Issues & Solutions

### Issue: "Application won't start"

**Symptoms:** Docker containers keep restarting or exit immediately

**Diagnosis Steps:**
```powershell
# 1. Check container logs
docker-compose logs database
docker-compose logs backend
docker-compose logs frontend

# 2. Check for port conflicts
netstat -ano | findstr :1433
netstat -ano | findstr :5000
netstat -ano | findstr :4200
```

**Solutions:**

1. **Port Already in Use:**
```powershell
# Kill process using the port (replace PID with actual process ID)
taskkill /PID <PID> /F

# Or change ports in docker-compose.yml
```

2. **Docker Out of Memory:**
```powershell
# Increase Docker memory limit in Docker Desktop settings
# Recommended: At least 4GB RAM
```

3. **Clean Start:**
```powershell
docker-compose down -v
docker-compose up --build
```

---

## Frontend Issues

### Issue: "Angular dependencies missing"

**Symptoms:**
- `Cannot find module '@angular/core'`
- `Cannot find module 'primeng'`
- TypeScript compilation errors

**Solution:**
```powershell
cd Frontend

# Install all dependencies
npm install

# If errors persist, clear cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Issue: "PrimeNG styles not working"

**Symptoms:** Components render without styles

**Solution:**

1. Check `styles.css` includes PrimeNG:
```css
/* Frontend/src/styles.css */
@import "primeng/resources/themes/lara-light-blue/theme.css";
@import "primeng/resources/primeng.css";
@import "primeicons/primeicons.css";
```

2. Install missing packages:
```powershell
npm install primeng primeicons
```

### Issue: "HTTP calls failing with CORS errors"

**Symptoms:**
- Console error: `Access to XMLHttpRequest blocked by CORS policy`
- 401 Unauthorized errors

**Solution:**

1. Check `proxy.conf.json` is configured:
```json
{
  "/api": {
    "target": "http://localhost:5000",
    "secure": false,
    "changeOrigin": true
  }
}
```

2. Start Angular with proxy:
```powershell
ng serve --proxy-config proxy.conf.json
```

3. Verify backend CORS settings in `Program.cs`:
```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Before app.UseAuthentication()
app.UseCors("AllowAll");
```

### Issue: "AuthGuard redirecting to login constantly"

**Symptoms:** Cannot access protected routes, constant redirects

**Solution:**

1. Check token is being stored:
```typescript
// In browser console
localStorage.getItem('accessToken')
localStorage.getItem('refreshToken')
```

2. Verify AuthService is working:
```typescript
// In browser console
const authService = inject(AuthService);
console.log(authService.isAuthenticated());
console.log(authService.currentUser());
```

3. Check token expiration:
```typescript
// AuthService should handle token refresh automatically
// Check console for refresh errors
```

### Issue: "Component not rendering"

**Symptoms:** Blank page or component not visible

**Diagnosis:**
```typescript
// Check browser console for errors
// Check network tab for API calls
// Check component is imported in standalone imports array
```

**Solution:**

1. Verify all imports in component:
```typescript
@Component({
  standalone: true,
  imports: [
    CommonModule,  // Required for *ngIf, *ngFor
    FormsModule,   // Required for [(ngModel)]
    // ... PrimeNG modules
  ]
})
```

2. Check routes are configured:
```typescript
// app.routes.ts
export const routes: Routes = [
  {
    path: 'reports',
    loadComponent: () => import('./pages/reports/reports.component').then(m => m.ReportsComponent),
    canActivate: [authGuard]
  }
];
```

---

## Backend Issues

### Issue: "Database connection failed"

**Symptoms:**
- Backend logs: `Cannot connect to SQL Server`
- Error: `Login failed for user 'sa'`

**Solution:**

1. Check database is running:
```powershell
docker ps | findstr database
```

2. Test connection directly:
```powershell
docker exec -it uknf-database /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "YourStrong@Passw0rd" -Q "SELECT @@VERSION"
```

3. Verify connection string in `appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=database;Database=UKNFDB;User Id=sa;Password=YourStrong@Passw0rd;TrustServerCertificate=True;"
  }
}
```

4. Wait for database initialization:
```powershell
# Database needs ~60 seconds to fully initialize on first run
docker logs uknf-database --follow
# Wait for: "SQL Server is now ready for client connections"
```

### Issue: "Entity Framework migrations not applying"

**Symptoms:**
- Error: `Invalid object name 'Users'`
- Tables missing in database

**Solution:**

1. Apply migrations manually:
```powershell
cd Backend

# Create migration if none exist
dotnet ef migrations add InitialCreate --project Backend.API

# Apply migrations
dotnet ef database update --project Backend.API

# Or using connection string directly
dotnet ef database update --connection "Server=localhost,1433;Database=UKNFDB;User Id=sa;Password=YourStrong@Passw0rd;TrustServerCertificate=True;" --project Backend.API
```

2. Check migration status:
```powershell
dotnet ef migrations list --project Backend.API
```

3. Reset database if needed:
```powershell
dotnet ef database drop --project Backend.API
dotnet ef database update --project Backend.API
```

### Issue: "MediatR handlers not found"

**Symptoms:**
- Error: `No handler was found for request of type RegisterCommand`
- 500 Internal Server Error

**Solution:**

1. Ensure handlers are implemented:
```csharp
// Backend.Application/Features/Auth/Handlers/RegisterCommandHandler.cs
public class RegisterCommandHandler : IRequestHandler<RegisterCommand, AuthResponse>
{
    public async Task<AuthResponse> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        // Implementation
    }
}
```

2. Register MediatR in `Program.cs`:
```csharp
builder.Services.AddMediatR(cfg => 
    cfg.RegisterServicesFromAssembly(typeof(RegisterCommand).Assembly));
```

3. Check handler assembly is referenced:
```xml
<!-- Backend.API.csproj -->
<ItemGroup>
  <ProjectReference Include="..\Backend.Application\Backend.Application.csproj" />
</ItemGroup>
```

### Issue: "JWT token validation fails"

**Symptoms:**
- 401 Unauthorized on authenticated endpoints
- Error: `IDX10223: Lifetime validation failed`

**Solution:**

1. Check JWT configuration in `appsettings.json`:
```json
{
  "Jwt": {
    "Issuer": "UKNFBackend",
    "Audience": "UKNFFrontend",
    "SecretKey": "your-256-bit-secret-key-here-min-32-chars",
    "AccessTokenExpirationMinutes": 60,
    "RefreshTokenExpirationDays": 7
  }
}
```

2. Verify token is being sent:
```powershell
# In browser network tab, check Authorization header:
# Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

3. Check server time synchronization:
```powershell
# Token validation is time-sensitive
w32tm /query /status
```

### Issue: "Swagger not loading"

**Symptoms:** Cannot access http://localhost:5000/swagger

**Solution:**

1. Check Swagger is enabled:
```csharp
// Program.cs
app.UseSwagger();
app.UseSwaggerUI();
```

2. Navigate to correct URL:
```
http://localhost:5000/swagger/index.html
```

3. Check for middleware order issues:
```csharp
// Correct order:
app.UseSwagger();
app.UseSwaggerUI();
app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
```

---

## Database Issues

### Issue: "Cannot connect to SQL Server from host"

**Symptoms:** SSMS or Azure Data Studio cannot connect

**Solution:**

1. Use correct connection details:
```
Server: localhost,1433
Login: sa
Password: YourStrong@Passw0rd
Trust Server Certificate: Yes
```

2. Check port is published:
```powershell
docker ps | findstr 1433
# Should show: 0.0.0.0:1433->1433/tcp
```

3. Test with sqlcmd:
```powershell
docker exec -it uknf-database /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "YourStrong@Passw0rd"
```

### Issue: "Database data lost after restart"

**Symptoms:** Users/reports disappear after stopping containers

**Solution:**

1. Check volume is configured in `docker-compose.yml`:
```yaml
volumes:
  mssql-data:
    driver: local

services:
  database:
    volumes:
      - mssql-data:/var/opt/mssql
```

2. Verify volume exists:
```powershell
docker volume ls | findstr mssql-data
```

3. Backup database:
```powershell
docker exec uknf-database /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "YourStrong@Passw0rd" -Q "BACKUP DATABASE UKNFDB TO DISK='/var/opt/mssql/backup/uknfdb.bak'"
```

---

## Docker Issues

### Issue: "docker-compose up fails"

**Symptoms:**
- Error: `yaml: line X: did not find expected key`
- Error: `service 'X' failed to build`

**Solution:**

1. Validate docker-compose.yml:
```powershell
docker-compose config
```

2. Check Docker Desktop is running:
```powershell
# Windows
Get-Service -Name com.docker.service

# Or check Docker Desktop tray icon
```

3. Restart Docker:
```powershell
# Restart Docker Desktop from tray icon
# Or restart service:
Restart-Service -Name com.docker.service
```

### Issue: "Build context too large"

**Symptoms:** `Sending build context to Docker daemon` takes forever

**Solution:**

1. Check `.dockerignore` files exist:
```
# Backend/.dockerignore
**/bin/
**/obj/
**/.vs/
**/node_modules/

# Frontend/.dockerignore
**/node_modules/
**/dist/
**/.angular/
```

2. Clean build artifacts:
```powershell
# Backend
cd Backend
Remove-Item -Recurse -Force bin,obj

# Frontend
cd Frontend
Remove-Item -Recurse -Force node_modules,dist,.angular
```

### Issue: "Container keeps restarting"

**Symptoms:** `docker ps` shows container restarting

**Diagnosis:**
```powershell
# Check exit code and error
docker inspect <container_name> | Select-String -Pattern "ExitCode"

# Check logs
docker logs <container_name> --tail 50
```

**Common Solutions:**

1. **Backend database connection:**
```powershell
# Backend needs to wait for database
# Check depends_on and healthcheck in docker-compose.yml
```

2. **Port conflicts:**
```powershell
# Change port in docker-compose.yml
ports:
  - "5001:8080"  # Use 5001 instead of 5000
```

3. **Memory limits:**
```powershell
# Add to docker-compose.yml
services:
  backend:
    mem_limit: 512m
```

---

## Authentication Issues

### Issue: "Cannot login - 401 Unauthorized"

**Diagnosis:**
```powershell
# Test login endpoint directly
curl -X POST http://localhost:5000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{"email":"test@example.com","password":"Test123!"}'
```

**Solutions:**

1. **User doesn't exist:**
```powershell
# Register first
curl -X POST http://localhost:5000/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{
    "email":"test@example.com",
    "password":"Test123!",
    "firstName":"Test",
    "lastName":"User",
    "pesel":"00270803628"
  }'
```

2. **Wrong password:**
- Check BCrypt is working
- Verify password meets requirements (8+ chars, uppercase, lowercase, digit, special char)

3. **Email not confirmed:**
- Check if email confirmation is required
- Check User entity in database

### Issue: "Token expired errors"

**Symptoms:**
- 401 after some time
- Error: `The token expired at 'X'`

**Solution:**

1. Token should auto-refresh via interceptor
2. Check refresh token logic:
```typescript
// AuthService.refreshToken() should be called automatically
// Check browser console for refresh errors
```

3. Increase token lifetime (for testing):
```json
// appsettings.json
{
  "Jwt": {
    "AccessTokenExpirationMinutes": 1440  // 24 hours
  }
}
```

### Issue: "PESEL validation failing"

**Symptoms:** Cannot register with valid PESEL

**Solution:**

1. Test PESEL validator:
```typescript
// Example valid PESELs:
// 00270803628 - Feb 27, 2000
// 44051401458 - May 14, 1944
```

2. Check validator implementation:
```typescript
// auth.component.ts - validatePESEL() method
// Should use checksum algorithm
```

3. Disable validation temporarily (for testing):
```typescript
// Remove Validators.required from PESEL field
```

---

## Network & CORS Issues

### Issue: "CORS policy blocking requests"

**Symptoms:**
- `Access-Control-Allow-Origin` error in console
- Network tab shows preflight OPTIONS requests failing

**Solution:**

1. **Development mode (allow all):**
```csharp
// Program.cs
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

app.UseCors("AllowAll");
```

2. **Production mode (specific origin):**
```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("Production", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});
```

3. **Verify middleware order:**
```csharp
// CORS must be before Authentication/Authorization
app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();
```

### Issue: "API not reachable from frontend"

**Diagnosis:**
```powershell
# Test API directly from PowerShell
Invoke-WebRequest -Uri http://localhost:5000/health -Method GET

# Check if backend is listening
netstat -ano | findstr :5000
```

**Solutions:**

1. **Use proxy instead of direct calls:**
```json
// proxy.conf.json
{
  "/api": {
    "target": "http://localhost:5000",
    "secure": false
  }
}
```

2. **Start Angular with proxy:**
```powershell
ng serve --proxy-config proxy.conf.json --port 4200
```

3. **Update API URLs in services:**
```typescript
// Use relative URLs when using proxy
private readonly API_URL = '/api/auth';  // Not http://localhost:5000
```

---

## Debugging Tools

### Browser Developer Tools

**Console Tab:**
- Check for JavaScript errors
- Test code in console:
```javascript
// Get current token
localStorage.getItem('accessToken')

// Decode JWT token
JSON.parse(atob(localStorage.getItem('accessToken').split('.')[1]))
```

**Network Tab:**
- Check request/response headers
- Verify Authorization header is present
- Check response status codes
- Inspect request payloads

**Application Tab:**
- Check localStorage for tokens
- Clear storage: localStorage.clear()

### Backend Debugging

**Enable detailed logging:**
```json
// appsettings.Development.json
{
  "Logging": {
    "LogLevel": {
      "Default": "Debug",
      "Microsoft.AspNetCore": "Debug",
      "Microsoft.EntityFrameworkCore": "Debug"
    }
  }
}
```

**Attach debugger:**
```powershell
# In VS Code, press F5 or use .vscode/launch.json
```

**SQL profiling:**
```csharp
// Program.cs - add EF Core logging
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseSqlServer(connectionString)
           .EnableSensitiveDataLogging()  // Shows parameter values
           .EnableDetailedErrors();        // Shows detailed errors
});
```

### Docker Debugging

**Container logs:**
```powershell
# Follow logs in real-time
docker-compose logs -f backend

# Last 100 lines
docker logs uknf-backend --tail 100

# Logs since timestamp
docker logs uknf-backend --since 2025-01-20T10:00:00
```

**Execute commands in container:**
```powershell
# Backend container
docker exec -it uknf-backend /bin/bash

# Check files
ls -la /app

# Check environment variables
env | grep ConnectionStrings
```

**Database queries:**
```powershell
# Connect to SQL Server
docker exec -it uknf-database /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "YourStrong@Passw0rd"

# Example queries:
SELECT * FROM Users;
SELECT * FROM Reports;
GO
```

### Network Debugging

**Test API endpoints:**
```powershell
# Health check
curl http://localhost:5000/health

# Register
curl -X POST http://localhost:5000/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{"email":"test@test.com","password":"Test123!","firstName":"Test","lastName":"User","pesel":"00270803628"}'

# Login
curl -X POST http://localhost:5000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{"email":"test@test.com","password":"Test123!"}'

# Get reports (with token)
$token = "your-jwt-token"
curl http://localhost:5000/api/reports -H "Authorization: Bearer $token"
```

**Check port connectivity:**
```powershell
# Test if port is open
Test-NetConnection -ComputerName localhost -Port 5000

# Alternative
telnet localhost 5000
```

---

## Emergency Reset Procedure

If nothing works, perform a complete reset:

```powershell
# 1. Stop all containers
docker-compose down -v

# 2. Remove all images
docker rmi $(docker images -q hackyeah2025_*)

# 3. Clean .NET build artifacts
cd Backend
Remove-Item -Recurse -Force bin,obj
dotnet clean

# 4. Clean Angular artifacts
cd ../Frontend
Remove-Item -Recurse -Force node_modules,dist,.angular
npm cache clean --force

# 5. Reinstall dependencies
npm install

# 6. Rebuild and start
cd ..
docker-compose up --build

# 7. Wait for services to be healthy (2-3 minutes)
docker-compose ps

# 8. Apply migrations
docker exec uknf-backend dotnet ef database update

# 9. Test the application
# Frontend: http://localhost:4200
# Backend: http://localhost:5000/swagger
# Database: localhost,1433
```

---

## Getting Help

### Check these resources first:
1. Application logs: `docker-compose logs`
2. Browser console errors
3. Network tab in DevTools
4. This debugging guide

### Collect diagnostic information:
```powershell
# Save logs to file
docker-compose logs > logs.txt

# Check system resources
docker stats --no-stream

# Export container configuration
docker inspect uknf-backend > backend-inspect.json
```

### Report issues with:
- Exact error messages
- Steps to reproduce
- Relevant log files
- Docker and .NET versions
- OS version

---

## Preventive Measures

### Regular Maintenance

```powershell
# Clean Docker system (weekly)
docker system prune -a --volumes

# Update packages (monthly)
cd Frontend
npm update

cd ../Backend
dotnet outdated
```

### Best Practices

1. **Always use version control**
2. **Keep dependencies updated**
3. **Monitor logs during development**
4. **Test after each significant change**
5. **Use feature branches for experiments**
6. **Document custom configurations**
7. **Regular database backups**

### Performance Monitoring

```powershell
# Check Docker resource usage
docker stats

# Check database size
docker exec uknf-database /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "YourStrong@Passw0rd" -Q "sp_spaceused"

# Monitor response times in browser Network tab
```

---

## Quick Reference Commands

```powershell
# Start application
docker-compose up -d

# View logs
docker-compose logs -f

# Restart service
docker-compose restart backend

# Check health
docker-compose ps

# Stop application
docker-compose down

# Complete rebuild
docker-compose up --build --force-recreate

# Access database
docker exec -it uknf-database /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "YourStrong@Passw0rd"

# Run migrations
docker exec uknf-backend dotnet ef database update

# Install frontend dependencies
cd Frontend && npm install

# Build backend
cd Backend && dotnet build

# Test API endpoint
curl http://localhost:5000/health
```

---

## Conclusion

This guide covers the most common issues you'll encounter. Remember:

1. **Read error messages carefully** - they usually point to the solution
2. **Check logs first** - most issues are logged
3. **Test incrementally** - isolate the problem
4. **Use the diagnostic commands** provided above
5. **Don't skip the basics** - verify services are running

If you're still stuck after following this guide, gather the diagnostic information specified in the "Getting Help" section and reach out for support.
