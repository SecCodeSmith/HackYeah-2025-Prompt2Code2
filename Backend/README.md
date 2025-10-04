# Backend - .NET 9 Web API

RESTful API backend for HackYeah 2025 application.

## 🚀 Quick Start

```powershell
# Restore packages
dotnet restore

# Build the project
dotnet build

# Run the application
dotnet run

# Run with hot reload (recommended for development)
dotnet watch run
```

The API will be available at `http://localhost:5000`

## 📁 Project Structure

```
Backend/
├── Controllers/           # API Controllers
│   └── TestController.cs # Example test controller
├── Properties/           
│   └── launchSettings.json # Launch configuration
├── appsettings.json      # Application settings
├── appsettings.Development.json # Development settings
├── Program.cs            # Application entry point
└── Backend.csproj        # Project file
```

## 🔧 Technologies

- **.NET 9.0** - Framework
- **ASP.NET Core** - Web framework
- **Entity Framework Core 9.0** - ORM (installed but not configured)
- **Swagger/OpenAPI** - API documentation

## 📚 API Endpoints

### Test Controller

Base URL: `/api/test`

#### Get Test Message
```http
GET /api/test
```

**Response:**
```json
{
  "message": "Connected to .NET backend successfully!"
}
```

#### Get Application Info
```http
GET /api/test/info
```

**Response:**
```json
{
  "application": "HackYeah 2025 Backend",
  "version": "1.0.0",
  "framework": ".NET 9.0",
  "timestamp": "2025-10-04T12:00:00.000Z"
}
```

### Weather Forecast (Example)

```http
GET /weatherforecast
```

**Response:**
```json
[
  {
    "date": "2025-10-05",
    "temperatureC": 20,
    "temperatureF": 68,
    "summary": "Warm"
  }
]
```

## 🔐 CORS Configuration

CORS is configured to allow requests from:
- `http://localhost:4200` (Angular development server)

To add more origins, edit the CORS policy in `Program.cs`:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:4200", "https://yourproductiondomain.com")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});
```

## 🗄️ Database Setup (Optional)

### 1. Configure Connection String

Add to `appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=HackYeah2025;Trusted_Connection=True;MultipleActiveResultSets=true"
  }
}
```

### 2. Create DbContext

Create a new file `Data/ApplicationDbContext.cs`:

```csharp
using Microsoft.EntityFrameworkCore;

namespace Backend.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    // Add your DbSets here
    // public DbSet<YourEntity> YourEntities { get; set; }
}
```

### 3. Register DbContext

In `Program.cs`, add before `var app = builder.Build();`:

```csharp
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
```

### 4. Create and Apply Migrations

```powershell
# Install EF Core tools globally (if not already installed)
dotnet tool install --global dotnet-ef

# Create initial migration
dotnet ef migrations add InitialCreate

# Apply migration to database
dotnet ef database update
```

## 📝 Creating New Controllers

```powershell
# Create a new controller file in Controllers folder
# Example: Controllers/ProductsController.cs
```

```csharp
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly ILogger<ProductsController> _logger;

    public ProductsController(ILogger<ProductsController> logger)
    {
        _logger = logger;
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        // Your logic here
        return Ok(new { message = "Get all products" });
    }

    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        // Your logic here
        return Ok(new { id, message = "Get product by id" });
    }

    [HttpPost]
    public IActionResult Create([FromBody] object product)
    {
        // Your logic here
        return CreatedAtAction(nameof(GetById), new { id = 1 }, product);
    }

    [HttpPut("{id}")]
    public IActionResult Update(int id, [FromBody] object product)
    {
        // Your logic here
        return Ok(new { id, message = "Product updated" });
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        // Your logic here
        return NoContent();
    }
}
```

## 🧪 Testing

You can test the API using:

1. **Browser**: Navigate to `http://localhost:5000/api/test`
2. **Swagger UI**: Navigate to `http://localhost:5000/openapi/v1.json` (in development mode)
3. **Postman**: Import and test endpoints
4. **curl**:
   ```powershell
   curl http://localhost:5000/api/test
   ```

## 🔒 Environment Variables

Create `appsettings.Development.json` for development-specific settings (already created):

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "Kestrel": {
    "Endpoints": {
      "Http": {
        "Url": "http://localhost:5000"
      }
    }
  }
}
```

## 📦 Adding NuGet Packages

```powershell
# Example: Add a new package
dotnet add package PackageName

# Example: Add JWT authentication
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
```

## 🐛 Common Issues

### Port Already in Use

```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process
taskkill /PID <process_id> /F
```

### SSL Certificate Issues

```powershell
# Trust the development certificate
dotnet dev-certs https --trust
```

## 📖 Useful Commands

```powershell
# Clean build artifacts
dotnet clean

# Restore packages
dotnet restore

# Build
dotnet build

# Run
dotnet run

# Watch (hot reload)
dotnet watch run

# Publish for production
dotnet publish -c Release

# Run tests (when added)
dotnet test
```

## 🚀 Deployment

For production deployment:

```powershell
# Build and publish
dotnet publish -c Release -o ./publish

# The published files will be in ./publish directory
# Deploy these to your hosting service (Azure, AWS, etc.)
```

---

**Need help?** Check the main [README.md](../README.md) for more information.
